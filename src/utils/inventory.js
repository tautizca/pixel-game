// Simple inventory utility
export function addToInventory(inventory, itemId, amount = 1) {
  const next = { ...inventory };
  next[itemId] = (next[itemId] || 0) + amount;
  return next;
}

export function removeFromInventory(inventory, itemId, amount = 1) {
  const next = { ...inventory };
  if (!next[itemId]) return next;
  next[itemId] -= amount;
  if (next[itemId] <= 0) delete next[itemId];
  return next;
}
