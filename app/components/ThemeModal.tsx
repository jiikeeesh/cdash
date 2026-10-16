'use client';

import React, { useState } from 'react';
import { useTheme, PRESET_COLORS } from '../lib/theme-context';

export default function ThemeModal() {
  const {
    mode,
    setMode,
    themeColor,
    customHex,
    setThemeColor,
    resetTheme,
    isThemeModalOpen,
    setIsThemeModalOpen,
  } = useTheme();

  const [hexInput, setHexInput] = useState(customHex);

  if (!isThemeModalOpen) return null;

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setThemeColor('custom', val);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    setThemeColor('custom', val);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsThemeModalOpen(false)}>
      <div 
        className="modal theme-customizer-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560, maxHeight: '92vh' }}
        role="dialog"
        aria-label="Theme Customizer"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--brand-50)',
              color: 'var(--brand-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
                <line x1="9" y1="21" x2="15" y2="21"/>
              </svg>
            </div>
            <div>
              <div className="modal-title">Theme & Appearance</div>
              <div style={{ fontSize: 13, color: 'var(--neutral-400)', marginTop: 2 }}>
                Customize light/dark mode and your personal accent color
              </div>
            </div>
          </div>
          <button 
            className="btn-close" 
            onClick={() => setIsThemeModalOpen(false)}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          {/* Section 1: Light vs Dark Mode */}
          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--neutral-400)', marginBottom: 12 }}>
              Display Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Light Option */}
              <button
                type="button"
                onClick={() => setMode('light')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: mode === 'light' ? '2.5px solid var(--brand-600)' : '1.5px solid var(--neutral-200)',
                  background: mode === 'light' ? 'var(--brand-50)' : 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: mode === 'light' ? '0 4px 14px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--neutral-900)' }}>Light Theme</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2 }}>Clean & crisp daylight look</div>
                </div>
              </button>

              {/* Dark Option */}
              <button
                type="button"
                onClick={() => setMode('dark')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: mode === 'dark' ? '2.5px solid var(--brand-600)' : '1.5px solid var(--neutral-200)',
                  background: mode === 'dark' ? 'var(--brand-50)' : 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: mode === 'dark' ? '0 4px 14px rgba(99,102,241,0.2)' : 'none',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#312e81',
                  color: '#a5b4fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--neutral-900)' }}>Dark Theme</div>
                  <div style={{ fontSize: 12, color: 'var(--neutral-400)', marginTop: 2 }}>Sleek, low-strain night mode</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Accent Color Themes */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--neutral-400)', marginBottom: 12 }}>
              Accent Color Palette
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: 10 }}>
              {PRESET_COLORS.map((preset) => {
                const isSelected = themeColor === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setThemeColor(preset.id)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2.5px solid ${preset.primary}` : '1.5px solid var(--neutral-200)',
                      background: isSelected ? 'var(--neutral-100)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: preset.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 3px 8px ${preset.primary}55`,
                      }}
                    >
                      {isSelected && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, color: 'var(--neutral-800)', textAlign: 'center' }}>
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Custom Color Picker */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            border: themeColor === 'custom' ? '2.5px solid var(--brand-600)' : '1.5px dashed var(--neutral-300)',
            background: 'var(--neutral-50)',
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🎨</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>
                  Pick Any Custom Color
                </span>
              </div>
              {themeColor === 'custom' && (
                <span className="badge badge-done" style={{ fontSize: 11 }}>Active</span>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Color picker input box */}
              <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                <input
                  type="color"
                  value={customHex.startsWith('#') ? customHex : '#6366f1'}
                  onChange={handleColorPickerChange}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                  title="Choose custom color"
                />
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  background: customHex,
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
              </div>

              {/* Hex Text Input */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--neutral-400)', marginBottom: 4 }}>HEX COLOR CODE</div>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleCustomHexChange}
                  placeholder="#6366f1"
                  maxLength={7}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--neutral-300)',
                    fontFamily: 'monospace',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                />
              </div>

              <button
                type="button"
                className="btn btn-brand btn-sm"
                onClick={() => setThemeColor('custom', hexInput)}
                style={{ alignSelf: 'flex-end', height: 40 }}
              >
                Apply Color
              </button>
            </div>
          </div>

          {/* Section 4: Live Preview Card */}
          <div style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--neutral-200)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
              Live Theme Preview
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <button className="btn btn-brand btn-sm">Primary Button</button>
              <button className="btn btn-outline btn-sm">Outline Button</button>
              <span className="icon-chip icon-chip-brand">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Brand Accent Chip
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={resetTheme}
            style={{ color: 'var(--neutral-500)' }}
          >
            Reset to Default
          </button>
          <button
            type="button"
            className="btn btn-brand"
            onClick={() => setIsThemeModalOpen(false)}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
