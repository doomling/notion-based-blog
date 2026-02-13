export function getCountryFromHeaders(headers) {
  if (!headers) return null;

  const normalized = {};
  Object.keys(headers).forEach((key) => {
    normalized[key.toLowerCase()] = headers[key];
  });

  const envHeader = process.env.COUNTRY_HEADER;
  if (envHeader) {
    const value = normalized[envHeader.toLowerCase()];
    if (value) return String(value).trim().toUpperCase();
  }

  const candidates = [
    "x-vercel-ip-country",
    "cf-ipcountry",
    "x-country-code",
    "x-geo-country",
    "x-appengine-country",
  ];

  for (const header of candidates) {
    const value = normalized[header];
    if (value) return String(value).trim().toUpperCase();
  }

  return null;
}

function normalizeIp(ip) {
  if (!ip) return null;
  const trimmed = ip.trim();
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.replace("::ffff:", "");
  }
  if (trimmed === "::1") return "127.0.0.1";
  return trimmed;
}

export function getClientIp(req) {
  if (!req) return null;

  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    const first = String(forwarded).split(",")[0];
    const normalized = normalizeIp(first);
    if (normalized) return normalized;
  }

  const realIp = req.headers?.["x-real-ip"];
  if (realIp) {
    const normalized = normalizeIp(String(realIp));
    if (normalized) return normalized;
  }

  const socketIp = req.socket?.remoteAddress;
  return normalizeIp(socketIp);
}

export function getCountryFromRequest(req) {
  const headerCountry = getCountryFromHeaders(req?.headers);
  if (headerCountry) return headerCountry;

  const ip = getClientIp(req);
  if (!ip) return null;

  try {
    // eslint-disable-next-line global-require
    const geoip = require("geoip-lite");
    const lookup = geoip.lookup(ip);
    return lookup?.country || null;
  } catch (error) {
    return null;
  }
}
