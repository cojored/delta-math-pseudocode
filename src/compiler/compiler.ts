import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import interpret from "./interpreter.js";

export default function run(code: string) {
  let token = tokenize(code);
  let par = parse(token);
  interpret(par);
}
