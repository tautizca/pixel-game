import { useState } from 'react';
import ingredientsData from '../data/ingredients.json';
import { addToInventory, removeFromInventory } from '../utils/inventory';
import { craft } from '../utils/crafting';

export default function useGameState() {
  const [inventory, setInventory] = useState({ water: 2, fire: 2, earth: 2, air: 2 });
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [unlocked, setUnlocked] = useState(new Set(['water', 'fire', 'earth', 'air']));

  const ingredients = ingredientsData;

  function selectIngredient(id) {
    if (selected.includes(id)) return;
    setSelected([...selected, id]);
  }

  function deselectIngredient(id) {
    setSelected(selected.filter(i => i !== id));
  }

  function craftSelected() {
    if (selected.length < 2) {
      setMessage('Select at least 2 ingredients.');
      return;
    }
    const result = craft(selected);
    if (result) {
      let nextInv = { ...inventory };
      selected.forEach(id => {
        nextInv = removeFromInventory(nextInv, id, 1);
      });
      nextInv = addToInventory(nextInv, result.result, 1);
      setInventory(nextInv);
      setMessage(`Crafted ${result.result}!`);
      setUnlocked(prev => new Set([...prev, result.result]));
    } else {
      setMessage('No recipe found.');
    }
    setSelected([]);
  }

  return {
    inventory,
    ingredients,
    unlocked,
    selected,
    selectIngredient,
    deselectIngredient,
    craftSelected,
    message,
    setMessage,
  };
}
