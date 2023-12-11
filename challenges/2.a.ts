import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/lib/Record";
import * as semigroup from "fp-ts/Semigroup";

const limits = { green: 13, blue: 14, red: 12 };

const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

interface Draw {
  red: string;
  green: string;
  blue: string;
}

interface format {
  games: [
    {
      game_no: number;
      results: Draw[];
    }
  ];
}

const result = pipe(
  input,
  (v) => v.split("\n"),
  A.map((v) =>
    pipe(
      O.Do,
      O.bind("list", () => O.of(v)),
      O.bind("id", ({ list }) => getList(list)),
      O.bind("values", ({ list }) => getValues(list))
    )
  )
);

console.log(result);

const getList = (list: string) =>
  pipe(
    list.split(":"),
    O.fromNullable,
    O.flatMap((x) => A.head(x)),
    O.map((v) => v.split(" ")),
    O.flatMap((x) => A.last(x)),
    O.map(parseInt)
  );

const getValues = (list: string) =>
  pipe(
    list.split(": "),
    O.fromNullable,
    O.flatMap((x) => A.last(x)),
    O.map((v) => v.split("; ")),
    O.map(A.map((x) => x.split(", "))),
    O.map((x) =>
      pipe(
        x,
        A.map((x) =>
          pipe(
            x,
            A.map((y) => y.split(" ").reverse()),
            (v) => v,
            Object.fromEntries
          )
        )
      )
    )
  );
