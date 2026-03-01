import React from 'react';
import type { Vec3 } from '../../types/map';

interface Vec3InputProps {
  label: string;
  value: Vec3;
  onChange: (v: Vec3) => void;
  step?: number;
}

export function Vec3Input({ label, value, onChange, step = 0.1 }: Vec3InputProps) {
  const labels = ['X', 'Y', 'Z'];
  const colors = ['#e74c3c', '#2ecc71', '#3498db'];

  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 4 }}>
        {labels.map((axis, i) => (
          <div key={axis} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 10, color: colors[i], fontWeight: 'bold', width: 10 }}>
              {axis}
            </span>
            <input
              type="number"
              value={Number(value[i].toFixed(3))}
              step={step}
              onChange={(e) => {
                const next: Vec3 = [...value];
                next[i] = parseFloat(e.target.value) || 0;
                onChange(next);
              }}
              style={{
                width: '100%',
                padding: '2px 4px',
                fontSize: 12,
                background: '#2a2a2a',
                color: '#ddd',
                border: '1px solid #444',
                borderRadius: 3,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
