const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const lines = input.trim().split("\n");

interface Scratchcard {
  card: number;
  winNumbers: number[];
  myNumbers: number[];
}

const getNumbers = (string: string) =>
  string
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((number) => +number);

const scratchcards = lines.reduce<Scratchcard[]>(
  (scratchcards, line, index) => {
    const firstSplit = line.split(":")[1].split("|");

    const scratchcard = {
      card: index + 1,
      winNumbers: getNumbers(firstSplit[0]),
      myNumbers: getNumbers(firstSplit[1]),
    };

    scratchcards.push(scratchcard);

    return scratchcards;
  },
  []
);

const getPoints = (winCount: number) => Math.trunc(Math.pow(2, winCount - 1));

const points = scratchcards.reduce((sum, scratchcard) => {
  const winCount = scratchcard.winNumbers.reduce((winCount, winNumber) => {
    if (scratchcard.myNumbers.includes(winNumber)) {
      return winCount + 1;
    }

    return winCount;
  }, 0);

  return sum + getPoints(winCount);
}, 0);

console.log(points);

export {};
