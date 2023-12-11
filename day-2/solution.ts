const file = Bun.file("input.txt");
//const file = Bun.file("small-input.txt");
const input = await file.text();

const lines = input.split("\n").filter(Boolean);

const redCubeCount = 12;
const greenCubeCount = 13;
const blueCubeCount = 14;

const getInt = (int: string) => parseInt(int.replace(/\D/g, ""));

const sum = lines.reduce((pv, cv) => {
  const gameId = getInt(cv.split(":")[0]);
  const rounds = cv
    .split(":")[1]
    .split(";")
    .map((round) =>
      round
        .split(",")
        .reduce<Partial<{ red: number; green: number; blue: number }>>(
          (pv, cv) => {
            const color = cv.match(/red|green|blue/);
            const amount = getInt(cv);

            switch (color[0]) {
              case "red":
                pv["red"] = amount;
                break;
              case "green":
                pv["green"] = amount;
                break;
              case "blue":
                pv["blue"] = amount;
                break;
            }

            return pv;
          },
          {}
        )
    );

  const isPossible =
    rounds.filter((round) => {
      if (round.red > redCubeCount) {
        return false;
      }
      if (round.green > greenCubeCount) {
        return false;
      }
      if (round.blue > blueCubeCount) {
        return false;
      }

      return true;
    }).length === rounds.length;

  if (isPossible) {
    return pv + gameId;
  }
  return pv;
}, 0);

console.log(sum);

export {};
