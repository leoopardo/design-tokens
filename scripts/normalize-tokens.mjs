import fs from "fs";

const raw = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const normalizeRefs = (obj) => {
  if (typeof obj === "string") {
    return obj.replace(/\{([^}]+)\}/g, (_, ref) => {
      return `{${ref
        .replace(/^core\./, "")
        .replace(/^light\./, "")
        .replace(/^dark\./, "")}}`;
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeRefs);
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = normalizeRefs(obj[key]);
    }
  }

  return obj;
};

const core = normalizeRefs(clone(raw.core));
const light = normalizeRefs(clone(raw.light));
const dark = normalizeRefs(clone(raw.dark));
const components = normalizeRefs(clone(raw.theme));

fs.mkdirSync("tokens-normalized", { recursive: true });

fs.writeFileSync(
  "tokens-normalized/core.json",
  JSON.stringify(core, null, 2)
);

fs.writeFileSync(
  "tokens-normalized/light.json",
  JSON.stringify(light, null, 2)
);

fs.writeFileSync(
  "tokens-normalized/dark.json",
  JSON.stringify(dark, null, 2)
);

fs.writeFileSync(
  "tokens-normalized/components.json",
  JSON.stringify(components, null, 2)
);

console.log("✅ Tokens normalizados corretamente para a pasta /tokens-normalized");