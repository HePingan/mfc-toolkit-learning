#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_INDEX="${ROOT_DIR}/index.html"
PUBLIC_DIR="${ROOT_DIR}/public"
PUBLISHED_DIR="${ROOT_DIR}/published"
DOMAIN="${DOMAIN:-studymfc.hpa888.top}"
BASE_URL="${BASE_URL:-https://${DOMAIN}}"
VERIFY_HOST="${VERIFY_HOST:-127.0.0.1}"

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
npm run build

main_js="$(grep -oE '/assets/index-[^" ]+\.js' dist/index.html | head -n 1 || true)"
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

echo "[deploy] publishing dist/. into ${PUBLISHED_DIR}"
rm -rf "$PUBLISHED_DIR"
mkdir -p "$PUBLISHED_DIR"
cp -a dist/. "$PUBLISHED_DIR/"

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

echo "[deploy] complete. main_js=${main_js} publish_dir=${PUBLISHED_DIR}"
