
import GameContainer from './components/GameContainer';
import Inventory from './components/Inventory';
import Crafting from './components/Crafting';
import useGameState from './components/useGameState';
import IngredientIcon from './components/IngredientIcon';
import './App.css';

function App() {
  const gameState = useGameState();
  return (
    <div className="app-root">
      <h1>Pixel Art Isometric Game</h1>
      <div style={{
        background: 'rgba(30,30,60,0.95)',
        borderRadius: 12,
        padding: 16,
        margin: '16px 0',
        maxWidth: 700,
        color: '#ffd600',
        fontSize: 16,
        boxShadow: '0 2px 12px #0006',
      }}>
        <b>How to Play:</b> Select ingredients from your inventory (left panel), then click <b>Craft</b> to try mixing them. Successful recipes create new elements with unique abilities. Use the arrow keys to move your character in the isometric world. Experiment to discover all combinations!
      </div>
      <div className="main-content">
        <GameContainer />
        <div className="side-panel">
          <Inventory {...gameState} />
          <Crafting {...gameState} />
        </div>
      </div>
    </div>
  );
}

export default App;
