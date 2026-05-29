/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PromQLBasicPrettyPrinter } from '../../../embedded_languages/promql/pretty_print';
import { BasicPrettyPrinter } from '../../../pretty_print';
import {
  pqlAt,
  pqlBinary,
  pqlFunc,
  pqlLabel,
  pqlLabels,
  pqlNum,
  pqlOffset,
  pqlParens,
  pqlSel,
  pqlStr,
  pqlSubquery,
  pqlTime,
  pqlUnary,
} from '../promql_nodes';
import { cmd } from '../command';
import { qry } from '../query';

const print = (node: Parameters<typeof PromQLBasicPrettyPrinter.print>[0]) =>
  PromQLBasicPrettyPrinter.print(node);

describe('pqlTime', () => {
  test('simple duration', () => expect(pqlTime('5m') + '').toBe('5m'));
  test('compound duration', () => expect(pqlTime('1h30m') + '').toBe('1h30m'));
  test('toString()', () => expect(pqlTime('10s') + '').toBe('10s'));
});

describe('pqlNum', () => {
  test('integer', () => expect(pqlNum(42) + '').toBe('42'));
  test('negative integer', () => expect(pqlNum(-7) + '').toBe('-7'));
  test('decimal', () => expect(pqlNum(3.14) + '').toBe('3.14'));
  test('whole decimal keeps .0', () => expect(pqlNum(5.0) + '').toBe('5'));
  test('toString() integer', () => expect(pqlNum(1) + '').toBe('1'));
});

describe('pqlStr', () => {
  test('simple string', () => expect(pqlStr('hello') + '').toBe('"hello"'));
  test('string with special chars', () => expect(pqlStr('a\nb') + '').toBe('"a\\nb"'));
  test('toString()', () => expect(pqlStr('ok') + '').toBe('"ok"'));
});

describe('pqlLabel', () => {
  test('equality match', () => {
    const label = pqlLabel('job', '=', 'api');

    expect(label.type).toBe('label');
    expect(label.name).toBe('job');
    expect(label.operator).toBe('=');
  });

  test('regex match', () => {
    const label = pqlLabel('status', '=~', '2..');
    expect(label.operator).toBe('=~');
    expect(label + '').toBe('status=~"2.."');
  });

  test('no value', () => {
    const label = pqlLabel('env', '!=');
    expect(label.value).toBeUndefined();
  });
});

describe('pqlLabels', () => {
  test('object shorthand', () => {
    const lm = pqlLabels({ job: 'api', env: 'prod' });

    expect(print(pqlSel('m', lm.args))).toBe('m{job="api", env="prod"}');
  });

  test('explicit label array', () => {
    const lm = pqlLabels([pqlLabel('s', '=~', '2..')]);

    expect(lm.type).toBe('label-map');
    expect(lm.args).toHaveLength(1);
  });

  test('toString()', () => {
    const lm = pqlLabels({ x: 'y' });

    expect(lm.type).toBe('label-map');
    expect(lm + '').toBe('{x="y"}');
  });
});

describe('pqlSel', () => {
  test('metric only', () => {
    expect(pqlSel('http_requests_total') + '').toBe('http_requests_total');
  });

  test('no metric (undefined)', () => expect(pqlSel() + '').toBe(''));

  test('range vector', () => expect(pqlSel('up', '5m') + '').toBe('up[5m]'));

  test('with label object', () =>
    expect(pqlSel('metric', { job: 'api' }) + '').toBe('metric{job="api"}'));

  test('with label object and range', () =>
    expect(pqlSel('metric', { job: 'api' }, '5m') + '').toBe('metric{job="api"}[5m]'));

  test('with explicit label array', () =>
    expect(pqlSel('metric', [pqlLabel('s', '=~', '2..')]) + '').toBe('metric{s=~"2.."}'));

  test('label-only selector (no metric)', () =>
    expect(pqlSel(undefined, { job: 'api' }) + '').toBe('{job="api"}'));

  test('multiple labels', () =>
    expect(pqlSel('m', { a: '1', b: '2' }) + '').toBe('m{a="1", b="2"}'));

  test('toString()', () => expect(String(pqlSel('bytes_in', '1m'))).toBe('bytes_in[1m]'));
});

