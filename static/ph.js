/*
 * Inicializa o PostHog nos dois lugares que medem: o site (src/app.html) e o
 * HTML das propostas (injetado pela Function). A key e as propriedades fixas
 * vêm dos data-attributes da própria tag, então a configuração vive só aqui.
 *
 * Carregado com defer depois do /ph/static/array.js, que já deixou o posthog
 * global pronto. Key vazia não mede nada: local e preview ficam limpos.
 */
(function () {
	var tag = document.currentScript;
	var key = tag && tag.getAttribute('data-key');
	if (!key) return;

	var posthog = window.posthog;
	if (!posthog || !posthog.init) return;

	var fixed = {};
	try {
		fixed = JSON.parse(tag.getAttribute('data-props') || '{}');
	} catch {
		fixed = {};
	}

	posthog.init(key, {
		api_host: '/ph',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-05-24',
		persistence: 'localStorage+cookie',
		// Dentro de iframe não grava: o documento pai é same-origin, então a
		// gravação dele já captura o conteúdo do frame. Evita sessão duplicada.
		disable_session_recording: window.self !== window.top,
		// O site tem formulário de contato e o protótipo tem campo de busca:
		// nada do que for digitado entra na gravação.
		session_recording: { maskAllInputs: true },
		// Em todo evento, inclusive o primeiro pageview — register só valeria a
		// partir do segundo, e o primeiro é justamente o que importa.
		before_send: function (event) {
			if (event) event.properties = Object.assign({}, event.properties, fixed);
			return event;
		}
	});
})();
