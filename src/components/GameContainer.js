import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/MainScene';

const GameContainer = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'phaser-container',
        backgroundColor: '#222',
        physics: {
          default: 'matter',
          matter: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        scene: [MainScene],
        pixelArt: true,
      };
      gameRef.current = new Phaser.Game(config);
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="phaser-container" style={{ width: 800, height: 600 }} />;
};

export default GameContainer;
