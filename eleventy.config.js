export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/style.css");
    eleventyConfig.addPassthroughCopy("src/script.js");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/uploads");

    // Články seřazené od nejnovějšího
    eleventyConfig.addCollection("clanky", (collectionApi) =>
        collectionApi.getFilteredByGlob("src/clanky/*.md").sort((a, b) => b.date - a.date)
    );

    // Datum česky, např. „12. října 2026“
    eleventyConfig.addFilter("datumCz", (date) =>
        new Date(date).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
    );

    eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

    return {
        dir: { input: "src", output: "_site" },
        templateFormats: ["njk", "md"],
        markdownTemplateEngine: false,
    };
}
