/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Parser } from '../../../parser';
import { WrappingPrettyPrinter } from '../printer';
import { assertReprint, reprint } from './tools';

describe('complex queries — all node types', () => {
  test('kitchen-sink of various nodes', () => {
    const src = `FROM kibana_sample_data_logs, other_index METADATA _index, _id
      | WHERE bytes > 1000 AND (machine.ram >= 1024 OR NOT geo.dest == "US")
      | EVAL kib = bytes / 1024.0, tag = CONCAT("x-", TO_STRING(status)), big = machine.ram::double
      | STATS total = SUM(bytes), avg_ram = AVG(machine.ram) BY geo.dest, day = bucket(@timestamp, 1 day)
      | SORT total DESC NULLS LAST, geo.dest ASC
      | KEEP geo.dest, total, avg_ram, day
      | LIMIT 100`;
    const expected = `FROM kibana_sample_data_logs, other_index METADATA _index, _id
  | WHERE bytes > 1000 AND (machine.ram >= 1024 OR NOT geo.dest == "US")
  | EVAL
      kib = bytes / 1024.0, tag = CONCAT("x-", TO_STRING(status)),
      big = machine.ram::DOUBLE
  | STATS total = SUM(bytes), avg_ram = AVG(machine.ram)
        BY geo.dest, day = BUCKET(@timestamp, 1 day)
  | SORT total DESC NULLS LAST, geo.dest ASC
  | KEEP geo.dest, total, avg_ram, day
  | LIMIT 100`;

    assertReprint(src, expected);
  });

  test('functions, CASE, IN, LIKE, unary minus and NOT', () => {
    const src = `FROM index
        | EVAL a = ROUND(AVG(x), 2), b = CASE(y > 0, "pos", y < 0, "neg", "zero"), c = x IN (1, 2, 3), d = field LIKE "pattern*", e = -value, f = NOT flag`;
    const expected = `FROM index
  | EVAL
      a = ROUND(AVG(x), 2), b = CASE(y > 0, "pos", y < 0, "neg", "zero"),
      c = x IN (1, 2, 3), d = field LIKE "pattern*", e = -value, f = NOT flag`;

    assertReprint(src, expected);
  });

  test('DISSECT (APPEND_SEPARATOR option), GROK, RENAME, ENRICH (ON/WITH options)', () => {
    const src = `FROM logs
        | DISSECT message "%{date} %{+date} %{msg}" APPEND_SEPARATOR=" "
        | GROK message "%{IP:client} %{WORD:method}"
        | RENAME client AS client_ip, method AS http_method
        | ENRICH policy ON client_ip WITH country = geo_country, city = geo_city`;
    const expected = `FROM logs
  | DISSECT message "%{date} %{+date} %{msg}" APPEND_SEPARATOR = " "
  | GROK message "%{IP:client} %{WORD:method}"
  | RENAME client AS client_ip, method AS http_method
  | ENRICH policy
        ON client_ip
        WITH country = geo_country, city = geo_city`;

    assertReprint(src, expected);
  });

  test('RERANK with map literal, nested map and list', () => {
    const src = `FROM a | RERANK "search query text here" ON title, body WITH {"inference_id": "my-model", "top_n": 10, "nested": {"k": [1, 2, 3]}}`;
    const expected = `FROM a
  | RERANK "search query text here"
        ON title, body
        WITH {
            "inference_id": "my-model", "top_n": 10, "nested": {"k": [1, 2, 3]}}`;

    assertReprint(src, expected);
  });

  test('FORK with multiple branches', () => {
    const src = `FROM index | FORK (WHERE a > 1 | LIMIT 5) (WHERE b > 2 | SORT c | LIMIT 10) (KEEP d, e, f)`;
    const expected = `FROM index
  | FORK
      (
          WHERE a > 1
        | LIMIT 5
      )
      (
          WHERE b > 2
        | SORT c
        | LIMIT 10
      )
      (
          KEEP d, e, f
      )`;

    assertReprint(src, expected);
  });

  test('comments inside a FORK branch are preserved without splitting expressions', () => {
    const src = `FROM index | FORK
        (
          // before WHERE
          WHERE
          // before the predicate
          a > 1
          // before the pipe
          | LIMIT 5
        )
        (KEEP d, e, f)`;
    const expected = `FROM index
  | FORK
      (
          // before WHERE
          WHERE
            // before the predicate
            a > 1
        // before the pipe
        | LIMIT 5
      )
      (
          KEEP d, e, f
      )`;

    assertReprint(src, expected);
  });

  test('multi-line block comment inside a FORK branch re-indents continuation lines', () => {
    const { root } = Parser.parse(
      `FROM index | FORK (/* line one
         line two */ WHERE a > 1 | LIMIT 5) (KEEP d)`,
      { withFormatting: true }
    );
    const text = WrappingPrettyPrinter.print(root);
    expect(text).toBe(
      `FROM index
  | FORK
      (
          /* line one
                   line two */ WHERE a > 1
        | LIMIT 5
      )
      (
          KEEP d
      )`
    );
  });

  test('top comment before first inner command forces correct indentation', () => {
    const { root } = Parser.parse(
      `FROM index | FORK (\n// asf\nWHERE a > 1 | LIMIT 5) (WHERE b > 2 | SORT c | LIMIT 10) (KEEP d, e, f)`,
      { withFormatting: true }
    );
    const text = WrappingPrettyPrinter.print(root);

    expect(text).toBe(
      `FROM index
  | FORK
      (
          // asf
          WHERE a > 1
        | LIMIT 5
      )
      (
          WHERE b > 2
        | SORT c
        | LIMIT 10
      )
      (
          KEEP d, e, f
      )`
    );
  });

  test('time intervals and params (named and unnamed)', () => {
    const src = `FROM index
        | WHERE @timestamp > NOW() - 1 hour AND id == ?param AND name == ?
        | EVAL bucket = DATE_TRUNC(1 week, @timestamp)`;
    const expected = `FROM index
  | WHERE @timestamp > NOW() - 1 hour AND id == ?param AND name == ?
  | EVAL bucket = DATE_TRUNC(1 week, @timestamp)`;

    assertReprint(src, expected);
  });

  test('header SET commands with main query', () => {
    const src = `SET timeout = "30s"; SET max_results = 100; FROM index | LIMIT 10`;
    const expected = `SET timeout = "30s";
SET max_results = 100;
FROM index | LIMIT 10`;

    assertReprint(src, expected);
  });

  test('postfix IS [NOT] NULL, RLIKE, NOT IN, parens', () => {
    const src = `FROM a | WHERE x IS NOT NULL AND y IS NULL AND name RLIKE "a.*" AND z NOT IN (1, 2)`;
    const expected = `FROM a
  | WHERE x IS NOT NULL AND y IS NULL AND name RLIKE "a.*" AND (z NOT IN (1, 2))`;

    assertReprint(src, expected);
  });

  test('all literal kinds: boolean, null, string, integer, double + postfix', () => {
    const src = `ROW b = TRUE, c = FALSE, n = NULL, s = "str", i = 42, d = 3.14, x = a IS NULL`;
    const expected = `ROW b = TRUE, c = FALSE, n = NULL, s = "str", i = 42, d = 3.14, x = a IS NULL`;

    assertReprint(src, expected);
  });
});

