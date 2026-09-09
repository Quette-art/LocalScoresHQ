import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

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

// Rebuild the exact five-team artwork from the ORIGINAL generated image data
// stored in code. The previously committed public sprite was only ~15 KB and
// was not the actual 416,794-byte transparent image, which is why the logo
// container kept ending up blank even when the React/CSS logic was correct.
const exactBatchBase64Path =
  "src/data/exact-logo-chunks/missing-team-batch-sprite.base64.txt";
const exactBatchSpritePath =
  "public/mascots/exact-batch/missing-team-batch-sprite.webp";
const exactBatchOutput = "src/generated/exactBatchSpriteData.js";

const exactBatchBase64 = (await readFile(exactBatchBase64Path, "utf8"))
  .replace(/\s+/g, "");
const exactBatchBytes = Buffer.from(exactBatchBase64, "base64");
const exactBatchHash = createHash("sha256").update(exactBatchBytes).digest("hex");
const expectedSize = 416794;
const expectedHash = "8d361e1a4a1bc9d297ab68a7c27482c62755764568a786a2c5608d0ae223c686";

if (exactBatchBytes.length !== expectedSize || exactBatchHash !== expectedHash) {
  throw new Error(
    `Exact missing-team sprite failed verification: got ${exactBatchBytes.length} bytes / ${exactBatchHash}`
  );
}

await mkdir(dirname(exactBatchSpritePath), { recursive: true });
await writeFile(exactBatchSpritePath, exactBatchBytes);
console.log(
  `Restored exact missing-team sprite (${exactBatchBytes.length} bytes, ${exactBatchHash})`
);

// Also bundle the verified image into the app itself, so the team profile and
// score-card logos do not depend on a second network request or stale PWA cache.
const exactBatchDataUri = `data:image/webp;base64,${exactBatchBase64}`;
await mkdir(dirname(exactBatchOutput), { recursive: true });
await writeFile(
  exactBatchOutput,
  `export const EXACT_BATCH_SPRITE_DATA = ${JSON.stringify(exactBatchDataUri)};\n`
);
console.log(`Embedded verified exact sprite into ${exactBatchOutput}`);
