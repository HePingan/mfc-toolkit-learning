# studymfc.hpa888.top SSL / BaoTa 诊断与修复记录

更新时间：2026-05-31

## 当前自动诊断结论

`studymfc.hpa888.top` 当前 Nginx vhost 正常返回页面，但 HTTPS 证书存在域名不匹配风险：

- 站点域名：`studymfc.hpa888.top`
- 当前服务证书 Subject：`CN = hpa888.top`
- 当前证书 SAN：`DNS:hpa888.top`
- 证书有效期：`2026-04-04` 到 `2026-07-03`
- 结论：证书没有包含 `studymfc.hpa888.top`，浏览器会提示证书名称不匹配；本地 `curl -k` 能通过只是因为跳过了校验。

> 本文件只记录诊断和安全操作方案，不自动替换证书，避免破坏现有 HTTPS 服务。

## 当前 Nginx/BaoTa 路径

- 站点根目录：`/www/wwwroot/studymfc.hpa888.top`
- vhost 配置：`/www/server/panel/vhost/nginx/studymfc.hpa888.top.conf`
- 当前证书配置：
  - `/www/server/panel/vhost/cert/hpa888.top/fullchain.pem`
  - `/www/server/panel/vhost/cert/hpa888.top/privkey.pem`
- 访问日志：`/www/wwwlogs/studymfc.hpa888.top.log`
- 错误日志：`/www/wwwlogs/studymfc.hpa888.top.error.log`

## 宝塔面板修复步骤（推荐）

1. 登录宝塔面板。
2. 打开「网站」→ `studymfc.hpa888.top` →「SSL」。
3. 使用 Let's Encrypt / 宝塔 SSL 重新申请证书。
4. 申请域名必须包含：`studymfc.hpa888.top`。
   - 如果同时希望主域名可用，可申请包含 `hpa888.top` 与 `studymfc.hpa888.top` 的多域名证书。
5. 证书部署后，在 SSH 中执行：

```bash
nginx -t && /etc/init.d/nginx reload
```

6. 验证证书 SAN：

```bash
echo | openssl s_client -connect studymfc.hpa888.top:443 -servername studymfc.hpa888.top -showcerts 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

期望看到：

```text
X509v3 Subject Alternative Name:
    DNS:studymfc.hpa888.top
```

7. 验证站点深链路和静态资源：

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://studymfc.hpa888.top/
curl -sS -o /dev/null -w '%{http_code}\n' https://studymfc.hpa888.top/modules/serial
curl -sS -o /dev/null -w '%{http_code}\n' https://studymfc.hpa888.top/assets/<当前主JS>.js
```

## 不建议的操作

- 不要直接把 `hpa888.top` 的单域名证书继续用于子域名。
- 不要删除现有 vhost 后重建；容易丢失 SPA fallback、静态缓存、敏感文件拦截规则。
- 不要手工改证书路径后不执行 `nginx -t`。
- 不要为了验证而关闭 HTTPS 或 HSTS。

## 当前站点静态 SPA 关键配置

vhost 已包含：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ^~ /assets/ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    access_log off;
}
```

这些配置应保留，用于保证 React Router 深链路和 Vite hashed assets 正常工作。
