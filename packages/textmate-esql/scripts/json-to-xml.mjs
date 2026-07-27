#!/usr/bin/env node

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Licensed under the MIT License. See LICENSE.txt for details.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT  = join(__dirname, "..", "syntaxes", "esql.tmLanguage.json");
const OUTPUT = join(__dirname, "..", "syntaxes", "esql.tmLanguage");

const PLIST_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">`;
const PLIST_FOOTER = `</plist>`;

function escape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toPlist(value, indent = 1) {
  const pad = "\t".repeat(indent);

  if (typeof value === "string") return `<string>${escape(value)}</string>`;

  if (typeof value === "boolean") return value ? "<true/>" : "<false/>";

  if (typeof value === "number")
    return Number.isInteger(value)
      ? `<integer>${value}</integer>`
      : `<real>${value}</real>`;

  if (Array.isArray(value)) {
    if (value.length === 0) return "<array/>";
    const items = value
      .map((v) => `${pad}\t${toPlist(v, indent + 1)}`)
      .join("\n");
    return `<array>\n${items}\n${pad}</array>`;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value)
      .map(
        ([k, v]) =>
          `${pad}\t<key>${escape(k)}</key>\n${pad}\t${toPlist(v, indent + 1)}`,
      )
      .join("\n");
    return `<dict>\n${entries}\n${pad}</dict>`;
  }

  return "<string></string>";
}

const grammar = JSON.parse(readFileSync(INPUT, "utf-8"));
const xml = `${PLIST_HEADER}\n${toPlist(grammar, 0)}\n${PLIST_FOOTER}\n`;
writeFileSync(OUTPUT, xml);
console.log(`Generated ${OUTPUT}`);
