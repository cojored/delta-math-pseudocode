import Statement, {
  StatementKind,
  MathStatement,
  IfStatement,
  RepeatStatement,
  RepeatUntilStatement,
} from "./Types/Statement.js";
import Token from "./Types/Token.js";
import TokenType from "./Types/TokenType.js";

const peek = (tokens: Token[]) => tokens[1];

const current = (tokens: Token[]) => tokens[0];

export function parse(tokens: Token[]): Statement[] {
  let ast: Statement[] = [];

  while (tokens.length > 0) {
    let token = current(tokens);

    if (token.type === TokenType.Identifier) {
      if (peek(tokens)?.type === TokenType.SetEqual) {
        let identifier = {
          name: tokens.shift()!.value,
          kind: StatementKind.Assignment,
          value: {},
        };
        tokens.shift();
        if (peek(tokens)?.type === TokenType.BinaryOperator) {
          let math: MathStatement = {
            left: tokens.shift()!,
            operator: tokens.shift()!,
            right: tokens.shift()!,
            additonal: [],
            kind: StatementKind.BinaryOperation,
          };

          while (
            tokens.length > 0 &&
            current(tokens)?.type === TokenType.BinaryOperator
          )
            math.additonal.push({
              operator: tokens.shift()!,
              right: tokens.shift()!,
            });
          identifier.value = math;
        } else if (current(tokens).type === TokenType.Random) {
          tokens.shift();
          if (current(tokens)?.type === TokenType.OpenParenthesis) {
            tokens.shift();

            if (peek(tokens)?.type === TokenType.Comma) {
              tokens.splice(1, 1);
              let rand = {
                start: tokens.shift(),
                end: tokens.shift(),
                kind: StatementKind.Random,
              };
              if (current(tokens)?.type === TokenType.CloseParenthesis) {
                tokens.shift();
                identifier.value = rand;
              } else throw new Error("Syntax Error at: " + token.value);
            } else throw new Error("Syntax Error at: " + token.value);
          } else throw new Error("Syntax Error at: " + token.value);
        } else {
          identifier.value = tokens.shift()!;
        }

        ast.push(identifier);
      } else throw new Error("Syntax Error at: " + token.value);
    } else if (token.type === TokenType.ConsoleLog) {
      if (peek(tokens)?.type === TokenType.OpenParenthesis) {
        tokens.shift();
        tokens.shift();
        let content = tokens.shift()!.value;

        let identifier = {
          content: content,
          kind: StatementKind.ConsoleLog,
        };
        if (current(tokens)?.type === TokenType.CloseParenthesis) {
          tokens.shift();
          ast.push(identifier);
        }
      } else throw new Error("Syntax Error at: " + token.value);
    } else if (token.type === TokenType.If) {
      if (peek(tokens)?.type === TokenType.OpenParenthesis) {
        tokens.shift();
        tokens.shift();

        let identifier: IfStatement = {
          left: tokens.shift()!,
          condition: tokens.shift()!,
          right: tokens.shift()!,
          true: [],
          false: [],
          kind: StatementKind.If,
        };
        let tkns: Token[] = [];
        if (current(tokens)?.type === TokenType.CloseParenthesis) {
          if (peek(tokens)?.type === TokenType.OpenBracket) {
            tokens.shift();
            tokens.shift();
            let openBracket = 1;
            let closeBracket = 0;
            while (
              tokens.length > 0 &&
              !(
                current(tokens)?.type === TokenType.CloseBracket &&
                openBracket === closeBracket + 1
              )
            ) {
              if (current(tokens)?.type === TokenType.OpenBracket)
                openBracket += 1;
              if (current(tokens)?.type === TokenType.CloseBracket)
                closeBracket += 1;
              tkns.push(tokens.shift()!);
            }

            tokens.shift();
            if (tkns.length < 1)
              throw new Error("If Statement must have content");
            parse(tkns).forEach((i) => identifier.true.push(i));

            if (current(tokens)?.type === TokenType.Else) {
              tokens.shift();
              tokens.shift();
              tkns = [];
              let openBracket = 1;
              let closeBracket = 0;
              while (
                tokens.length > 0 &&
                !(
                  current(tokens)?.type === TokenType.CloseBracket &&
                  openBracket === closeBracket + 1
                )
              ) {
                if (current(tokens)?.type === TokenType.OpenBracket)
                  openBracket += 1;
                if (current(tokens)?.type === TokenType.CloseBracket)
                  closeBracket += 1;
                tkns.push(tokens.shift()!);
              }
              tokens.shift();
              if (tkns.length < 1)
                throw new Error("Else Statement must have content");
              parse(tkns).forEach((i) => identifier.false.push(i));
              ast.push(identifier);
            } else ast.push(identifier);
          } else throw new Error("Syntax Error at: " + token.value);
        } else throw new Error("Syntax Error at: " + token.value);
      } else throw new Error("Syntax Error at: " + token.value);
    } else if (token.type === TokenType.RepeatUntil) {
      if (peek(tokens)?.type === TokenType.OpenParenthesis) {
        tokens.shift();
        tokens.shift();

        let identifier: RepeatUntilStatement = {
          left: tokens.shift()!,
          condition: tokens.shift()!,
          right: tokens.shift()!,
          code: [],
          kind: StatementKind.RepeatUntil,
        };
        let tkns: Token[] = [];
        if (current(tokens)?.type === TokenType.CloseParenthesis) {
          if (peek(tokens)?.type === TokenType.OpenBracket) {
            tokens.shift();
            tokens.shift();
            let openBracket = 1;
            let closeBracket = 0;
            while (
              tokens.length > 0 &&
              !(
                current(tokens)?.type === TokenType.CloseBracket &&
                openBracket === closeBracket + 1
              )
            ) {
              if (current(tokens)?.type === TokenType.OpenBracket)
                openBracket += 1;
              if (current(tokens)?.type === TokenType.CloseBracket)
                closeBracket += 1;
              tkns.push(tokens.shift()!);
            }

            tokens.shift();
            if (tkns.length < 1)
              throw new Error("Repeat Until must have content");
            parse(tkns).forEach((i) => identifier.code.push(i));

            ast.push(identifier);
          } else throw new Error("Syntax Error at: " + token.value);
        } else throw new Error("Syntax Error at: " + token.value);
      } else throw new Error("Syntax Error at: " + token.value);
    } else if (token.type === TokenType.Repeat) {
      if (peek(tokens)?.type === TokenType.Number) {
        tokens.shift();

        let identifier: RepeatStatement = {
          times: tokens.shift()!,
          code: [],
          kind: StatementKind.Repeat,
        };

        tokens.shift();

        let tkns: Token[] = [];
        if (current(tokens)?.type === TokenType.OpenBracket) {
          tokens.shift();

          let openBracket = 1;
          let closeBracket = 0;
          while (
            tokens.length > 0 &&
            !(
              current(tokens)?.type === TokenType.CloseBracket &&
              openBracket === closeBracket + 1
            )
          ) {
            if (current(tokens)?.type === TokenType.OpenBracket)
              openBracket += 1;
            if (current(tokens)?.type === TokenType.CloseBracket)
              closeBracket += 1;
            tkns.push(tokens.shift()!);
          }

          tokens.shift();
          if (tkns.length < 1) throw new Error("Repeat must have content");
          parse(tkns).forEach((i) => identifier.code.push(i));

          ast.push(identifier);
        } else throw new Error("Syntax Error at: " + token.value);
      } else throw new Error("Syntax Error at: " + token.value);
    } else throw new Error("Syntax Error at: " + token.value);
  }
  return ast;
}
