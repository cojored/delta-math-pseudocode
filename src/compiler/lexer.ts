import Keywords from "./Types/Keywords.js";
import Token from "./Types/Token.js";
import TokenType from "./Types/TokenType.js";

const StringToType = {
  Skippable: (str: string) => (str.match(/\s/gi) != null ? "skip" : false),

  Number: (str: string) =>
    str.charCodeAt(0) >= "0".charCodeAt(0) &&
    str.charCodeAt(0) <= "9".charCodeAt(0),
  BinaryOperator: ["+", "-", "*", "/"],
  Comparison: ["<", ">", "=", "≥", "≤", "≠"],

  SetEqual: ["⬅"],

  OpenParenthesis: ["("],
  CloseParenthesis: [")"],
  OpenBracket: ["{"],
  CloseBracket: ["}"],
  Comma: [","],

  Identifier: (str: string) => str.match(/[a-z ]/gi) != null,
};

export function tokenize(pseudocode: string): Token[] {
  const tokens: Token[] = [];
  const code = pseudocode.split("");
  const values = Object.values(StringToType);
  const keys = Object.keys(StringToType);

  while (code.length > 0) {
    let character = code[0];

    for (let val in values) {
      let value = values[val];
      if (typeof value === "function") {
        if (value(character)) {
          if (keys[val] === "Skippable") {
            code.shift();
            break;
          } else if (keys[val] === "Number") {
            let num = "";
            while (code.length > 0 && value(code[0])) num += code.shift();
            if (
              tokens[tokens.length - 1].type === TokenType.BinaryOperator &&
              tokens[tokens.length - 2].type != TokenType.Number &&
              tokens[tokens.length - 2].type != TokenType.Identifier
            ) {
              tokens.splice(tokens.length - 1, tokens.length);
              num = "-" + num;
            }
            tokens.push({ value: num, type: (TokenType as any)[keys[val]] });
            break;
          } else if (keys[val] === "Identifier") {
            let str = "";

            while (code.length > 0 && value(code[0])) str += code.shift();

            str = str.trim();

            if (Keywords[str]) tokens.push({ value: str, type: Keywords[str] });
            else
              tokens.push({ value: str, type: (TokenType as any)[keys[val]] });
            break;
          }
        }
      } else if (value.includes(character)) {
        tokens.push({ value: character, type: (TokenType as any)[keys[val]] });
        code.shift();
        break;
      }

      if (Number(val) === 10 && character === code[0])
        throw new Error("Could not recognize character: " + character);
    }
  }
  return tokens;
}
