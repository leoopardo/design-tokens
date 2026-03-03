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
