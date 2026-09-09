import type { Reroute } from '@sveltejs/kit';
import { publicToInternalPath } from '$lib/i18n/routes';

// Traduz o slug público das rotas (/en/about) para a rota interna (/en/sobre).
export const reroute: Reroute = ({ url }) => publicToInternalPath(url.pathname);
