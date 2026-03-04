import fs from "node:fs";
import path from "node:path";

const jsObjectFormatter = ({ dictionary, file, platform }) => {
    const output = {};

    dictionary.allTokens.forEach((token) => {
      let current = output;
      const value = token.value ?? token.$value;

      token.path.forEach((key, index) => {
        if (index === token.path.length - 1) {
          current[key] = value;
        } else {
          current[key] ??= {};
          current = current[key];
        }
      });
    });

    convertTypographySizesToRem(output);

    const js = `export default ${JSON.stringify(output, null, 2)};\n`;

    const dts = `declare const tokens: ${toDts(output)};
export default tokens;
`;

    const buildPath =
      platform?.buildPath ??
      file.options?.platform?.buildPath ??
      file.options?.buildPath ??
      "";
    const jsPath = path.join(buildPath, file.destination);
    const dtsPath = jsPath.replace(/\.js$/, ".d.ts");

    fs.mkdirSync(path.dirname(jsPath), { recursive: true });
    fs.writeFileSync(dtsPath, dts);

    return js;
};

export default {
  jsObjectFormatter,
};

function convertTypographySizesToRem(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (key === "fontSizes" && value && typeof value === "object") {
      Object.keys(value).forEach((sizeKey) => {
        value[sizeKey] = expressionToRem(value[sizeKey]);
      });
      return;
    }

    if (key === "fontSize") {
      obj[key] = expressionToRem(value);
      return;
    }

    if (value && typeof value === "object") {
      convertTypographySizesToRem(value);
    }
  });
}

function expressionToRem(value) {
  if (typeof value !== "string") {
    return value;
  }

  const raw = value.trim();
  if (!raw) {
    return value;
  }

  if (/^-?\d+(\.\d+)?rem$/i.test(raw)) {
    return `${stripTrailingZeros(Number.parseFloat(raw))}rem`;
  }

  if (/^-?\d+(\.\d+)?px$/i.test(raw)) {
    const px = Number.parseFloat(raw);
    return `${stripTrailingZeros(px / 16)}rem`;
  }

  const expr = raw
    .replace(/\broundTo\s*\(/g, "Math.round(")
    .replace(/\^/g, "**");

  const sanitized = expr.replace(/Math\.round/g, "");
  if (!/^[\d\s+\-*/().,]*$/.test(sanitized)) {
    return value;
  }

  try {
    const result = Function(`"use strict"; return (${expr});`)();
    if (typeof result !== "number" || !Number.isFinite(result)) {
      return value;
    }
    return `${stripTrailingZeros(result / 16)}rem`;
  } catch {
    return value;
  }
}

function stripTrailingZeros(num) {
  return Number(num.toFixed(4)).toString();
}

function toDts(obj, indent = 2) {
  if (Array.isArray(obj)) {
    return `${toDts(obj[0] ?? "string", indent)}[]`;
  }

  if (typeof obj !== "object" || obj === null) {
    return "string";
  }

  const pad = " ".repeat(indent);

  return `{
${Object.entries(obj)
  .map(
    ([key, value]) =>
      `${pad}${JSON.stringify(key)}: ${toDts(value, indent + 2)};`
  )
  .join("\n")}
${" ".repeat(indent - 2)}}`;
}
