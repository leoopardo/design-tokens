import light from './light/index.js';
import dark from './dark/index.js';

declare const themes: {
  light: typeof light;
  dark: typeof dark;
};

export { light, dark };
export default themes;
