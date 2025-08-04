import React, { useRef, useEffect, useState } from 'react';
import IngredientIcon from './IngredientIcon';

// Helper to extract crafted result from message
function parseCrafted(message) {
  const match = message && message.startsWith('Crafted ')
    ? message.match(/^Crafted (\w+)!/)
    : null;
  return match ? match[1] : null;
}

const Crafting = ({ selected, ingredients, craftSelected, message }) => {
  const selectedIngredients = ingredients.filter(ing => selected.includes(ing.id));
  const [feedback, setFeedback] = useState({ text: '', color: '#fff', animate: false, shake: false });
  const prevMessage = useRef('');
  const [crafted, setCrafted] = useState(null);

  useEffect(() => {
    if (message && message !== prevMessage.current) {
      if (message.startsWith('Crafted')) {
        setFeedback({ text: message, color: '#00e676', animate: true, shake: false });
        setCrafted(parseCrafted(message));
      } else if (message === 'No recipe found.') {
        setFeedback({ text: message, color: '#ff5252', animate: false, shake: true });
        setCrafted(null);
      } else {
        setFeedback({ text: message, color: '#ffd600', animate: false, shake: false });
        setCrafted(null);
      }
      prevMessage.current = message;
    }
    if (feedback.animate) {
      const timer = setTimeout(() => setFeedback(f => ({ ...f, animate: false })), 700);
      return () => clearTimeout(timer);
    }
    if (feedback.shake) {
      const timer = setTimeout(() => setFeedback(f => ({ ...f, shake: false })), 500);
      return () => clearTimeout(timer);
    }
  }, [message, feedback.animate, feedback.shake]);

  // Find crafted ingredient data and abilities
  let craftedData = null;
  if (crafted) {
    craftedData = ingredients.find(ing => ing.id === crafted) || { id: crafted, name: crafted };
  }
  // Find abilities from recipes
  let craftedAbilities = null;
  if (crafted) {
    try {
      // eslint-disable-next-line
      const recipes = require('../data/recipes.json');
      const recipe = recipes.find(r => r.result === crafted);
      craftedAbilities = recipe ? recipe.abilities : null;
    } catch {}
  }

  // Always show feedback area, even if empty
  return (
    <div className="crafting-panel">
      <h2>Crafting</h2>
      <div style={{ display: 'flex', gap: 8, minHeight: 48 }}>
        {selectedIngredients.length === 0 && <span style={{ color: '#888' }}>Select ingredients from inventory</span>}
        {selectedIngredients.map(ing => (
          <IngredientIcon key={ing.id} ingredient={ing} count={1} selected={true} />
        ))}
      </div>
      <button
        style={{ marginTop: 12, padding: '8px 16px', fontSize: 16, borderRadius: 8, background: '#ffd600', color: '#222', border: 'none', cursor: 'pointer' }}
        onClick={craftSelected}
        disabled={selectedIngredients.length < 2}
      >
        Craft
      </button>
      <div
        style={{
          marginTop: 12,
          minHeight: 36,
          color: feedback.color,
          fontWeight: 'bold',
          fontSize: feedback.animate ? 22 : 16,
          transition: 'font-size 0.2s',
          textShadow: feedback.animate ? '0 0 8px #fff' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: feedback.text ? `2px solid ${feedback.color}` : '2px solid transparent',
          borderRadius: 8,
          background: feedback.text ? 'rgba(30,30,60,0.85)' : 'none',
          boxShadow: feedback.text ? '0 2px 8px #0006' : 'none',
          padding: feedback.text ? '8px 12px' : 0,
          animation: feedback.animate ? 'pop 0.5s' : feedback.shake ? 'shake 0.5s' : 'none',
        }}
      >
        {craftedData && feedback.color === '#00e676' && (
          <IngredientIcon ingredient={craftedData} count={1} selected={true} />
        )}
        <span>{feedback.text}</span>
        {craftedAbilities && feedback.color === '#00e676' && (
          <span style={{ fontSize: 14, color: '#ffd600', marginLeft: 8 }}>
            [Abilities: {craftedAbilities.join(', ')}]
          </span>
        )}
      </div>
      <style>{`
        @keyframes pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Crafting;
