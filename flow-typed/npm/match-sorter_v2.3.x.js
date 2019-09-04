// flow-typed signature: 4ca6a0e92c7f07dbb424299e1f9b97d3
// flow-typed version: c6154227d1/match-sorter_v2.3.x/flow_>=v0.104.x

type $npm$matchSorter$KeyFn<T> = (item: T) => mixed;
type $npm$matchSorter$KeyObj = {
  key: string,
  minRanking?: number,
  maxRanking?: number,
  threshold?: number,
  ...
};

type $npm$matchSorter$Rankings = {
  CASE_SENSITIVE_EQUAL: number,
  EQUAL: number,
  STARTS_WITH: number,
  WORD_STARTS_WITH: number,
  STRING_CASE: number,
  STRING_CASE_ACRONYM: number,
  CONTAINS: number,
  ACRONYM: number,
  MATCHES: number,
  NO_MATCH: number,
  ...
};

type $npm$matchSorter$CaseRankings = {
  CAMEL: number,
  PASCAL: number,
  KEBAB: number,
  SNAKE: number,
  NO_CASE: number,
  ...
};

declare module 'match-sorter' {
  declare type Options<T> = {
    keys: Array<string | $npm$matchSorter$KeyFn<T> | $npm$matchSorter$KeyObj>,
    threshold?: number,
    keepDiacritics?: boolean,
    ...
  };

  declare module.exports: {
    <T>(collection: Array<T>, query: string, opts?: Options<T>): Array<T>,
    rankings: $npm$matchSorter$Rankings,
    caseRankings: $npm$matchSorter$CaseRankings,
    ...
  };
}
