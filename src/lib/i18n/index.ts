import { en } from './en';
import { ptBR, type Dictionary } from './pt-br';
import type { Locale } from './locales';

const dictionaries: Record<Locale, Dictionary> = { 'pt-BR': ptBR, en };

export function t(locale: Locale): Dictionary {
	return dictionaries[locale];
}

export function formatDate(locale: Locale, iso: string): string {
	return new Intl.DateTimeFormat(dictionaries[locale].dates.locale, {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(new Date(iso));
}

export * from './locales';
export * from './routes';
export type { Dictionary };
