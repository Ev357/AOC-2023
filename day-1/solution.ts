const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const lines = input.split("\n").filter(Boolean);

const sum = lines.reduce((pv, cv) => {
  const numbers = cv.replace(/\D/g, "");

  const firstNumber = numbers[0];
  const lastNumber = numbers[numbers.length - 1];

  const calValue = parseInt(`${firstNumber}${lastNumber}`);

  return pv + calValue;
}, 0);

console.log(sum);

export {};
