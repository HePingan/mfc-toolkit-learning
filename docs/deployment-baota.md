# 部署与 BaoTa 运维说明

本项目当前源码与发布目录同在 `/www/wwwroot/studymfc.hpa888.top`。因此每次构建前必须先恢复开发版 `index.html`，确保 Vite 入口仍是 `/src/main.tsx`，避免把上一轮生产 `/assets/index-*.js` 当作入口导致打包旧代码或解析失败。

## 标准发布命令

```bash
cd /www/wwwroot/studymfc.hpa888.top
npm run deploy
```

脚本会自动执行：

1. 覆盖恢复开发版 `index.html`。
2. 运行 `npm run build`。
3. 执行 `rm -rf assets && cp -a dist/. ./` 发布到 BaoTa 站点根目录。
4. 通过本机 SNI 验证以下地址：`/`、`/modules/serial`、`/labs`、`/quiz`、`/resources`、`/dashboard`、当前主 JS、`/robots.txt`、`/sitemap.xml`、`/comics`、`/diagrams`。

## 当前 SSL 诊断

2026-05-30 本机检查结果：

- Nginx 配置语法通过。
- 443 对 `studymfc.hpa888.top` 返回证书：`subject=CN = hpa888.top`。
- SAN 仅包含：`DNS:hpa888.top`。
- 结论：当前证书不覆盖 `studymfc.hpa888.top`，浏览器会提示域名不匹配。不要删除现有证书，应在 BaoTa 中给子域名单独签发或扩展 SAN。

## BaoTa 修复 SSL 的建议步骤

1. 确认 DNS：`studymfc.hpa888.top` A 记录指向本服务器公网 IP。
2. BaoTa 面板 → 网站 → `studymfc.hpa888.top` → SSL。
3. 使用 Let's Encrypt，为域名 `studymfc.hpa888.top` 单独申请证书；或申请同时包含 `hpa888.top` 与 `studymfc.hpa888.top` 的证书。
4. 确认证书文件绑定在该站点的 443 server block，而不是主域名站点。
5. 保存后执行：

```bash
nginx -t && /etc/init.d/nginx reload
openssl s_client -connect studymfc.hpa888.top:443 -servername studymfc.hpa888.top </dev/null 2>/dev/null | openssl x509 -noout -subject -ext subjectAltName
```

期望 SAN 中出现 `DNS:studymfc.hpa888.top`。

## SPA fallback 检查

深链接如 `/modules/serial`、`/labs` 应返回 `index.html`。若 BaoTa/Nginx 未配置 fallback，可在站点配置中加入：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

修改后运行 `nginx -t && /etc/init.d/nginx reload`，再用 `curl -I https://studymfc.hpa888.top/modules/serial` 验证。
