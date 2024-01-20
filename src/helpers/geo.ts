export function getDirectionName(azimuth: number): string {
  azimuth = ((azimuth % 360) + 360) % 360;

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const angleStep = 45;

  const index = Math.floor((azimuth + angleStep / 2) / angleStep) % 8;

  return directions[index];
}
