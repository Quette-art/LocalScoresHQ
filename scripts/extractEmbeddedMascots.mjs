import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const images = [
  ["public/mascots/mt-zion-prep.svg", "public/mascots/mt-zion-prep.webp"],
  ["public/mascots/score-marks/mt-zion-prep-mzp.svg", "public/mascots/score-marks/mt-zion-prep-mzp.webp"],
  ["public/mascots/riverdale-baptist.svg", "public/mascots/riverdale-baptist.webp"],
  ["public/mascots/score-marks/riverdale-baptist-rbs.svg", "public/mascots/score-marks/riverdale-baptist-rbs.webp"],
];

for (const [source, output] of images) {
  const svg = await readFile(source, "utf8");
  const match = svg.match(/data:image\/webp;base64,([^"']+)/);

  if (!match) {
    throw new Error(`No embedded WebP picture found in ${source}`);
  }

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, Buffer.from(match[1], "base64"));
  console.log(`Extracted ${output}`);
}

// The missing-team artwork is already stored as one exact transparent WebP sprite.
// Bundle that image into the app as a data URI at build time so iOS/PWA caching,
// protected preview asset requests, and stale public-file fallbacks cannot blank it.
const exactBatchSpritePath =
  "public/mascots/exact-batch/missing-team-batch-sprite.webp";
const exactBatchOutput = "src/generated/exactBatchSpriteData.js";
const exactBatchBytes = await readFile(exactBatchSpritePath);
const exactBatchDataUri = `data:image/webp;base64,${exactBatchBytes.toString("base64")}`;

await mkdir(dirname(exactBatchOutput), { recursive: true });
await writeFile(
  exactBatchOutput,
  `export const EXACT_BATCH_SPRITE_DATA = ${JSON.stringify(exactBatchDataUri)};\n`
);
console.log(`Embedded ${exactBatchSpritePath} into ${exactBatchOutput}`);
