
const style = {
  display: 'inline-block',
  width: 40,
  height: 40,
  borderRadius: 8,
  margin: 4,
  border: '2px solid #fff',
  boxShadow: '0 2px 8px #0006',
  fontWeight: 'bold',
  fontSize: 18,
  textAlign: 'center',
  lineHeight: '40px',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden',
};

export default function IngredientIcon({ ingredient, count, selected, onClick }) {
  let iconContent = null;
  if (ingredient.icon) {
    try {
      // Try to require the image, fallback to letter if not found
      iconContent = <img src={require(`../assets/${ingredient.icon}`)} alt={ingredient.name} style={{ width: 32, height: 32 }} />;
    } catch {
      iconContent = <span>{ingredient.name[0]}</span>;
    }
  } else {
    // Use unique letter (first not-yet-used uppercase letter in name)
    const used = new Set();
    for (let c of ingredient.name.toUpperCase()) {
      if (c >= 'A' && c <= 'Z' && !used.has(c)) {
        iconContent = <span>{c}</span>;
        used.add(c);
        break;
      }
    }
    if (!iconContent) iconContent = <span>{ingredient.name[0]}</span>;
  }
  return (
    <div
      style={{
        ...style,
        background: ingredient.color,
        opacity: count > 0 ? 1 : 0.3,
        outline: selected ? '3px solid #ffd600' : 'none',
      }}
      title={ingredient.name}
      onClick={onClick}
    >
      {iconContent}
      {count > 1 && (
        <span style={{ position: 'absolute', right: 6, bottom: 2, fontSize: 12 }}>{count}</span>
      )}
    </div>
  );
}
