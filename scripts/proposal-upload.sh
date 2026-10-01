#!/usr/bin/env bash
# Sobe (ou atualiza) uma proposta privada no R2 servido por functions/propostas.
# O material fica fora do repo, que é público.
#
#   scripts/proposal-upload.sh <slug> <pasta> [token]
#
# A pasta precisa ter index.html na raiz. Sem token, mantém o que já está no
# bucket. Arquivos ocultos e começados com _ são ignorados. Não apaga arquivos
# antigos do bucket: renomeou, remova o antigo com `wrangler r2 object delete`.
set -euo pipefail

slug=${1:?slug}
dir=${2:?pasta}
token=${3:-}
bucket=${PROPOSALS_BUCKET:-eduardotorresdev-propostas}

[[ $slug =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "slug inválido: $slug" >&2; exit 1; }
[[ -f $dir/index.html ]] || { echo "$dir/index.html não existe" >&2; exit 1; }

wrangler="$(cd "$(dirname "$0")/.." && pwd)/node_modules/.bin/wrangler"

# A API às vezes devolve 502: tenta de novo antes de desistir.
put() {
	local i
	for i in 1 2 3; do
		"$wrangler" r2 object put "$bucket/$slug/$1" --file "$2" --remote >/dev/null 2>&1 && { echo "  $1"; return; }
		sleep $((i * 2))
	done
	echo "falhou: $1" >&2
	exit 1
}

cd "$dir"
while read -r key; do
	put "$key" "$key"
done < <(find . -type f ! -path '*/.*' ! -name '_*' | sed 's|^\./||' | sort)

if [[ -n $token ]]; then
	tmp=$(mktemp)
	printf '%s' "$token" >"$tmp"
	put _token "$tmp"
	rm -f "$tmp"
fi

echo "pronto: https://eduardotorres.dev/propostas/$slug?token=…"
