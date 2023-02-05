import TokenType from "./TokenType.js";

const Keywords: Record<string, TokenType> = {
  DISPLAY: TokenType.ConsoleLog,
  RANDOM: TokenType.Random,
  "REPEAT UNTIL": TokenType.RepeatUntil,
  IF: TokenType.If,
  ELSE: TokenType.Else,
  REPEAT: TokenType.Repeat,
};

export default Keywords;
