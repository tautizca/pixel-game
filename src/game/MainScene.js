import Phaser from 'phaser';
import Player from './Player';
import World from './World';

class MainScene extends Phaser.Scene {

  constructor() {
    super('MainScene');
    this.cursors = null;
    this.player = null;
    this.world = null;
    this.placedElements = [];
    this.hasWon = false;
    this.worldSize = 10;
    this.playerStart = { x: 1, y: 1 };
    // Randomly generate goals and obstacles
    const allTiles = [];
    for (let y = 1; y < this.worldSize - 1; y++) {
      for (let x = 1; x < this.worldSize - 1; x++) {
        allTiles.push({ x, y });
      }
    }
    // Shuffle and pick two distinct goal tiles
    function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }
    shuffle(allTiles);
    this.goalTiles = [
      { ...allTiles[0], type: 'energy', label: 'Deliver ENERGY here!' },
      { ...allTiles[1], type: 'glass', label: 'Deliver GLASS here!' }
    ];
    // Place obstacles, but not on player or goal tiles
    const forbidden = [this.playerStart, ...this.goalTiles].map(t => `${t.x},${t.y}`);
    const obstacles = [];
    shuffle(allTiles);
    for (let i = 0; i < 12; i++) {
      const t = allTiles[i + 2];
      if (!forbidden.includes(`${t.x},${t.y}`)) obstacles.push({ x: t.x, y: t.y });
    }
    this.obstacles = obstacles;

