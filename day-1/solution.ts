const file = Bun.file("input.txt");

const text = await file.text();

console.log(text);

export {};