describe('pqlFunc', () => {
  test('single arg', () => expect(pqlFunc('abs', pqlSel('metric')) + '').toBe('abs(metric)'));

  test('no args', () => expect(pqlFunc('time', []) + '').toBe('time()'));

  test('rate with range vector', () =>
    expect(pqlFunc('rate', pqlSel('http_requests_total', '5m')) + '').toBe(
      'rate(http_requests_total[5m])'
    ));

  test('multiple args (array)', () =>
    expect(pqlFunc('histogram_quantile', [pqlNum(0.95), pqlSel('le', '5m')]) + '').toBe(
      'histogram_quantile(0.95, le[5m])'
    ));

  test('aggregation with by (after, default)', () =>
    expect(pqlFunc('sum', pqlSel('metric'), { by: ['job'] }) + '').toBe('sum(metric) by (job)'));

  test('aggregation with by (before)', () =>
    expect(pqlFunc('sum', pqlSel('metric'), { by: ['job'], groupingPosition: 'before' }) + '').toBe(
      'sum by (job) (metric)'
    ));

  test('aggregation with without', () =>
    expect(pqlFunc('avg', pqlSel('metric'), { without: ['instance'] }) + '').toBe(
      'avg(metric) without (instance)'
    ));

  test('toString()', () => expect(String(pqlFunc('rate', pqlSel('m', '1m')))).toBe('rate(m[1m])'));
});

describe('pqlBinary', () => {
  const a = pqlSel('a');
  const b = pqlSel('b');

  test('arithmetic +', () => expect(pqlBinary('+', a, b) + '').toBe('a + b'));

  test('arithmetic -', () => expect(pqlBinary('-', a, b) + '').toBe('a - b'));

  test('arithmetic *', () => expect(pqlBinary('*', a, b) + '').toBe('a * b'));

  test('arithmetic /', () => expect(pqlBinary('/', a, b) + '').toBe('a / b'));

  test('comparison >', () => expect(pqlBinary('>', a, b) + '').toBe('a > b'));

  test('comparison with bool', () =>
    expect(pqlBinary('>', a, b, { bool: true }) + '').toBe('a > bool b'));

  test('set operator and', () => expect(pqlBinary('and', a, b) + '').toBe('a and b'));

  test('set operator or', () => expect(pqlBinary('or', a, b) + '').toBe('a or b'));

  test('vector matching on', () =>
    expect(pqlBinary('/', a, b, { on: ['job'] }) + '').toBe('a / on(job) b'));

  test('vector matching ignoring', () =>
    expect(pqlBinary('/', a, b, { ignoring: ['instance'] }) + '').toBe('a / ignoring(instance) b'));

  test('vector matching with group_left', () =>
    expect(pqlBinary('*', a, b, { on: ['job'], groupLeft: [] }) + '').toBe(
      'a * on(job) group_left b'
    ));

  test('vector matching with group_right and labels', () =>
    expect(pqlBinary('*', a, b, { on: ['dc'], groupRight: ['env'] }) + '').toBe(
      'a * on(dc) group_right(env) b'
    ));

  test('toString()', () => expect(String(pqlBinary('+', a, b))).toBe('a + b'));
});

describe('pqlUnary', () => {
  test('negate', () => expect(pqlUnary('-', pqlSel('metric')) + '').toBe('-metric'));

  test('positive', () => expect(pqlUnary('+', pqlSel('metric')) + '').toBe('+metric'));
});

