import staticRoutes from "./scripts/staticRoutes.json" assert { type: "json" };

// Mock function for product slugs. Replace with DB/API call as needed.
async function getAllProductSlugs() {
  return ["product-1", "product-2", "product-3"];
}

export default {
  siteUrl: process.env.NEXTAUTH_URL ?? "https://rinors.com",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/admin/*"] },
    ],
  },
  /**
   * @param {import('next-sitemap').IConfig} config
   */
  async additionalPaths(config) {
    // Add static routes, exclude admin
    const staticPaths = staticRoutes
      .filter((route) => !route.startsWith("/admin"))
      .map((route) => ({
        loc: route.startsWith("/") ? route : `/${route}`,
        changefreq: "weekly",
        priority: 0.7,
      }));

    // Add dynamic product routes
    const slugs = await getAllProductSlugs();
    const productPaths = slugs.map((slug) => ({
      loc: `/products/${slug}`,
      changefreq: "daily",
      priority: 0.7,
    }));

    return [...staticPaths, ...productPaths];
  },
};
