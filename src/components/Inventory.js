import IngredientIcon from './IngredientIcon';
const Inventory = ({ inventory, ingredients, unlocked, selected, selectIngredient, deselectIngredient }) => {
  // Show all unlocked elements, sorted by name
  const unlockedList = ingredients.filter(ing => unlocked.has(ing.id)).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="inventory-panel">
      <h2>Inventory</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {unlockedList.map(ing => (
          <IngredientIcon
            key={ing.id}
            ingredient={ing}
            count={inventory[ing.id] || 0}
            selected={selected.includes(ing.id)}
            onClick={() =>
              selected.includes(ing.id)
                ? deselectIngredient(ing.id)
                : (inventory[ing.id] > 0 && selectIngredient(ing.id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
