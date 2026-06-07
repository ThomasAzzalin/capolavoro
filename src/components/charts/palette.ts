// colori distinti e sobri, niente gradienti
export const PALETTE = [
    '#5b8def', '#e8743b', '#19a979', '#945ecf', '#e6b800',
    '#13a4b4', '#ef5b9c', '#6c8893', '#bf538d', '#8a9a5b',
];

export function colorFor(index: number): string {
    return PALETTE[index % PALETTE.length];
}

// colore base per le heatmap (stesso hue, opacità variabile)
export const HEATMAP_RGB = '91, 141, 239';