describe('binary expression wrapping', () => {
  test('long AND chain breaks with leading operators', () => {
    const src = `FROM a | WHERE aaaaaaaaaaaaaaaaaaaa == 1 AND bbbbbbbbbbbbbbbbbbbb == 2 AND cccccccccccccccccccc == 3 AND dddddddddddddddddddd == 4`;
    const expected = `FROM a
  | WHERE
      aaaaaaaaaaaaaaaaaaaa == 1 AND bbbbbbbbbbbbbbbbbbbb == 2
        AND cccccccccccccccccccc == 3
        AND dddddddddddddddddddd == 4`;

    assertReprint(src, expected);
  });
});

describe('width sensitivity', () => {
  const query = `FROM index | WHERE field == "value" | STATS COUNT() BY category | LIMIT 10`;

  test('wide page keeps the whole pipeline on one line', () => {
    expect(reprint(query, { wrap: 120 })).toBe(
      `FROM index | WHERE field == "value" | STATS COUNT() BY category | LIMIT 10`
    );
  });

  test('narrow page breaks every pipe', () => {
    expect(reprint(query, { wrap: 40 })).toBe(
      `FROM index
  | WHERE field == "value"
  | STATS COUNT() BY category
  | LIMIT 10`
    );
  });
});

describe('options', () => {
  test('lowercase and multiline', () => {
    const text = reprint(`FROM index | WHERE a == 1 | STATS COUNT() BY b | SORT b | LIMIT 5`, {
      lowercase: true,
      multiline: true,
    });

    expect(text).toBe(
      `from index
  | where a == 1
  | stats count() by b
  | sort b
  | limit 5`
    );
  });

  test('indent prefixes every line', () => {
    const text = reprint(`FROM index | WHERE a == 1 | LIMIT 5`, {
      indent: '>>',
      multiline: true,
    });

    expect(text).toBe(`>>FROM index
>>  | WHERE a == 1
>>  | LIMIT 5`);
  });
});

describe('idempotency', () => {
  const queries = [
    `FROM kibana_sample_data_logs, other_index METADATA _index, _id | WHERE bytes > 1000 AND (machine.ram >= 1024 OR NOT geo.dest == "US") | EVAL kib = bytes / 1024.0, big = machine.ram::double | STATS total = SUM(bytes) BY geo.dest, day = BUCKET(@timestamp, 1 day) | SORT total DESC NULLS LAST | KEEP geo.dest, total | LIMIT 100`,
    `FROM a | RERANK "search query text here" ON title, body WITH {"inference_id": "my-model", "top_n": 10}`,
    `FROM logs | DISSECT message "%{a} %{b}" APPEND_SEPARATOR=" " | ENRICH policy ON c WITH d = e, f = g`,
    `ROW b = TRUE, n = NULL, x = a IS NULL, y = -value, z = NOT flag`,
  ];

  test.each(queries)('printing twice is stable: %s', (query) => {
    const once = reprint(query);
    const twice = reprint(once);

    expect(twice).toBe(once);
  });
});
