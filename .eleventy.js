module.exports = function (eleventyConfig) {
  eleventyConfig.ignores.add("src/**/.gitkeep");

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
