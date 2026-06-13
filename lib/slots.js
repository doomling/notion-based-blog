if (global._consultoriaSlots === undefined) {
  global._consultoriaSlots = null;
}

if (!global._consultoriaProcessed) {
  global._consultoriaProcessed = new Set();
}

export function getSlots() {
  return global._consultoriaSlots;
}

export function setSlots(n) {
  global._consultoriaSlots = typeof n === "number" ? n : null;
}

export function decrementSlots(paymentId) {
  if (global._consultoriaProcessed.has(paymentId)) return true;
  global._consultoriaProcessed.add(paymentId);
  if (global._consultoriaSlots === null) return true;
  if (global._consultoriaSlots <= 0) return false;
  global._consultoriaSlots -= 1;
  return true;
}
