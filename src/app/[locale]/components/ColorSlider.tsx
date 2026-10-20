import { useState, type ChangeEvent } from 'react';

interface ColorSliderProps {
  value?: string;
  onChange?: (color: string) => void;
}

/** Edits the initial Pip-Boy color and reports subsequent color selections. */
export default function ColorSlider({ value, onChange }: ColorSliderProps) {
  // value: color in hex, e.g. '#00ff00'
  // onChange: function(hexColor)
  const [color, setColor] = useState(value || '#00ff00');

  /** Reports the color input's selected hexadecimal value. */
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setColor(e.target.value);
    onChange?.(e.target.value);
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
