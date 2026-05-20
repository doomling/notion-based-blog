export default function handler(req, res) {
  const url = process.env.NOTION_CALENDAR_URL;
  if (!url) {
    return res.status(404).json({ error: "Booking URL not configured" });
  }
  res.redirect(302, url);
}