describe('pqlParens', () => {
  test('wraps expression', () => expect(pqlParens(pqlSel('metric')) + '').toBe('(metric)'));

  test('nested parens', () => expect(pqlParens(pqlParens(pqlSel('m'))) + '').toBe('((m))'));
});

describe('pqlSubquery', () => {
  test('without resolution', () =>
    expect(pqlSubquery(pqlSel('metric'), '30m') + '').toBe('metric[30m:]'));

  test('with resolution', () =>
    expect(pqlSubquery(pqlSel('metric'), '30m', '5m') + '').toBe('metric[30m:5m]'));

  test('function inside subquery', () =>
    expect(pqlSubquery(pqlFunc('rate', pqlSel('m', '5m')), '1h') + '').toBe('rate(m[5m])[1h:]'));
});

describe('pqlOffset', () => {
  test('positive offset', () => {
    const o = pqlOffset('5m');

    expect(o.type).toBe('offset');
    expect(o.negative).toBe(false);
    expect(o + '').toBe('offset 5m');
  });

  test('negative offset', () => {
    const o = pqlOffset('5m', true);

    expect(o.negative).toBe(true);
  });
});

describe('pqlAt', () => {
  test('start()', () => {
    const a = pqlAt('start()');

    expect(a.type).toBe('at');
    expect(a.value).toBe('start()');
  });

  test('end()', () => {
    const a = pqlAt('end()');

    expect(a.value).toBe('end()');
    expect(a.type).toBe('at');
  });

  test('timestamp', () => {
    const a = pqlAt('1609459200');

    expect(a.type).toBe('at');
    expect((a.value as { value: string }).value).toBe('1609459200');
  });

  test('negative', () => {
    const a = pqlAt('1234567890', true);

    expect(a.negative).toBe(true);
  });
});

describe('composition', () => {
  test('rate of labelled range vector', () =>
    expect(print(pqlFunc('rate', pqlSel('http_requests_total', { job: 'api' }, '5m')))).toBe(
      'rate(http_requests_total{job="api"}[5m])'
    ));

  test('sum of rate by job', () =>
    expect(
      print(pqlFunc('sum', pqlFunc('rate', pqlSel('http_requests_total', '5m')), { by: ['job'] }))
    ).toBe('sum(rate(http_requests_total[5m])) by (job)'));

  test('error ratio binary expression', () => {
    const errors = pqlFunc('rate', pqlSel('errors_total', '5m'));
    const total = pqlFunc('rate', pqlSel('requests_total', '5m'));

    expect(print(pqlBinary('/', errors, total))).toBe(
      'rate(errors_total[5m]) / rate(requests_total[5m])'
    );
  });
});

describe('hole interpolation in ES|QL synth templates', () => {
  test('pqlSel as PROMQL command hole', () => {
    const sel = pqlSel('bytes_in', { job: 'prometheus' });
    const node = cmd`PROMQL (${sel})`;

    expect(BasicPrettyPrinter.command(node)).toBe('PROMQL (bytes_in{job="prometheus"})');
  });

  test('pqlFunc as PROMQL command hole', () => {
    const expr = pqlFunc('rate', pqlSel('http_requests_total', '5m'));
    const node = cmd`PROMQL (${expr})`;

    expect(BasicPrettyPrinter.command(node)).toBe('PROMQL (rate(http_requests_total[5m]))');
  });

  test('pqlBinary as PROMQL command hole', () => {
    const a = pqlSel('errors_total');
    const b = pqlSel('requests_total');
    const node = cmd`PROMQL (${pqlBinary('/', a, b)})`;

    expect(BasicPrettyPrinter.command(node)).toBe('PROMQL (errors_total / requests_total)');
  });

  test('pqlSel in full ES|QL query', () => {
    const expr = pqlFunc('sum', pqlSel('metric', '5m'), { by: ['job'] });
    const node = qry`PROMQL (${expr})`;

    expect(BasicPrettyPrinter.print(node)).toBe('PROMQL (sum(metric[5m]) by (job))');
  });
});
