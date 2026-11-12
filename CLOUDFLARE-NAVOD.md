# Hosting na Cloudflare (Workers)

Jeden projekt na Cloudflare zobrazuje web (`_site`) a obstarává přihlášení do administrace
(`/auth`, `/callback` – `cloudflare-auth/worker.js`). Nastavení je ve `wrangler.jsonc`.
Stejný kód dál funguje i na Netlify (administrace pozná adresu a použije přihlášení přes Netlify).

## 1. Projekt
Workers & Pages → Create → Import a repository → `chechta838/Jana_Coufalova`
- Project name: `jana-coufalova` (musí odpovídat `name` ve `wrangler.jsonc`)
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview`
→ Deploy. Web poběží na `https://jana-coufalova.<účet>.workers.dev`

## 2. GitHub OAuth aplikace (nová, jen pro Cloudflare)
https://github.com/settings/developers → OAuth Apps → New OAuth App
- Application name: `JRC Consult – administrace`
- Homepage URL: `https://jana-coufalova.<účet>.workers.dev`
- Authorization callback URL: `https://jana-coufalova.<účet>.workers.dev/callback`
Zkopírovat Client ID, vygenerovat Client secret.

## 3. Tajné hodnoty
projekt → Settings → Variables and Secrets → Add, obě jako typ **Secret**:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

## 4. Test
`/admin/` → Přihlásit pomocí GitHub → zkušební článek → publikovat → za 1–2 min `/poradna/`

## 5. Po ověření
- Netlify: Project configuration → Build & deploy → Stop builds (ať nečerpá kredity)
- Doména jrcconsult.cz: přidat do Cloudflare (DNS přesunout z Forpsi, zachovat MX pro e-mail),
  projekt → Settings → Domains & Routes → Add custom domain.
  V GitHub OAuth aplikaci pak změnit Homepage a callback URL na https://jrcconsult.cz(/callback).
