const getInt = (int: string) => parseInt(int.replace(/\D/g, ""));

const result = "3 blue, 4 red".split(",").reduce((pv, cv) => {
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
}, {});

console.log(result);
