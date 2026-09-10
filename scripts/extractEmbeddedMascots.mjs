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

const directImages = [
  [
    "src/data/exact-logo-chunks/v4/woodberry-forest-full-v4.base64.txt",
    "public/mascots/exact-v4/woodberry-forest-full-v4.webp",
  ],
  [
    "src/data/exact-logo-chunks/v4/woodberry-forest-score-v4.base64.txt",
    "public/mascots/exact-v4/woodberry-forest-score-v4.webp",
  ],
];

for (const [source, output] of directImages) {
  const base64 = (await readFile(source, "utf8")).replace(/\s+/g, "");
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length) throw new Error(`Empty embedded image: ${source}`);

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  console.log(`Restored exact image ${output} (${bytes.length} bytes)`);
}
