// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			alternates?: Partial<Record<import('$lib/i18n/locales').Locale, string>>;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
