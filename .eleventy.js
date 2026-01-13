module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("src/**/.gitkeep");

  eleventyConfig.addFilter("readableDate", (value) => {
  const d = new Date(value);
  if (isNaN(d)) return value; // if it's not a date, just return as-is
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
});


  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/posts/*.md").reverse()
  );

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes"
    }
  };
};
