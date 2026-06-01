#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_INDEX="${ROOT_DIR}/index.html"
PUBLIC_DIR="${ROOT_DIR}/public"
PUBLISHED_DIR="${ROOT_DIR}/published"
BACKUP_ROOT="${ROOT_DIR}/.deploy-backups"
DOMAIN="${DOMAIN:-studymfc.hpa888.top}"
BASE_URL="${BASE_URL:-https://${DOMAIN}}"
VERIFY_HOST="${VERIFY_HOST:-127.0.0.1}"
SKIP_VERIFY_ALL="${SKIP_VERIFY_ALL:-0}"
BACKUP_DIR=""
PUBLISHED_REPLACED="0"

rollback_on_error() {
  local code=$?
  if [[ "$PUBLISHED_REPLACED" == "1" && -n "$BACKUP_DIR" && -d "$BACKUP_DIR/published" ]]; then
    echo "[deploy] ERROR: deploy failed, rolling back published/ from ${BACKUP_DIR}/published" >&2
    rm -rf "$PUBLISHED_DIR"
    cp -a "$BACKUP_DIR/published" "$PUBLISHED_DIR"
  fi
  exit "$code"
}
trap rollback_on_error ERR

cd "$ROOT_DIR"

cat > "$SOURCE_INDEX" <<'HTML'
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MFC 通用工具开发训练营</title>
    <meta name="description" content="面向 MFC、C++、串口、TCP、HTTP、SQLite/INI 的交互式工程训练营，包含课程、实验、测验、进度和最终项目。" />
    <meta name="theme-color" content="#07111f" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="MFC 通用工具开发训练营" />
    <meta property="og:title" content="MFC 通用工具开发训练营" />
    <meta property="og:description" content="用交互实验和最终项目学习 MFC、C++、串口、TCP、HTTP、SQLite/INI 工具开发。" />
    <meta property="og:url" content="https://studymfc.hpa888.top/" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML

mkdir -p "$PUBLIC_DIR"
if [[ -f "$ROOT_DIR/robots.txt" ]]; then cp "$ROOT_DIR/robots.txt" "$PUBLIC_DIR/robots.txt"; fi
if [[ -f "$ROOT_DIR/sitemap.xml" ]]; then cp "$ROOT_DIR/sitemap.xml" "$PUBLIC_DIR/sitemap.xml"; fi
if [[ -f "$ROOT_DIR/favicon.svg" ]]; then cp "$ROOT_DIR/favicon.svg" "$PUBLIC_DIR/favicon.svg"; fi

echo "[deploy] restored source Vite index.html"
if [[ "$SKIP_VERIFY_ALL" == "1" ]]; then
  echo "[deploy] SKIP_VERIFY_ALL=1, running build only"
  npm run build
else
  npm run verify:all
fi

main_js="$(grep -oE '/assets/index-[^" ]+\.js' dist/index.html | head -n 1 || true)"
main_css="$(grep -oE '/assets/index-[^" ]+\.css' dist/index.html | head -n 1 || true)"
if [[ -z "$main_js" ]]; then
  echo "[deploy] ERROR: could not find built main JS in dist/index.html" >&2
  exit 1
fi

if grep -q 'src="/src/main\.tsx"' dist/index.html; then
  echo "[deploy] ERROR: dist/index.html still references /src/main.tsx" >&2
  exit 1
fi

if ! grep -q 'src="/assets/index-' dist/index.html; then
  echo "[deploy] ERROR: dist/index.html does not reference built asset" >&2
  exit 1
fi

mkdir -p "$BACKUP_ROOT"
BACKUP_DIR="${BACKUP_ROOT}/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
if [[ -d "$PUBLISHED_DIR" ]]; then
  cp -a "$PUBLISHED_DIR" "$BACKUP_DIR/published"
  echo "[deploy] backup created at ${BACKUP_DIR}/published"
fi

echo "[deploy] publishing dist/. into ${PUBLISHED_DIR}"
rm -rf "$PUBLISHED_DIR"
mkdir -p "$PUBLISHED_DIR"
cp -a dist/. "$PUBLISHED_DIR/"
PUBLISHED_REPLACED="1"

DOMAIN="$DOMAIN" BASE_URL="$BASE_URL" node scripts/write-deploy-manifest.mjs

verify_paths=(
  "/"
  "/modules/serial"
  "/labs"
  "/quiz"
  "/resources"
  "/dashboard"
  "$main_js"
  "/robots.txt"
  "/sitemap.xml"
  "/deploy-manifest.json"
  "/comics"
  "/diagrams"
)

for path in "${verify_paths[@]}"; do
  url="${BASE_URL}${path}"
  code="$(curl -k -sS --resolve "${DOMAIN}:443:${VERIFY_HOST}" -o /dev/null -w '%{http_code}' "$url" || true)"
  if [[ "$code" != "200" ]]; then
    echo "[deploy] ERROR: ${path} returned HTTP ${code}" >&2
    exit 1
  fi
  echo "[deploy] OK ${code} ${path}"
done

tmp_html="$(mktemp)"
if curl -k -fsS --resolve "${DOMAIN}:443:${VERIFY_HOST}" "${BASE_URL}/" -o "$tmp_html" && grep -q 'src="/src/main\.tsx"' "$tmp_html"; then
  echo "[deploy] ERROR: live site is serving dev index.html" >&2
  rm -f "$tmp_html"
  exit 1
fi
rm -f "$tmp_html"

tmp_js="$(mktemp)"
if curl -k -fsS --resolve "${DOMAIN}:443:${VERIFY_HOST}" "${BASE_URL}${main_js}" -o "$tmp_js" && grep -q '/comics' "$tmp_js"; then
  echo "[deploy] OK main JS contains route marker /comics"
else
  echo "[deploy] WARN: main JS route marker /comics not found; inspect chunk splitting or route bundle"
fi
rm -f "$tmp_js"

PUBLISHED_REPLACED="0"
commit="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
branch="$(git branch --show-current 2>/dev/null || echo unknown)"
echo "[deploy] complete"
echo "[deploy] branch=${branch} commit=${commit}"
echo "[deploy] main_js=${main_js} main_css=${main_css:-unknown}"
echo "[deploy] backup=${BACKUP_DIR:-none}"
echo "[deploy] publish_dir=${PUBLISHED_DIR} live=${BASE_URL}"
