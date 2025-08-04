# Pixel Art Isometric Game

A React-based isometric pixel-art game where players mix ingredients to create new elements with unique abilities, and interact with a dynamic world.

## Features
- Configurable ingredient/recipe/ability system (JSON-driven)
- Pixel-art isometric graphics with modern polish
- Physics engine (Matter.js via Phaser)
- Modular, extensible architecture
- Inventory and crafting UI
- Easy to add new ingredients, recipes, or mechanics

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the game:**
   ```bash
   npm start
   ```

## Folder Structure
- `src/components`: React UI components (GameContainer, Inventory, Crafting)
- `src/game`: Phaser scenes and game logic
- `src/data`: JSON files for ingredients, recipes, etc.
- `src/assets`: Pixel-art assets (tiles, sprites, icons)
- `src/utils`: Utility functions

## Extending the Game
- Add new ingredients or recipes by editing the JSON files in `src/data`.
- Add new mechanics or world upgrades in `src/game`.

## Demo
- Run locally with `npm start` and open [http://localhost:3000](http://localhost:3000)

---
MIT License
