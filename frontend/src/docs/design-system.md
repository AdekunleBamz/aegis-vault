# Aegis Vault Design System

This document outlines the design tokens and utility classes used in the modernized Aegis Vault interface.

## 🎨 Color Palette (HSL)
We use a primary set of institutional-grade colors for key UI elements.

- **Aegis Blue**: `hsl(var(--aegis-blue))` - Primary actions, active states.
- **Aegis Purple**: `hsl(var(--aegis-purple))` - Secondary highlights, reward indicators.
- **Aegis Cyan**: `hsl(var(--aegis-cyan))` - Growth indicators, tier benefits.
- **Aegis Indigo**: `hsl(var(--aegis-indigo))` - Protocol health, background accents.

## 🔠 Typography
- **Font Family**: `Outfit`, sans-serif.
- **Scale**:
  - `text-8xl`: Hero headlines.
  - `text-5xl`: Page titles.
  - `text-2xl`: Component headers.
  - `text-xs`: Labels and secondary metadata.

## ✨ Glassmorphism
The interface relies on layered transparency and light-refraction effects.

### Utility Classes
- `.glass`: Base backdrop filter (blur: 16px).
- `.glass-card`: Semi-transparent background with a subtle white border-top/left for lighting effect.
- `.text-gradient`: Linear gradient text from blue to purple.

## 📐 Layout Principles
- **Border Radius**: Consistent `32px` to `48px` for large containers, `full` for interactive elements.
- **Spacing**: Generous padding (`p-8` to `p-12`) to allow the design to "breathe".
- **Motion**: Standardized spring transitions for all hover and entrance animations via `framer-motion`.

## ⌨️ Focus Visibility
- Interactive elements should keep a visible focus style with at least a 2px outline equivalent.
