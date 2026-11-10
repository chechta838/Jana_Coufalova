# Test webu JRC Consult na Cloudflare

Tahle složka je samostatná větev `cloudflare` stejného projektu na GitHubu.
Web na Netlify (větev `main`) zůstává beze změny. Testovací články se ukládají jen do větve `cloudflare`.

## 1. Účet
- https://dash.cloudflare.com/sign-up (ideálně na itjrcconsult@gmail.com)

## 2. Web (Cloudflare Pages)
1. Workers & Pages → Create → záložka **Pages** → **Import an existing Git repository**
   (pokud se nabízí jen Workers, dole odkaz „Looking to deploy Pages? Get started“)
2. Připojit GitHub → projekt `chechta838/Jana_Coufalova`
3. Nastavení:
   - Project name: `jrc-consult`
   - Production branch: **`cloudflare`**
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `_site`
4. Save and Deploy → web poběží na `https://jrc-consult.pages.dev` (případně s jinou koncovkou)

## 3. Přihlašovací Worker
1. Workers & Pages → Create → **Worker** → název `jrc-cms-auth` → Deploy
2. Edit code → celý obsah nahradit souborem `cloudflare-auth/worker.js` → Deploy
3. Adresa Workeru: `https://jrc-cms-auth.<vaše-jméno>.workers.dev`

## 4. GitHub OAuth aplikace (nová, jen pro Cloudflare)
1. https://github.com/settings/developers → OAuth Apps → New OAuth App
   - Application name: `JRC Consult – administrace (Cloudflare)`
   - Homepage URL: adresa z kroku 2
   - Authorization callback URL: `https://jrc-cms-auth.<vaše-jméno>.workers.dev/callback`
2. Zkopírovat **Client ID**, vygenerovat **Client secret**

## 5. Proměnné Workeru
Worker `jrc-cms-auth` → Settings → Variables and Secrets:
- `GITHUB_CLIENT_ID` (Text) = Client ID
- `GITHUB_CLIENT_SECRET` (**Secret**) = Client secret
- `ALLOWED_ORIGINS` (Text) = `https://jrc-consult.pages.dev`
  (později přidat `,https://jrcconsult.cz`)

## 6. Propojení a test
- Adresu Workeru doplnit do `src/admin/config.yml` (`base_url`) – udělá Claude
- Otevřít `https://jrc-consult.pages.dev/admin/` → přihlásit přes GitHub
- Napsat zkušební článek → publikovat → za 1–2 min zkontrolovat `/poradna/`
