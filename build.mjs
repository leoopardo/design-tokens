import StyleDictionary from "style-dictionary";

const buildTheme = async (theme) => {
  const sd = new StyleDictionary({
    source: [
      "tokens/global.json",
      `tokens/${theme}.json`
    ],
    platforms: {
      js: {
        transformGroup: "js",
        buildPath: `dist/${theme}/`,
        files: [
          {
            destination: "index.js",
            format: "javascript/es6"
          }
        ]
      }
    }
  });

  await sd.buildAllPlatforms();
};

await Promise.all([
  buildTheme("light"),
  buildTheme("dark")
]);