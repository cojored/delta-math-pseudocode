import Token from "./Token.js";

export enum StatementKind {
  Assignment,
  BinaryOperation,
  ConsoleLog,
  If,
  Random,
  RepeatUntil,
  Repeat,
}

export default interface Statement {
  [x: string]: any;
  kind: StatementKind;
}

export interface MathStatement {
  left: Token;
  operator: Token;
  right: Token;
  additonal: { operator: Token; right: Token }[];
  kind: StatementKind;
}

export interface IfStatement {
  left: Token;
  condition: Token;
  right: Token;
  true: Statement[];
  false: Statement[];
  kind: StatementKind;
}

export interface RepeatUntilStatement {
  left: Token;
  condition: Token;
  right: Token;
  code: Statement[];
  kind: StatementKind;
}

export interface RepeatStatement {
  times: Token;
  code: Statement[];
  kind: StatementKind;
}
