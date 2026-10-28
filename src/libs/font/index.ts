import { Lexend, Noto_Sans_Thai, Righteous } from 'next/font/google';
import type { Locale } from 'next-intl';
import { grapixoso, grapixosoCondensada, grapixosoCubica } from './Grapixoso';

export const lexend = Lexend({
    variable: '--font-lexend',
    subsets: ['latin'],
    display: 'swap',
});

export const notoSansThai = Noto_Sans_Thai({
    variable: '--font-noto-sans-thai',
    subsets: ['thai'],
    display: 'swap',
});

export const righteous = Righteous({
    weight: '400',
    variable: '--font-righteous',
    subsets: ['latin'],
    display: 'swap'
});

export { grapixoso, grapixosoCondensada, grapixosoCubica };

const displayByLocale: Record<string, string> = {
    en: 'var(--font-grapixoso-cubica)',
    th: 'var(--font-noto-sans-thai)',
};

const bodyByLocale: Record<string, string> = {
    en: 'var(--font-lexend)',
    th: 'var(--font-noto-sans-thai)',
};

export const fontVariables = [
    lexend.variable,
    notoSansThai.variable,
    righteous.variable,
    grapixoso.variable,
    grapixosoCondensada.variable,
    grapixosoCubica.variable,
].join(' ');

export function fontStyle(locale: Locale): React.CSSProperties {
    const stack = (primary: string) =>
        [...new Set([primary, 'var(--font-noto-sans-thai)'])]
            .concat('sans-serif')
            .join(', ');

    return {
        '--font-display': stack(displayByLocale[locale] ?? displayByLocale.en),
        '--font-body': stack(bodyByLocale[locale] ?? bodyByLocale.en),
    } as React.CSSProperties;
}
