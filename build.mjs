import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
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

const packageIndexJs = `import light from './light/index.js';
import dark from './dark/index.js';

export { light, dark };
export default { light, dark };
`;

const packageIndexDts = `import light from './light/index.js';
import dark from './dark/index.js';

declare const themes: {
  light: typeof light;
  dark: typeof dark;
};

export { light, dark };
export default themes;
`;

fs.writeFileSync('dist/index.js', packageIndexJs);
fs.writeFileSync('dist/index.d.ts', packageIndexDts);
