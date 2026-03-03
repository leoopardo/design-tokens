import StyleDictionary from 'style-dictionary';
import jsObjectFormatters from './style-dictionary/formats/js-object.js';

const { jsObjectFormatter } = jsObjectFormatters;

StyleDictionary.registerFormat({
  name: 'js/object',
  format: jsObjectFormatter,
});

const themes = ['light', 'dark'];

async function buildTheme(theme) {
  const sd = new StyleDictionary({
    source: [
      'tokens-normalized/core.json',
      `tokens-normalized/${theme}.json`,
      'tokens-normalized/components.json',
    ],
    platforms: {
      js: {
        transformGroup: 'js',
        buildPath: `dist/${theme}/`,
        files: [
          {
            destination: 'index.js',
            format: 'js/object',
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

await Promise.all(themes.map(buildTheme));