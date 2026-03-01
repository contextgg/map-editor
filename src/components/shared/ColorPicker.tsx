import React from 'react';
import type { RGBA } from '../../types/map';
import { rgbaToHex, hexToRgba } from '../../lib/three-helpers';

interface ColorPickerProps {
  label: string;
  value: RGBA;
  onChange: (c: RGBA) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="color"
          value={rgbaToHex(value)}
          onChange={(e) => onChange(hexToRgba(e.target.value, value[3]))}
          style={{ width: 32, height: 24, border: 'none', padding: 0, cursor: 'pointer' }}
        />
        <input
          type="number"
          value={Number(value[3].toFixed(2))}
          min={0}
          max={1}
          step={0.05}
          onChange={(e) => {
            const a = parseFloat(e.target.value) || 0;
            onChange([value[0], value[1], value[2], a]);
          }}
          title="Alpha"
          style={{
            width: 50,
            padding: '2px 4px',
            fontSize: 12,
            background: '#2a2a2a',
            color: '#ddd',
            border: '1px solid #444',
            borderRadius: 3,
          }}
        />
        <span style={{ fontSize: 10, color: '#666' }}>
          {rgbaToHex(value)}
        </span>
      </div>
    </div>
  );
}
