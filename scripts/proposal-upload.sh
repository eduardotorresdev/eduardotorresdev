#!/usr/bin/env bash
# Sobe (ou atualiza) uma proposta privada no R2 servido por functions/propostas.
# O material fica fora do repo, que é público.
#
#   scripts/proposal-upload.sh <slug> <pasta> [token]
#
# A pasta precisa ter index.html na raiz. Sem token, mantém o que já está no
# bucket. Arquivos e pastas ocultos ou começados com _ são ignorados. Não apaga arquivos
# antigos do bucket: renomeou, remova o antigo com `wrangler r2 object delete`.
#
# Também gera a imagem da prévia do link (WhatsApp, Instagram...): um print do
# index.html em 1200x630, salvo como _og.jpg (precisa do Google Chrome e do sips,
# do macOS). Sem eles, a proposta sobe sem imagem e o link chega só com o título.
# PREVIEW_ONLY=1 refaz só a imagem, sem subir os arquivos.
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

chrome=${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}

preview() {
	if [[ ! -x $chrome ]] || ! command -v sips >/dev/null; then
		echo "  sem Chrome/sips: proposta sem imagem de prévia" >&2
		return
	fi
	local tmp
	tmp=$(mktemp -d)
	# Perfil descartável: não mexe no Chrome aberto do usuário.
	"$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$tmp/profile" \
		--window-size=1200,630 --virtual-time-budget=8000 --screenshot="$tmp/og.png" \
		"file://$(pwd)/index.html" >/dev/null 2>&1 || true
	if [[ -s $tmp/og.png ]]; then
		sips -s format jpeg -s formatOptions 72 "$tmp/og.png" --out "$tmp/og.jpg" >/dev/null
		put _og.jpg "$tmp/og.jpg"
	else
		echo "  print da prévia falhou: proposta sem imagem" >&2
	fi
	rm -rf "$tmp"
}

cd "$dir"
if [[ -z ${PREVIEW_ONLY:-} ]]; then
	while read -r key; do
		put "$key" "$key"
	done < <(find . -type f ! -path '*/.*' ! -path '*/_*' | sed 's|^\./||' | sort)
fi
preview

if [[ -n $token ]]; then
	tmp=$(mktemp)
	printf '%s' "$token" >"$tmp"
	put _token "$tmp"
	rm -f "$tmp"
fi

echo "pronto: https://eduardotorres.dev/propostas/$slug?token=…"
