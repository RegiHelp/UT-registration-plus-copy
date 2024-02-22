export const colors = {
    ut: {
        burntorange: '#BF5700',
        black: '#333F48',
        orange: '#f8971f',
        yellow: '#ffd600',
        lightgreen: '#a6cd57',
        green: '#579d42',
        teal: '#00a9b7',
        blue: '#005f86',
        gray: '#9cadb7',
        offwhite: '#d6d2c4',
        concrete: '#95a5a6',
        red: '#B91C1C', //   Not sure if this should be here, but it's used for remove course, and add course is ut-green
    },
    theme: {
        red: '#af2e2d',
        black: '#1a2024',
    },
    gradeDistribution: {
        a: '#22c55e',
        aminus: '#a3e635',
        bplus: '#84CC16',
        b: '#FDE047',
        bminus: '#FACC15',
        cplus: '#F59E0B',
        c: '#FB923C',
        cminus: '#F97316',
        dplus: '#EA580C', // TODO (achadaga): copilot generated, get actual color from Isaiah
        d: '#DC2626',
        dminus: '#B91C1C',
        f: '#B91C1C',
    },
} as const satisfies Record<string, Record<string, string>>;

type NestedKeys<T> = {
    [K in keyof T]: T[K] extends Record<string, any> ? `${string & K}-${string & keyof T[K]}` : never;
}[keyof T];

/**
 * A union of all colors in the theme
 */
export type ThemeColor = NestedKeys<typeof colors>;

/**
 * Flattened colors object.
 * @type {Record<ThemeColor, string>}
 */
export const colorsFlattened = Object.entries(colors).reduce(
    (acc, [prefix, group]) => {
        for (const [name, hex] of Object.entries(group)) {
            acc[`${prefix}-${name}`] = hex;
        }
        return acc;
    },
    {} as Record<ThemeColor, string>
);

/**
 * Converts a hexadecimal color code to an RGB color array.
 * @param hex The hexadecimal color code to convert.
 * @returns An array representing the RGB color values.
 */
export const hexToRgb = (hex: string) =>
    hex.match(/[0-9a-f]{2}/gi).map(partialHex => parseInt(partialHex, 16)) as [number, number, number];

/**
 * Represents the flattened RGB values of the colors.
 * @type {Record<ThemeColor, ReturnType<typeof hexToRgb>>}
 */
const colorsFlattenedRgb = Object.fromEntries(
    Object.entries(colorsFlattened).map(([name, hex]) => [name, hexToRgb(hex)])
) as Record<ThemeColor, ReturnType<typeof hexToRgb>>;

/**
 * Retrieves the hexadecimal color value by name from the theme.
 *
 * @param name - The name of the theme color.
 * @returns The hexadecimal color value.
 */
export const getThemeColorHexByName = (name: ThemeColor): string => colorsFlattened[name];

/**
 *
 * @param name - The name of the theme color.
 * @returns An array of the red, green, and blue values, respectively
 */
export const getThemeColorRgbByName = (name: ThemeColor) => colorsFlattenedRgb[name];
