const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
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

  const minSet = rounds.reduce(
    (pv, cv) => {
      if (cv.red > pv.red) {
        pv.red = cv.red;
      }
      if (cv.green > pv.green) {
        pv.green = cv.green;
      }
      if (cv.blue > pv.blue) {
        pv.blue = cv.blue;
      }

      return pv;
    },
    { red: 0, green: 0, blue: 0 }
  );

  const power = minSet.red * minSet.green * minSet.blue;

  return pv + power;
}, 0);

console.log(sum);

export {};