    // If not all goals are reachable, re-roll
    let tries = 0;
    while (!MainScene._allGoalsReachable(this.playerStart, this.goalTiles, obstacles, this.worldSize) && tries < 10) {
      shuffle(allTiles);
      this.goalTiles = [
        { ...allTiles[0], type: 'energy', label: 'Deliver ENERGY here!' },
        { ...allTiles[1], type: 'glass', label: 'Deliver GLASS here!' }
      ];
      const forbidden = [this.playerStart, ...this.goalTiles].map(t => `${t.x},${t.y}`);
      this.obstacles = [];
      for (let i = 0; i < 12; i++) {
        const t = allTiles[i + 2];
        if (!forbidden.includes(`${t.x},${t.y}`)) this.obstacles.push({ x: t.x, y: t.y });
      }
      tries++;
    }
  }


  preload() {
    // Load tile and player images
    this.load.image('tile', 'assets/tile.png');
    this.load.image('player', 'assets/player.png');
    this.textures.generate('energy', { data: ['3'], pixelWidth: 32, pixelHeight: 32 });
    this.textures.generate('goal', { data: ['4'], pixelWidth: 32, pixelHeight: 32 });
  }


  create() {
    // Custom movement keys
    this.keys = this.input.keyboard.addKeys({
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      num7: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN,
      num9: Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE,
      num1: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
      num3: Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE
    });
    this.add.text(20, 20, 'Goals: Deliver ENERGY and GLASS to their tiles! Avoid obstacles.', { font: '20px Arial', fill: '#ffd600' });
    // Create isometric world
    this.world = new World(this);
    this.world.create();

    // Place obstacles as isometric diamond polygons
    for (const obs of this.obstacles) {
      const iso = this.world.cartesianToScreen(obs.x, obs.y);
      const w = this.world.tileWidth;
      const h = this.world.tileHeight;
      const points = [
        { x: iso.x, y: iso.y - h / 2 }, // top
        { x: iso.x + w / 2, y: iso.y }, // right
        { x: iso.x, y: iso.y + h / 2 }, // bottom
        { x: iso.x - w / 2, y: iso.y }  // left
      ];
      this.add.polygon(0, 0, points.map(p => [p.x, p.y]).flat(), 0x212121, 1)
        .setOrigin(0, 0).setAlpha(0.9);
    }

    // Place goal tiles as isometric diamond polygons
    for (const goal of this.goalTiles) {
      const iso = this.world.cartesianToScreen(goal.x, goal.y);
      const w = this.world.tileWidth;
      const h = this.world.tileHeight;
      const points = [
        { x: iso.x, y: iso.y - h / 2 }, // top
        { x: iso.x + w / 2, y: iso.y }, // right
        { x: iso.x, y: iso.y + h / 2 }, // bottom
        { x: iso.x - w / 2, y: iso.y }  // left
      ];
      this.add.polygon(0, 0, points.map(p => [p.x, p.y]).flat(), goal.type === 'energy' ? 0xfff176 : 0x90caf9, 1)
        .setOrigin(0, 0).setAlpha(0.7);
      this.add.text(iso.x - 32, iso.y - 32, goal.label, { font: '14px Arial', fill: '#fff' });
    }

    // Create player
    this.playerTile = { ...this.playerStart };
    const playerIso = this.world.cartesianToScreen(this.playerTile.x, this.playerTile.y);
    this.player = new Player(this, playerIso.x, playerIso.y, 'player');
    this.player.setTint(0x4fc3f7);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Place element if crafted (simulate for demo)
    this.input.keyboard.on('keydown-E', () => {
      if (!this.placedElements.find(e => e.type === 'energy')) {
        const tile = this.world.screenToCartesian(this.player.x, this.player.y);
        this.placedElements.push({ type: 'energy', ...tile });
        this.add.image(this.player.x, this.player.y, 'energy').setTint(0x00e676);
      }
    });
    this.input.keyboard.on('keydown-G', () => {
      if (!this.placedElements.find(e => e.type === 'glass')) {
        const tile = this.world.screenToCartesian(this.player.x, this.player.y);
        this.placedElements.push({ type: 'glass', ...tile });
        this.add.image(this.player.x, this.player.y, 'glass').setTint(0x90caf9);
      }
    });
  }


  update() {
    if (!this.player || !this.cursors || this.hasWon) return;
    // Convert player position to tile
    let px = Math.round((this.player.x - 400) / (this.world.tileWidth / 2) + (this.player.y - 200) / (this.world.tileHeight / 2)) / 2;
    let py = Math.round((this.player.y - 200) / (this.world.tileHeight / 2) - (this.player.x - 400) / (this.world.tileWidth / 2)) / 2;

    // Isometric movement: Q/7 left, W/9 right, A/1 down, S/3 up
    let moved = false;
    // Q or Numpad 7: left (x-1, y)
    if ((this.keys.q.isDown || this.keys.num7.isDown) && !this._wasQ) {
      if (!this._blocked(px - 1, py)) this._movePlayer(-1, 0);
      moved = true;
    }
    // W or Numpad 9: right (x+1, y)
    if ((this.keys.w.isDown || this.keys.num9.isDown) && !this._wasW) {
      if (!this._blocked(px + 1, py)) this._movePlayer(0, -1);
      moved = true;
    }
    // A or Numpad 1: down (x, y+1)
    if ((this.keys.a.isDown || this.keys.num1.isDown) && !this._wasA) {
      if (!this._blocked(px, py + 1)) this._movePlayer(0, 1);
      moved = true;
    }
    // S or Numpad 3: up (x, y-1)
    if ((this.keys.s.isDown || this.keys.num3.isDown) && !this._wasS) {
      if (!this._blocked(px, py - 1)) this._movePlayer(1, 0);
      moved = true;
    }
    this._wasQ = this.keys.q.isDown || this.keys.num7.isDown;
    this._wasW = this.keys.w.isDown || this.keys.num9.isDown;
    this._wasA = this.keys.a.isDown || this.keys.num1.isDown;
    this._wasS = this.keys.s.isDown || this.keys.num3.isDown;
    if (!moved) this.player.setVelocity(0, 0);

    // Check win: all goals satisfied
    let allGoals = this.goalTiles.every(goal =>
      this.placedElements.find(e => e.type === goal.type && e.x === goal.x && e.y === goal.y)
    );
    if (allGoals) {
      this.hasWon = true;
      this.add.text(200, 100, 'You Win! All goals completed!', { font: '32px Arial', fill: '#00e676' }).setDepth(1000);
    }
  }

  _blocked(x, y) {
    return this.obstacles.some(o => o.x === x && o.y === y);
  }

  _movePlayer(dx, dy) {
    this.playerTile.x += dx;
    this.playerTile.y += dy;
    const iso = this.world.cartesianToScreen(this.playerTile.x, this.playerTile.y);
    this.player.setPosition(iso.x, iso.y);
  }
}

// Static: Simple BFS to check if all goals are reachable from player
MainScene._allGoalsReachable = function(playerStart, goalTiles, obstacles, worldSize) {
  const queue = [[playerStart.x, playerStart.y]];
  const visited = new Set();
  const goals = new Set(goalTiles.map(g => `${g.x},${g.y}`));
  const obs = new Set(obstacles.map(o => `${o.x},${o.y}`));
  while (queue.length) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;
    if (visited.has(key) || obs.has(key)) continue;
    visited.add(key);
    if (goals.has(key)) goals.delete(key);
    if (goals.size === 0) return true;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < worldSize-1 && ny > 0 && ny < worldSize-1) {
        queue.push([nx, ny]);
      }
    }
  }
  return false;
};

export default MainScene;
