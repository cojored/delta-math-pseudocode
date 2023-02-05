#!/usr/bin/env node
import compiler from "./compiler/compiler.js";
import fs from "fs";

let filename = process.argv[2];

fs.readFile(filename, function (err, contents) {
  if (err) throw err;
  compiler(contents.toString());
});
