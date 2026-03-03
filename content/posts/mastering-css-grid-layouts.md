# Mastering CSS Grid Layouts

CSS Grid has fundamentally changed how we approach web layouts. Gone are the days of float hacks and complex flexbox nesting for two-dimensional layouts. Grid gives us a clean, declarative way to build everything from simple card grids to complex magazine-style layouts.

## The Basics: Defining a Grid

Creating a grid is as simple as:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
```

This creates a three-column layout with equal-width columns and consistent spacing.

## Grid Template Areas — The Secret Weapon

One of Grid's most powerful features is `grid-template-areas`, which lets you define layouts using named regions:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

## Responsive Grids with auto-fit and minmax

The combination of `auto-fit` and `minmax()` creates responsive grids without media queries:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

This automatically adjusts the number of columns based on available space — no breakpoints needed!

## Subgrid: Aligning Nested Content

CSS Subgrid (now widely supported) allows child grids to inherit track sizing from parent grids:

```css
.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

This ensures that card titles, descriptions, and footers all align perfectly across rows.

## When to Use Grid vs. Flexbox

- **Grid:** Two-dimensional layouts (rows AND columns)
- **Flexbox:** One-dimensional layouts (row OR column)
- **Both:** They work beautifully together!

---

CSS Grid is one of the most impactful CSS features ever created. Once you master it, you'll wonder how you ever built layouts without it.
