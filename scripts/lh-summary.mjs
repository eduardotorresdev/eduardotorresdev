/* Lê os JSONs de uma rodada e imprime a tabela de notas (mediana entre runs). */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const GATE = 98;

const median = (xs) => {
	const s = xs.toSorted((a, b) => a - b);
	return s.length % 2 ? s[(s.length - 1) / 2] : Math.round((s[s.length / 2 - 1] + s[s.length / 2]) / 2);
};

const byUrl = new Map();
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
	const lhr = JSON.parse(readFileSync(join(dir, file), 'utf8'));
	const url = new URL(lhr.finalDisplayedUrl ?? lhr.finalUrl).pathname;
	const entry = byUrl.get(url) ?? { scores: Object.fromEntries(CATS.map((c) => [c, []])), audits: new Set() };
	for (const c of CATS) entry.scores[c].push(Math.round((lhr.categories[c]?.score ?? 0) * 100));
	for (const c of CATS)
		for (const ref of lhr.categories[c]?.auditRefs ?? []) {
			const a = lhr.audits[ref.id];
			if (!a || a.score === null || a.score >= 0.9) continue;
			if (!ref.weight && a.scoreDisplayMode !== 'binary') continue;
			entry.audits.add(`${c}/${ref.id}${ref.weight ? ` (peso ${ref.weight})` : ''}`);
		}
	byUrl.set(url, entry);
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('URL', 42)} ${CATS.map((c) => pad(c.slice(0, 5), 6)).join('')}`);
console.log('-'.repeat(42 + 24));
let failing = 0;
const allAudits = new Map();
for (const [url, e] of [...byUrl].toSorted()) {
	const cells = CATS.map((c) => {
		const m = median(e.scores[c]);
		if (m < GATE) failing++;
		return pad(m < GATE ? `${m}!` : m, 6);
	});
	console.log(`${pad(url, 42)} ${cells.join('')}`);
	for (const a of e.audits) allAudits.set(a, (allAudits.get(a) ?? 0) + 1);
}
console.log(`\n${failing === 0 ? 'PASSOU' : `${failing} nota(s) abaixo de ${GATE}`}\n`);
if (allAudits.size) {
	console.log('Auditorias falhando (nº de URLs):');
	for (const [a, n] of [...allAudits].toSorted((x, y) => y[1] - x[1])) console.log(`  ${pad(n, 4)} ${a}`);
}
