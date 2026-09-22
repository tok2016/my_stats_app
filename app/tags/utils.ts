export const GAMES_PER_PAGE = 25;
export const TOP_TAGS_SIZE = 15;
export const TOP_MIXES = 5;
export const DEFAULT_TOP_SIZE = 50;
export const INDIE_TAG = '492';

const SATURATION = 0.7;
const LIGHTNESS = 0.5;

const fractionToHex = (fr: number, adjastLight: number) => {
  const hex = Math.round((fr + adjastLight) * 255).toString(16);
  return hex.length < 2 ? '0' + hex : hex;
};

export const Colors = Array.from({ length: TOP_TAGS_SIZE }, (_, i) => {
  const hue = (360 / TOP_TAGS_SIZE) * i;

  const mainChroma = (1 - Math.abs(2 * LIGHTNESS - 1)) * SATURATION;
  const secondChroma = mainChroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const adjastLight = LIGHTNESS - mainChroma / 2;

  const sections = hue / 60;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (sections <= 1) {
    red = mainChroma;
    green = secondChroma;
  } else if (sections <= 2) {
    red = secondChroma;
    green = mainChroma;
  } else if (sections <= 3) {
    green = mainChroma;
    blue = secondChroma;
  } else if (sections <= 4) {
    green = secondChroma;
    blue = mainChroma;
  } else if (sections <= 5) {
    blue = mainChroma;
    red = secondChroma;
  } else if (sections <= 6) {
    blue = secondChroma;
    red = mainChroma;
  }

  return `#${fractionToHex(red, adjastLight)}${fractionToHex(green, adjastLight)}${fractionToHex(blue, adjastLight)}`;
});
