// Placeholder for isometric world logic
import { cartesianToIsometric } from './isometricUtils';

export default class World {
  constructor(scene) {
    this.scene = scene;
    this.tileWidth = 30;
    this.tileHeight = 15;
    this.width = 12;
    this.height = 12;
    this.tiles = [];
  }

  create() {
    // Draw from top row (y=0) to bottom (y=height-1), left to right
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const iso = cartesianToIsometric(x, y, this.tileWidth, this.tileHeight);
        this.scene.add.image(
          400 + iso.x,
          200 + iso.y,
          'tile'
        ).setOrigin(0.5, 0.5);
      }
    }
  }

  cartesianToScreen(x, y) {
    const iso = cartesianToIsometric(x, y, this.tileWidth, this.tileHeight);
    return { x: 400 + iso.x, y: 200 + iso.y };
  }

  screenToCartesian(sx, sy) {
    // Inverse of cartesianToScreen
    const x = (sy - 200) / (this.tileHeight / 2) + (sx - 400) / (this.tileWidth / 2);
    const y = (sy - 200) / (this.tileHeight / 2) - (sx - 400) / (this.tileWidth / 2);
    return { x: Math.round(x / 2), y: Math.round(y / 2) };
  }
}
