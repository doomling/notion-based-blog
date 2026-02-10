import { getClientIp, getCountryFromRequest } from "../../lib/geo";

export default function handler(req, res) {
  const forwardedFor = req.headers["x-forwarded-for"] || null;
  const realIp = req.headers["x-real-ip"] || null;
  const remoteAddress = req.socket?.remoteAddress || null;
  const ip = getClientIp(req);
  const country = getCountryFromRequest(req);

  return res.status(200).json({
    forwardedFor,
    realIp,
    remoteAddress,
    ip,
    country,
  });
}
