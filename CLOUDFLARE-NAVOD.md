# Test webu JRC Consult na Cloudflare (Workers)

Tahle složka je samostatná větev `cloudflare` stejného projektu na GitHubu.
Web na Netlify (větev `main`) zůstává beze změny. Testovací články se ukládají jen do větve `cloudflare`.

Jeden projekt na Cloudflare dělá obojí: zobrazuje web (`_site`) a obstarává přihlášení
do administrace (`/auth`, `/callback` – soubor `cloudflare-auth/worker.js`). Nastavení je ve `wrangler.jsonc`.

## 1. Projekt
Workers & Pages → Create → Import a repository → `chechta838/Jana_Coufalova`
- Project name: `jana-coufalova` (musí odpovídat `name` ve `wrangler.jsonc`)
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview` (nechat)
→ Deploy

## 2. Větev
Pokud první sestavení vezme větev `main` a selže:
projekt → Settings → Build → Branch control → Production branch: **`cloudflare`** → uložit → spustit znovu
Web pak běží na `https://jana-coufalova.<vaše-jméno>.workers.dev`

## 3. GitHub OAuth aplikace (nová, jen pro Cloudflare)
https://github.com/settings/developers → OAuth Apps → New OAuth App
- Application name: `JRC Consult – administrace (Cloudflare)`
- Homepage URL: `https://jana-coufalova.<vaše-jméno>.workers.dev`
- Authorization callback URL: `https://jana-coufalova.<vaše-jméno>.workers.dev/callback`
Zkopírovat **Client ID**, vygenerovat **Client secret**

## 4. Proměnné
projekt → Settings → Variables and Secrets → Add, obě jako typ **Secret**:
- `GITHUB_CLIENT_ID` = Client ID
- `GITHUB_CLIENT_SECRET` = Client secret

## 5. Test
- `https://jana-coufalova.<vaše-jméno>.workers.dev/admin/` → přihlásit přes GitHub
- Napsat zkušební článek → publikovat → za 1–2 min zkontrolovat `/poradna/`

## Doména později
Při napojení jrcconsult.cz změnit v GitHub OAuth aplikaci Homepage a callback URL na
`https://jrcconsult.cz` a `https://jrcconsult.cz/callback`. Nic jiného se měnit nemusí.
