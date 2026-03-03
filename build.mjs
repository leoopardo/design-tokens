import StyleDictionary from 'style-dictionary';

const themes = ['light', 'dark'];

async function buildTheme(theme) {
  const sd = new StyleDictionary({
    log: {
      verbosity: 'verbose'
    },
    source: [
      'tokens-normalized/core.json',
      `tokens-normalized/${theme}.json`,
      'tokens-normalized/components.json'
    ],
    platforms: {
      js: {
        transformGroup: 'js',
        buildPath: `dist/${theme}/`,
        files: [
          {
            destination: 'index.js',
            format: 'javascript/es6'
          }
        ]
      }
    }
  });

  await sd.buildAllPlatforms();
}

await Promise.all(themes.map(buildTheme));