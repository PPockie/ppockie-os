import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'th'],
    defaultLocale: 'en',
    // 'as-needed' keeps English on /about and puts Thai on /th/about.
    // Switch to 'always' if you want /en/about too.
    localePrefix: 'as-needed',
});
