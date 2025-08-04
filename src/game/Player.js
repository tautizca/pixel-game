import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);
    this.setFixedRotation();
    this.setFrictionAir(0.1);
  }

  move(direction) {
    const speed = 2.5;
    switch (direction) {
      case 'up':
        this.setVelocityY(-speed);
        break;
      case 'down':
        this.setVelocityY(speed);
        break;
      case 'left':
        this.setVelocityX(-speed);
        break;
      case 'right':
        this.setVelocityX(speed);
        break;
      default:
        this.setVelocity(0, 0);
    }
  }
}
