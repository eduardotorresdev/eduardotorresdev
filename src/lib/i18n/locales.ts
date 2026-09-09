export const locales = ['pt-BR', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

/** Prefixo de URL de cada idioma. O default não tem prefixo. */
export const localePrefix: Record<Locale, string> = {
	'pt-BR': '',
	en: 'en'
};

/** Nome do arquivo markdown de cada idioma dentro da pasta de conteúdo. */
export const localeFile: Record<Locale, string> = {
	'pt-BR': 'pt-br',
	en: 'en'
};

export const localeLabel: Record<Locale, string> = {
	'pt-BR': 'PT',
	en: 'EN'
};

export function isLocale(value: string): value is Locale {
	return (locales as readonly string[]).includes(value);
}

export function isSecondaryLocale(prefix: string): boolean {
	return locales.some((locale) => locale !== defaultLocale && localePrefix[locale] === prefix);
}

export function localeFromPrefix(prefix: string | undefined): Locale {
	if (!prefix) return defaultLocale;
	return locales.find((locale) => localePrefix[locale] === prefix) ?? defaultLocale;
}
