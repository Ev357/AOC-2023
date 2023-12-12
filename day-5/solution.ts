const file = Bun.file("input.txt");
// const file = Bun.file("small-input.txt");
const input = await file.text();

const sections = input.trim().split("\n\n");

const seeds = sections
  .shift()
  .split(":")[1]
  .trim()
  .split(" ")
  .map((seed) => +seed);

interface MapValues {
  destStart: number;
  sourceStart: number;
  rangeLength: number;
}

interface Maps {
  "seed-to-soil": MapValues[];
  "soil-to-fertilizer": MapValues[];
  "fertilizer-to-water": MapValues[];
  "water-to-light": MapValues[];
  "light-to-temperature": MapValues[];
  "temperature-to-humidity": MapValues[];
  "humidity-to-location": MapValues[];
}

const maps = sections.reduce((maps, section) => {
  const firstSplit = section.split(":");
  const mapName = firstSplit[0].split(" ")[0];

  const map = firstSplit[1]
    .trim()
    .split("\n")
    .map((map) => {
      const mapValues = map
        .trim()
        .split(" ")
        .map((map) => +map);

      return {
        destStart: mapValues[0],
        sourceStart: mapValues[1],
        rangeLength: mapValues[2],
      };
    });

  maps[mapName] = map;

  return maps;
}, {} as Maps);

const mappingOrder = [
  { mapName: "seed-to-soil", resultName: "soil", seedKey: "seed" },
  { mapName: "soil-to-fertilizer", resultName: "fertilizer", seedKey: "soil" },
  {
    mapName: "fertilizer-to-water",
    resultName: "water",
    seedKey: "fertilizer",
  },
  { mapName: "water-to-light", resultName: "light", seedKey: "water" },
  {
    mapName: "light-to-temperature",
    resultName: "temperature",
    seedKey: "light",
  },
  {
    mapName: "temperature-to-humidity",
    resultName: "humidity",
    seedKey: "temperature",
  },
  {
    mapName: "humidity-to-location",
    resultName: "location",
    seedKey: "humidity",
  },
] as const;

type Mapping = {
  [key in (typeof mappingOrder)[number]["resultName"] | "seed"]: number;
};

const mappedSeeds = seeds.map((seed) =>
  mappingOrder.reduce(
    (result, order) => {
      const seed = result[order.seedKey];

      const seedMap = maps[order.mapName].find(
        (map) =>
          seed >= map.sourceStart && seed <= map.sourceStart + map.rangeLength
      );

      if (seedMap) {
        result[order.resultName] =
          seed - seedMap.sourceStart + seedMap.destStart;
      } else {
        result[order.resultName] = seed;
      }

      return result;
    },
    { seed } as Mapping
  )
);

const partOne = () => Math.min(...mappedSeeds.map((seed) => seed.location));

console.log(partOne());

export {};
