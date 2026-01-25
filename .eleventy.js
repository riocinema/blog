const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Ignore placeholder files
  eleventyConfig.ignores.add("src/**/.gitkeep");

  // Filters
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = new Date(value);
    if (isNaN(d)) return value;
    return new Intl.DateTimeFormat("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  });

  eleventyConfig.addFilter("ymd", (dateObj) => {
    const d = new Date(dateObj);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  // Static files
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ admin: "admin" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

  // Collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").reverse();
  });

  // Markdown: render body images as (image + right-hand caption) when a title exists
  const md = markdownIt({ html: true });

  const defaultImageRule =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    const src = token.attrGet("src") || "";
    const alt = token.content || "";
    const title = token.attrGet("title"); // we’ll treat this as caption text

    // No title => normal image
    if (!title) {
      return defaultImageRule(tokens, idx, options, env, self);
    }

    // Title present => figure with right caption, bottom-aligned
    return `
<figure class="figure figure--inline">
  <img class="figure__img" src="${src}" alt="${alt}">
  <figcaption class="figure__cap">${title}</figcaption>
</figure>
`.trim();
  };

  eleventyConfig.setLibrary("md", md);

  // Directories
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
  };
};
