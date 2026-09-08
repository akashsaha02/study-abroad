#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LOCAL_DEFAULTS,
  LOCAL_REQUIRED,
  LOCAL_URL_KEYS,
  PRODUCTION_BACKEND_KEYS,
  PRODUCTION_FRONTEND_KEYS,
  isLocalhostUrl,
  parseEnv,
} from "./env.mjs";

const root = process.cwd();
const errors = [];

function fail(message) {
  errors.push(message);
}

function readExample(relativePath) {
  const path = join(root, relativePath);
  if (!existsSync(path)) {
    fail(`Missing ${relativePath}`);
    return new Map();
  }
  return parseEnv(readFileSync(path, "utf8"));
}

const localExample = readExample(".env.example");
const productionExample = readExample(".env.production.example");

for (const key of LOCAL_REQUIRED) {
  if (!localExample.has(key)) {
    fail(`.env.example is missing ${key}`);
  }
}

for (const key of LOCAL_URL_KEYS) {
  const value = localExample.get(key) ?? LOCAL_DEFAULTS[key];
  if (value && !isLocalhostUrl(value)) {
    fail(`.env.example ${key} must be a localhost URL, got ${value}`);
  }
}

for (const key of PRODUCTION_FRONTEND_KEYS) {
  if (!productionExample.has(key)) {
    fail(`.env.production.example is missing frontend key ${key}`);
  }
}

for (const key of PRODUCTION_BACKEND_KEYS) {
  if (!productionExample.has(key)) {
    fail(`.env.production.example is missing backend key ${key}`);
  }
}

for (const key of LOCAL_URL_KEYS) {
  const value = productionExample.get(key);
  if (value && isLocalhostUrl(value)) {
    fail(`.env.production.example ${key} must not be localhost`);
  }
}

if (errors.length > 0) {
  console.error("Env validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Env examples are valid (local vs production keys).");
