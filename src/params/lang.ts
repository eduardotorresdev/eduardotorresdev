import type { ParamMatcher } from '@sveltejs/kit';
import { isSecondaryLocale } from '$lib/i18n/locales';

// Só os idiomas com prefixo casam aqui. O default (pt-BR) vive na raiz, sem prefixo.
export const match: ParamMatcher = (param) => isSecondaryLocale(param);
