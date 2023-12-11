const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const regex = /one|two|three|four|five|six|seven|eight|nine|[1-9]/g;

const numbers = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
} as const;

const lines = input.split("\n").filter(Boolean);

const sum = lines.reduce((pv, cv) => {
  const matches = cv.match(regex);

  const numberArray = matches.map((match) => {
    if (match.length !== 1) {
      return numbers[match];
    }

    return match;
  });

  const firstNumber = numberArray[0];
  const lastNumber = numberArray[numberArray.length - 1];

  const calValue = parseInt(`${firstNumber}${lastNumber}`);

  return pv + calValue;
}, 0);

console.log(sum);

export {};
