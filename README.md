# JRC Consult – web s administrací článků

Web je postavený na [Eleventy](https://www.11ty.dev/), články se spravují přes [Decap CMS](https://decapcms.org/).

## Lokální zkoušení

```
npm install   # jen poprvé
npm start
```

- Web: http://localhost:8080
- Administrace: http://localhost:8080/admin (tlačítko „Přihlásit“, lokálně bez hesla)

Články se ukládají jako soubory do `src/clanky/`, nahrané obrázky a PDF do `src/uploads/`.

## Struktura

- `src/index.njk` – úvodní stránka (obsah původního `index.html` + sekce Aktuality)
- `src/_includes/base.njk` – hlavička, menu a patička společné pro všechny stránky
- `src/_includes/clanek.njk` – vzhled stránky článku
- `src/_includes/karta-clanku.njk` – karta článku v přehledu
- `src/clanky-vse.njk` – stránka se všemi články (`/clanky/`)
- `src/admin/config.yml` – nastavení administrace (pole formuláře, kategorie)
- `dev.js` – lokální server (obchází chybu Eleventy ve Windows s nově přidanými soubory)

## Ostrý provoz (Netlify)

1. Nahrát projekt do GitHub repozitáře.
2. V `src/admin/config.yml` je nastaven repozitář `chechta838/Jana_Coufalova`.
3. Na Netlify založit web z repozitáře (build: `npm run build`, složka `_site`, už je v `netlify.toml`).
4. Nastavit přihlášení do administrace přes GitHub (Netlify → OAuth).
