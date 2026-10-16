// Lokální náhled webu s automatickým přenačítáním.
// Obchází chybu Eleventy ve Windows: nově přidané soubory (např. článek vytvořený
// v administraci) se kvůli zpětným lomítkům v cestě nezahrnuly do webu až do restartu.
import Eleventy from "@11ty/eleventy";

const elev = new Eleventy(undefined, undefined, { source: "cli", runMode: "serve" });
await elev.init();

const fss = elev.fileSystemSearch;
for (const method of ["add", "delete"]) {
    const original = fss[method].bind(fss);
    fss[method] = (path) => original(path.replaceAll("\\", "/"));
}

await elev.watch();
elev.serve(8080);

process.on("SIGINT", async () => {
    await elev.stopWatch();
    process.exit(0);
});
