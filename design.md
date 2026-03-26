# Medica — Design System

## Color Palette

| Role             | Token                    | Hex       |
|------------------|--------------------------|-----------|
| Primary Dark 1   | `--color-primary-900`   | `#2F3E46` |
| Primary Dark 2   | `--color-primary-800`   | `#354F52` |
| Primary Mid 1    | `--color-primary-600`   | `#52796F` |
| Primary Mid 2    | `--color-primary-500`   | `#6B9080` |
| Accent Soft 1    | `--color-accent-400`    | `#A4C3B2` |
| Accent Soft 2    | `--color-accent-300`    | `#CCE3DE` |
| Accent Soft 3    | `--color-accent-200`    | `#CAD2C5` |
| Background       | `--color-bg`            | `#F6FFF8` |
| Background Alt   | `--color-bg-alt`        | `#EAF4F4` |

## Typography

Font: **Metropolis** (all weights loaded via `@font-face`)

| Level   | Size          | Weight     | Line Height |
|---------|---------------|------------|-------------|
| H1      | 48px / 3rem   | 800 Extra Bold | 1.25   |
| H2      | 32px / 2rem   | 600 Semi-Bold  | 1.3    |
| H3      | 24px / 1.5rem | 600 Semi-Bold  | 1.35   |
| Body 1  | 16px / 1rem   | 400 Regular    | 1.5    |
| Body 2  | 14px / 0.875rem | 400 Regular  | 1.4    |
| Caption | 12px / 0.75rem  | 400 Regular  | 1.4    |

## Spacing System

8px base grid:

| Token        | Value  |
|--------------|--------|
| `--space-1`  | 8px    |
| `--space-2`  | 16px   |
| `--space-3`  | 24px   |
| `--space-4`  | 32px   |
| `--space-5`  | 40px   |
| `--space-6`  | 48px   |
| `--space-8`  | 64px   |
| `--space-10` | 80px   |
| `--space-12` | 96px   |

## Borders

- Bold rounded: `2.5px solid --color-primary-800`
- Standard: `2px solid --color-accent-200`
- Radii: 8px / 12px / 16px / 20px / pill

## Shadows

Subtle, using `rgba(47, 62, 70, ...)`:
- `--shadow-sm`: 0 1px 3px / 5%
- `--shadow-md`: 0 4px 12px / 7%
- `--shadow-lg`: 0 8px 30px / 9%

## Design Direction

- Light theme (`#F6FFF8` base)
- Bold rounded borders (12–20px radius)
- Soft accent blocks (`--color-accent-300`, `--color-bg-alt`)
- Grid layouts with card-based sections
- Subtle shadows, soft contrast
- Minimal gradients allowed
- Accessible, responsive, scalable for React migration
