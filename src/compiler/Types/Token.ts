import TokenType from "./TokenType.js";

export default interface Token {
  value: string;
  type: TokenType;
}
