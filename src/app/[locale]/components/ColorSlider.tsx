import { useState } from 'react';

export default function ColorSlider({ value, onChange }) {
  // value: color in hex, e.g. '#00ff00'
  // onChange: function(hexColor)
  const [color, setColor] = useState(value || '#00ff00');

  function handleChange(e) {
    setColor(e.target.value);
    onChange && onChange(e.target.value);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ color: color }}>Color Pip-Boy:</label>
      <input
        type="color"
        value={color}
        onChange={handleChange}
        style={{ width: 40, height: 40, border: 'none', background: 'none' }}
      />
      <span style={{ color }}>{color}</span>
    </div>
  );
}
