import { getSlots, setSlots } from "../../../lib/slots";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ slots: getSlots() });
  }

  if (req.method === "POST") {
    const { slots } = req.body;
    if (slots !== null && (typeof slots !== "number" || slots < 0)) {
      return res.status(400).json({ error: "slots debe ser un número >= 0 o null" });
    }
    setSlots(slots);
    return res.status(200).json({ slots: getSlots() });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
