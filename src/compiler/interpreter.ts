import Statement, { StatementKind } from "./Types/Statement.js";
import TokenType from "./Types/TokenType.js";

let vars: any = {};

const math: any = {
  "+": (left: number, right: number) => left + right,
  "-": (left: number, right: number) => left - right,
  "*": (left: number, right: number) => left * right,
  "/": (left: number, right: number) => left / right,
};

const compare: any = {
  ">": (left: number, right: number) => left > right,
  "<": (left: number, right: number) => left < right,
  "=": (left: number, right: number) => left === right,
  "≥": (left: number, right: number) => left >= right,
  "≤": (left: number, right: number) => left <= right,
  "≠": (left: number, right: number) => left != right,
};

export default function interpret(ast: Statement[]) {
  while (ast.length > 0) {
    let statement = ast[0];

    if (statement.kind === StatementKind.ConsoleLog) {
      let content = statement.content;
      console.log(vars[content]);
      ast.shift();
    } else if (statement.kind === StatementKind.Assignment) {
      if (!statement.value.kind) {
        if (vars[statement.value.value])
          vars[statement.name] = vars[statement.value.value];
        else
          vars[statement.name] =
            statement.value.type === TokenType.Number
              ? Number(statement.value.value)
              : statement.value.value;
      } else if (statement.value.kind === StatementKind.BinaryOperation) {
        let state: any = statement.value;

        if (state.left.type === TokenType.Identifier)
          state.left.value = vars[state.left.value];
        if (state.right.type === TokenType.Identifier)
          state.right.value = vars[state.right.value];

        let value = math[state.operator.value](
          Number(state.left.value),
          Number(state.right.value)
        );
        while (state.additonal.length > 0) {
          let token = state.additonal.shift()!;
          if (token.right.type === TokenType.Identifier)
            token.right.value = vars[token.right.value];
          value = math[token.operator.value](value, Number(token.right.value));
        }

        vars[statement.name] = value;
      } else if (statement.value.kind === StatementKind.Random) {
        let state: any = statement.value;

        if (state.start.type === TokenType.Identifier)
          state.start.value = vars[state.start.value];
        if (state.end.type === TokenType.Identifier)
          state.end.value = vars[state.end.value];

        let value = Math.floor(
          Math.random() *
            (Number(state.end.value) - Number(state.start.value)) +
            Number(state.start.value)
        );

        vars[statement.name] = value;
      }
      ast.shift();
    } else if (statement.kind === StatementKind.If) {
      if (statement.left.type === TokenType.Identifier)
        statement.left.value = vars[statement.left.value];
      if (statement.right.type === TokenType.Identifier)
        statement.right.value = vars[statement.right.value];

      let result = compare[statement.condition.value](
        Number(statement.left.value),
        Number(statement.right.value)
      );
      if (result === true && statement.true.length > 0)
        interpret(statement.true);
      else if (result === false && statement.false.length > 0)
        interpret(statement.false);
      ast.shift();
    } else if (statement.kind === StatementKind.RepeatUntil) {
      let state = {
        left: Object.assign({}, statement.left),
        right: Object.assign({}, statement.right),
      };

      if (state.left.type === TokenType.Identifier)
        statement.left.value = vars[state.left.value];
      if (state.right.type === TokenType.Identifier)
        statement.right.value = vars[state.right!.value];

      while (
        !compare[statement.condition.value](
          Number(statement.left.value),
          Number(statement.right.value)
        )
      ) {
        interpret(structuredClone(statement.code));

        if (state.left.type === TokenType.Identifier)
          statement.left.value = vars[state.left.value];
        if (state.right.type === TokenType.Identifier)
          statement.right.value = vars[state.right.value];
      }
      ast.shift();
    } else if (statement.kind === StatementKind.Repeat) {
      for (let i = 0; i < Number(statement.times.value); i++)
        interpret(structuredClone(statement.code));

      ast.shift();
    } else throw new Error("Syntax Error at: " + statement);
  }
}
