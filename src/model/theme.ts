export type FontFamily = 'Georgia' | 'San Francisco';
export type FontSize = number;
export type Color = string;

export type Palette = {
    text: Color,
    primary: Color,
    secondary: Color,
    accent: Color,
    highlight: Color,
    shadow: Color,
};
export type FontSizes = {
    normal: FontSize,
    large: FontSize,
    largest: FontSize,
};

export type Palettes = {
    light: Palette,
    sepia: Palette,
    dark: Palette,
};
export type PaletteName = keyof Palettes;

export type Theme = {
    palettes: Palettes,
    currentPalette: PaletteName,
    fontScale: number,
    fontFamily: FontFamily,
    fontSize: FontSizes,
    radius: number,
};
