#!/usr/bin/env bash
# Auditoria Lighthouse do build estático servido pelo wrangler (aplica _headers e functions).
# Uso: scripts/lighthouse.sh <rodada> [urls...]   ex.: scripts/lighthouse.sh baseline
set -euo pipefail

ROUND="${1:-adhoc}"
shift || true

PORT="${LH_PORT:-8788}"
RUNS="${LH_RUNS:-1}"
OUT="${LH_OUT:-${SCRATCH:-/tmp}/lh/$ROUND}"
BASE="http://localhost:$PORT"

PATHS=("$@")
if [ ${#PATHS[@]} -eq 0 ]; then
  PATHS=(
    / /sobre /blog /blog/por-que-este-site-e-estatico /cases /cases/vale
    /en /en/about /en/blog /en/blog/por-que-este-site-e-estatico /en/cases /en/cases/vale
  )
fi

mkdir -p "$OUT"

if ! curl -sf -o /dev/null "$BASE/"; then
  echo "!! nada respondendo em $BASE — suba o servidor antes:" >&2
  echo "   bunx wrangler pages dev build --port $PORT --ip 127.0.0.1" >&2
  exit 1
fi

for p in "${PATHS[@]}"; do
  slug=$(echo "$p" | sed 's#^/##; s#/#_#g'); slug="${slug:-home}"
  for r in $(seq 1 "$RUNS"); do
    printf '  %-46s run %s\n' "$p" "$r"
    bunx lighthouse "$BASE$p" \
      --output=json --output=html \
      --output-path="$OUT/${slug}--r${r}" \
      --chrome-flags="--headless=new --no-sandbox" \
      --quiet --no-enable-error-reporting >/dev/null 2>&1 || echo "    !! falhou: $p run $r"
    # A simulação do Lighthouse é sensível a carga da máquina; um respiro entre
    # execuções evita que o lote inteiro contamine uma URL com ruído.
    sleep "${LH_SETTLE:-3}"
  done
done

echo
node scripts/lh-summary.mjs "$OUT"
