# Menu images

Drop the menu photos here with these **exact filenames**. Until a file exists,
the page shows a styled "Menu coming soon" card instead of a broken image.

| Branch   | Menu                | Filename                    |
| -------- | ------------------- | --------------------------- |
| Brighton | Sri Lankan Cuisine  | `brighton-cuisine.jpg`      |
| Brighton | Lunch               | `brighton-lunch.jpg`        |
| Brighton | Cocktails           | `brighton-cocktails.jpg`    |
| London   | Sri Lankan Cuisine  | `london-cuisine.jpg`        |
| London   | Lunch               | `london-lunch.jpg`          |
| London   | Cocktails           | `london-cocktails.jpg`      |

## Multi-page menus

If a menu is more than one image, add the extra pages to the `images` array for
that menu in `src/data/locations.ts`, e.g.:

```ts
images: ['/images/menus/brighton-cuisine.jpg', '/images/menus/brighton-cuisine-2.jpg'],
```

## Notes
- `.jpg`, `.png`, `.webp` all fine — just match the path in `locations.ts`.
- Portrait scans look best; images render at full width, tap-to-zoom in a lightbox.
- Cocktails share the same drinks across both branches but list different prices,
  so each branch keeps its own cocktail image.
