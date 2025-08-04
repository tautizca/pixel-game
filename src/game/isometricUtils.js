// Utility for isometric coordinate transforms
export function cartesianToIsometric(x, y, tileWidth, tileHeight) {
  return {
    x: (x - y) * (tileWidth / 2),
    y: (x + y) * (tileHeight / 2),
  };
}

export function isometricToCartesian(isoX, isoY, tileWidth, tileHeight) {
  return {
    x: (isoY / (tileHeight / 2) + isoX / (tileWidth / 2)) / 2,
    y: (isoY / (tileHeight / 2) - isoX / (tileWidth / 2)) / 2,
  };
}
