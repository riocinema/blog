// src/search.json.11ty.js
module.exports = class {
  data() {
    return {
      permalink: "/search.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const posts = (data.collections?.posts || []).map((post) => {
      const d = post.data || {};
      const rawBody =
        // Prefer rendered content, fall back to templateContent
        (post.content || post.templateContent || "").toString();

      // Strip HTML tags and collapse whitespace
      const body = rawBody
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        title: d.title || "",
        date: d.date ? new Date(d.date).toISOString() : "",
        author: d.author || "",
        excerpt: d.excerpt || "",
        tags: Array.isArray(d.tags) ? d.tags : (d.tags ? [String(d.tags)] : []),
        url: post.url || "",
        featuredImage: d.featuredImage || "",
        body,
      };
    });

    return JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        posts,
      },
      null,
      2
    );
  }
};
