const developmentUrl = "http://localhost:3000";
const productionUrl = "https://www.aravalione.in";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return new URL(
      process.env.NODE_ENV === "production" ? productionUrl : developmentUrl
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an absolute URL, such as https://www.aravalione.in."
    );
  }

  const isLocalDevelopment =
    parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";
  if (
    parsedUrl.protocol !== "https:" &&
    !(isLocalDevelopment && parsedUrl.protocol === "http:")
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.");
  }

  if (
    parsedUrl.pathname !== "/" ||
    parsedUrl.search ||
    parsedUrl.hash ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the canonical origin.");
  }

  return new URL(parsedUrl.origin);
}
