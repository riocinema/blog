module.exports = function (eleventyConfig) {
  // Ignore placeholder files
  eleventyConfig.ignores.add("src/**/.gitkeep");

  // Filters
  eleventyConfig.addFilter("readableDate", (value) => {
    const d = new Date(value);
    if (isNaN(d)) return value;
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
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

  // Directories
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
  };
};
