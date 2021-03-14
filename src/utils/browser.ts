export function getSimpleRandStr(): string {
  const rand = Math.random() * 10000000;
  return `${Date.now()}${rand}`;
}
