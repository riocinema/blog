module.exports = function (eleventyConfig) {
  // Copy images straight through to the output
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });

  // Blog posts collection
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
