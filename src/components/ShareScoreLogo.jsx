import React, { useEffect, useState } from "react";
import { getScoreMascot, getTeamMascot } from "../data/teamMascots";

const SCORE_ART = {
  Bullis: "/mascots/custom/score/bullis-score.svg",
  "Friendship Collegiate": "/mascots/custom/score/friendship-collegiate-score.svg",
  "Friendship Collegiate Academy":
    "/mascots/custom/score/friendship-collegiate-score.svg",
  "St. Albans": "/mascots/custom/score/st-albans-score.svg",
  Landon: "/mascots/custom/score/landon-score.svg",
  "National Christian Academy":
    "/mascots/custom/score/national-christian-academy-score.svg",
  "Rock Creek Christian Academy":
    "/mascots/custom/score/rock-creek-christian-academy-score.svg",
  "St. Mary's Ryken": "/mascots/custom/score/st-marys-ryken-score.svg",
  "St. Mary’s Ryken": "/mascots/custom/score/st-marys-ryken-score.svg",
  "St. Vincent Pallotti": "/mascots/custom/score/st-vincent-pallotti-score.svg",
  "St. Edward": "/mascots/st-edward-score-se.svg",
  "St Edward": "/mascots/st-edward-score-se.svg",
};

const getInitials = (teamName = "") =>
  teamName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

export const getShareGraphicMascot = (teamName = "") => {
  const name = teamName.trim();
  return SCORE_ART[name] || getScoreMascot(name) || getTeamMascot(name);
};

const isOpaqueNearWhite = (data, idx, threshold) => {
  const alpha = data[idx + 3];
  if (alpha < 18) return false;
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= threshold && max - min <= 22;
};

const knockOutEdgeWhite = (image) => {
  const srcW = Math.max(1, image.naturalWidth || image.width || 256);
  const srcH = Math.max(1, image.naturalHeight || image.height || 256);
  const scale = Math.min(640 / Math.max(srcW, srcH), 4);
  const width = Math.max(1, Math.round(srcW * scale));
  const height = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const visited = new Uint8Array(width * height);
  const stack = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    if (!isOpaqueNearWhite(data, pixel * 4, 236)) return;
    visited[pixel] = 1;
    stack.push(pixel);
  };

  const border = 2;
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < border; y += 1) {
      enqueue(x, y);
      enqueue(x, height - 1 - y);
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < border; x += 1) {
      enqueue(x, y);
      enqueue(width - 1 - x, y);
    }
  }

  while (stack.length) {
    const pixel = stack.pop();
    const i = pixel * 4;
    data[i + 3] = 0;
    const x = pixel % width;
    const y = (pixel / width) | 0;
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const i = pixel * 4;
      if (data[i + 3] < 18) continue;
      if (!isOpaqueNearWhite(data, i, 210)) continue;

      let touchesClear = false;
      for (let dy = -1; dy <= 1 && !touchesClear; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (data[(ny * width + nx) * 4 + 3] < 18) {
            touchesClear = true;
            break;
          }
        }
      }

      if (!touchesClear) continue;
      const whiteness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i + 3] = Math.round(data[i + 3] * Math.max(0, (250 - whiteness) / 50));
    }
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let opaque = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] < 16) continue;
      opaque += 1;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (opaque < width * height * 0.01 || maxX < minX) {
    return null;
  }

  ctx.putImageData(imageData, 0, 0);

  const pad = Math.round(Math.max(width, height) * 0.03);
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + 1 + pad * 2);
  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  cropped.getContext("2d").drawImage(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    cropW,
    cropH
  );

  return cropped.toDataURL("image/png");
};

export default function ShareScoreLogo({ teamName }) {
  const [src, setSrc] = useState("");
  const [ready, setReady] = useState(false);
  const mascot = getShareGraphicMascot(teamName);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setSrc("");

    if (!mascot) {
      setReady(true);
      return undefined;
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      let nextSrc = mascot;
      try {
        nextSrc = knockOutEdgeWhite(image) || mascot;
      } catch {
        nextSrc = mascot;
      }
      if (!cancelled) {
        setSrc(nextSrc);
        setReady(true);
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setSrc("");
        setReady(true);
      }
    };
    image.src = mascot;

    return () => {
      cancelled = true;
    };
  }, [mascot]);

  if (ready && !src) {
    return (
      <span className="share-score-mascot team-mascot-fallback" data-share-logo="ready">
        {getInitials(teamName)}
      </span>
    );
  }

  return (
    <span
      className="share-score-mascot"
      data-share-logo={ready ? "ready" : "loading"}
    >
      {src ? <img src={src} alt="" /> : null}
    </span>
  );
}
