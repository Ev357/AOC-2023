const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const lines = input.split("\n").filter(Boolean);

const isNumber = (number: unknown) => !isNaN(number as number);

const table = lines.map((line) =>
  line.split("").map((char) => {
    if (char === ".") {
      return "dot";
    }
    if (isNumber(char)) {
      return parseInt(char);
    }
    if (char === "*") {
      return "star";
    }

    return "symbol";
  })
);

const numbers = table.reduce<
  { row: number; numbers: { start: number; end: number; number: number }[] }[]
>((numbersTable, schemaRow, rowIndex) => {
  let numberIndex: number | undefined;
  let wasItemNumber = false;

  const row = schemaRow.reduce(
    (row, char, colIndex) => {
      if (isNumber(char)) {
        if (!wasItemNumber) {
          row.numbers.push({
            start: colIndex,
            end: colIndex,
            number: char,
          });
        } else {
          const number = row.numbers[row.numbers.length - 1];
          number.end = colIndex;
          number.number = parseInt(`${number.number}${char}`);
        }
        wasItemNumber = true;
      } else {
        wasItemNumber = false;
        numberIndex = undefined;
      }

      return row;
    },
    { row: rowIndex, numbers: [] }
  );

  numbersTable.push(row);

  return numbersTable;
}, []);

const getMinMax = (index: number, length: number) => {
  if (index >= length - 1) {
    return length - 1;
  }
  if (index <= 0) {
    return 0;
  }

  return index;
};

const checkLineNumber = (
  foundNumber: (typeof numbers)[number]["numbers"][number],
  line: (typeof table)[number]
) => {
  const gettedLine = line.slice(
    getMinMax(foundNumber.start - 1, line.length),
    getMinMax(foundNumber.end + 2, line.length)
  );

  if (gettedLine.includes("symbol")) {
    return true;
  } else {
    return false;
  }
};

const checkTopBottomXLine = (numberRow: (typeof numbers)[number]) => {
  const topLine = table[numberRow.row - 1];
  const bottomLine = table[numberRow.row + 1];
  const xLine = table[numberRow.row];

  return numberRow.numbers.reduce((doesHaveSymbol, number) => {
    let topCheck = false;
    let bottomCheck = false;

    if (topLine) {
      topCheck = checkLineNumber(number, topLine);
    }
    if (bottomLine) {
      bottomCheck = checkLineNumber(number, bottomLine);
    }
    const xCheck = checkLineNumber(number, xLine);

    if (topCheck || bottomCheck || xCheck) {
      return true;
    }

    return doesHaveSymbol;
  }, false);
};

// const sum = numbers.reduce((sum, row) => {
//   const rowSum = row.numbers.reduce((sum, number) => {
//     if (checkTopBottomXLine({ row: row.row, numbers: [number] })) {
//       return sum + number.number;
//     }

//     return sum;
//   }, 0);

//   return sum + rowSum;
// }, 0);

const stars = table.reduce<{ row: number; index: number }[]>(
  (starTable, tableRow, rowIndex) => {
    const row = tableRow.reduce((stars, char, colIndex) => {
      if (char === "star") {
        stars.push({
          row: rowIndex,
          index: colIndex,
        });
      }

      return stars;
    }, []);

    return [...starTable, ...row];
  },
  []
);

const checkLineStar = (starIndex: number, rowToCheck: number) => {
  const tableRow = table[rowToCheck];

  if (tableRow === undefined) {
    return [];
  }

  const numberIndexes = tableRow.reduce<(number | false)[]>(
    (indexes, char, index) => {
      if (
        index >= getMinMax(starIndex - 1, tableRow.length) &&
        index <= getMinMax(starIndex + 1, tableRow.length)
      ) {
        if (isNumber(char)) {
          indexes.push(index);
        } else {
          indexes.push(false);
        }
      }

      return indexes;
    },
    []
  );

  let indexes: number[] = [];

  if (numberIndexes[0] !== false && numberIndexes[2] !== false) {
    indexes = [numberIndexes[0], numberIndexes[2]];
  } else {
    const foundIndexes = numberIndexes.filter(Boolean) as number[];
    if (foundIndexes.length) {
      indexes = [foundIndexes[0]];
    }
  }

  return indexes.reduce<number[]>((catchedNumbers, indexValue) => {
    const number = numbers[rowToCheck].numbers.reduce<number[]>(
      (catchedNumbers, number) => {
        if (
          indexValue >= getMinMax(number.start, tableRow.length) &&
          indexValue <= getMinMax(number.end, tableRow.length)
        ) {
          catchedNumbers.push(number.number);
        }

        return catchedNumbers;
      },
      []
    );

    return [...catchedNumbers, ...number];
  }, []);
};

const sum = stars.reduce((sum, star) => {
  const topCheck = new Set(checkLineStar(star.index, star.row - 1));
  const bottomCheck = new Set(checkLineStar(star.index, star.row + 1));
  const xCheck = new Set(checkLineStar(star.index, star.row));

  const adjacents = [...topCheck, ...bottomCheck, ...xCheck];

  if (adjacents.length === 2) {
    const ratio = adjacents[0] * adjacents[1];
    return sum + ratio;
  }

  return sum;
}, 0);

console.log(sum);

export {};
