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
};
