const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const lines = input.trim().split("\n");

export {};
