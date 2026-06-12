# JLarkStories

The source for [jlarkstories.com](https://jlarkstories.com/) — a Hugo static site for art, comics, and writing by J. Lark.

Stack: Hugo (extended), vanilla CSS, vanilla JS. No build step beyond `hugo`.

## Local development

```bash
hugo server -D          # run locally with drafts visible, http://localhost:1313
hugo --minify           # build to /public/ for deployment
```

Drafts (`draft: true` in frontmatter) do not appear in `hugo --minify` output unless `-D` is passed.

## Repository layout

| Path | What's in it |
|---|---|
| `content/blog/{art,guest-art,fursuiting,news,reviews}/` | Blog posts grouped by section |
| `content/projects/` | Project landing pages (external sites like webcomics) |
| `content/about.md` | About page |
| `data/featured.toml` | Curation for the homepage featured spreads |
| `data/content_warnings.toml` | Hideable tag groups for the content preferences modal |
| `data/artists.json` | Guest artist names + optional external URLs |
| `config.toml` | Site title, nav menu, social links, taglines, params |
| `layouts/` | Hugo templates (partials, single/list views, taxonomies) |
| `static/css/style.css` | All site styles (single file) |
| `static/js/` | `search.js`, `nav.js`, `content-warnings.js`, `tagline.js` |
| `static/fonts/` | Self-hosted Clash Display, Commit Mono, Inter |
| `static/images/` | Site assets + per-post thumbnails under `/images/blog/` |
| `archetypes/default.md` | Frontmatter template used by `hugo new` |
| `scripts/` | One-off Python importers (FA/DA/Patreon/BTS) and image optimizer |

## Adding a blog post

The simplest path is to create the file directly:

```bash
hugo new blog/art/my-new-post.md
```

That seeds the file from `archetypes/default.md`. Then fill in the frontmatter and body.

### Minimum frontmatter (all sections)

```yaml
---
title: "My Post Title"
date: 2026-04-17T12:00:00+0000
categories: ["My Art"]       # see category list below
tags: ["lizard", "digital"]
thumbnail: "/images/blog/my-new-post.jpg"
summary: "Short blurb used on list pages and meta tags."
draft: false
---
```

Drop the thumbnail image into `static/images/blog/`. Keep thumbnails reasonably square — list pages render them as square tiles with a hover overlay.

### Categories by section

Each blog section expects a matching `categories` value:

| Section path | `categories` value |
|---|---|
| `content/blog/art/` | `["My Art"]` |
| `content/blog/guest-art/` | `["Guest Art"]` |
| `content/blog/fursuiting/` | `["Fursuiting"]` |
| `content/blog/news/` | `["News"]` |
| `content/blog/reviews/` | `["Reviews"]` |

### Guest art posts — extra field

Guest art posts add an `artists` array. Each name should match a key in `data/artists.json`:

```yaml
artists: ["OrbitalFox"]
```

To register a new artist, add an entry to `data/artists.json`:

```json
"New Artist Name": { "url": "https://example.com/their-site" }
```

Leave `url` as `""` if they don't have a public profile. Artist pages render the URL as a link above the grid when present.

### Review posts — extra fields

```yaml
link: "https://example.com/the-thing-reviewed"
rating: "PG"                              # existing values: G, PG, T
warnings: ["mild language", "blood"]      # free-form strings
```

`rating` is also a taxonomy — each distinct value gets a browse page at `/rating/<value>/`, so stick to the existing set (`G`, `PG`, `T`) unless you want to introduce a new category. `my_rating` works the same way as its own separate taxonomy with browse pages at `/my_rating/<value>/`.

### Content-warning tags

Posts appear blurred for visitors who have opted to hide certain content. The blur is triggered by tags — see **Updating the content preferences dialog** below for how the tag → label mapping works. Just tag posts honestly; the dialog config handles the rest.

On list pages, clicking a blurred thumbnail opens the post normally (it does not reveal in place). On the post page itself, clicking a blurred image reveals it.

### Sequences (multi-part posts)

Prev/next arrows are wired up per-post by setting `previous` and/or `next` to the **permalink** of the neighboring post. There is no grouping field — each post just points at its neighbors.

```yaml
previous: "/blog/art/ines-muscle-experiment-2/"
next: "/blog/art/ines-muscle-experiment-4/"
```

The first post in a sequence omits `previous`; the last omits `next`. Paths use a leading and trailing slash to match Hugo permalinks.

### Other optional fields

These are used by individual post types and are safe to omit:

| Field | Used by | What it does |
|---|---|---|
| `description` | any post | Long alt/description text, surfaced in a collapsible "Description" disclosure under the thumbnail. Also used as the image `alt` attribute. |
| `created_date` | any post | Human-readable string shown as "Originally created …" — handy when `date` is the publish date but the art is older. |
| `timelapse` | any post | YouTube URL or bare video ID. Embeds a timelapse video below the post body. Accepts `watch?v=`, `youtu.be/`, and `youtube.com/shorts/` URLs. |
| `fa_id` / `bsky_id` / `furtrack_id` / `babyfur_id` | any post | IDs (not URLs) used to render cross-post links to the FA submission, Bluesky post, FurTrack photo, or Babyfur.ME post. |
| `my_rating` / `score` | reviews | Personal rating / numeric score displayed in the review header. |
| `imdb` / `tomatoes` | reviews | External IDs used to render IMDb / Rotten Tomatoes links. |

## Adding a project

Projects live at `content/projects/<slug>.md` and typically point to an external site:

```yaml
---
title: "My Project"
thumbnail: "/images/myproject_card.jpg"
link: "https://myproject.com"
weight: 3                  # ordering; lower = earlier
---

Prose describing the project. Markdown supported. This body text is shown
under the project card on the homepage featured spread.
```

## Updating the rotating taglines (homepage)

Edit the `taglines` array under `[params]` in `config.toml`:

```toml
[params]
  taglines = [
    "Digital storyteller.",
    "Artist.",
    "Comic creator.",
    "Fursuiter.",
    "Devoted family bird.",
  ]
```

The first entry is server-rendered as the static fallback. The typing-and-deleting effect cycles through the full array. Users with `prefers-reduced-motion` enabled only see the first entry. Keep each line short — they display on a single line.

## Updating the homepage featured spreads

Edit `data/featured.toml`. There are three spreads: `[projects]`, `[art]`, `[guest]`.

```toml
[art]
title = "My Art"
link = "/blog/art/"
posts = [
  "/blog/art/elis-healing-hug",
  "/blog/art/stained-glass-june",
  "/blog/art/legendary-flight",
  "/blog/art/mothers-love",
]
```

Each spread also accepts an optional `subtitle` — a short tagline rendered under the heading. Used on `[guest]` to explain what "Guest Art" means. Omit it to drop back to heading-only.

```toml
subtitle = "Artwork made by others, including gifts, commissions, and fan-art of my characters."
```

Rules:
- Post paths have **no trailing slash** and match the content file path under `content/` (minus the `.md`).
- For `[art]` and `[guest]`: the layout alternates a row of up to 2 large square tiles + a row of up to 3 smaller square tiles, repeating. Posts map one-to-one with tiles in the order listed (posts 1–2 → large row, posts 3–5 → small row, posts 6–7 → large row, posts 8–10 → small row). The spread is capped at **4 visible rows**, so list up to 10 posts; extras are ignored. Under 900px, large rows drop from 2-up to 1-up and small rows drop from 3-up to 2-up (the 3rd tile hides) to keep the 4-row cap at narrow widths.
- For `[projects]`: the `variant = "projects"` flag is set; all listed projects render as equal square tiles side-by-side with their description text underneath. Each card links to the project's external `link` param. Two works well; the layout stays 2-up.
- If a path doesn't resolve, it's silently skipped.
- If the whole list is empty, the entire spread is hidden.

## Updating the content preferences dialog

Edit `data/content_warnings.toml`. Each `[[hideable]]` entry becomes one toggle in the modal:

```toml
[[hideable]]
label = "Swimwear"
description = "Characters in a swimsuit."
tags = ["swimwear", "swimsuit", "trunks", "bikini", "speedo"]
```

- `label` — what shows in the modal next to the Show/Hide toggle.
- `description` — the helper text under the label.
- `tags` — lowercase tag values that trigger the blur when a visitor has that label's toggle set to Hide. Matching is case-insensitive against the post's `tags` frontmatter.

To add a new hideable category, append a new `[[hideable]]` block. To retire one, delete the block — visitors' saved preferences for removed labels are silently ignored.

The first-visit banner and modal state are stored in `localStorage` under `jls-hidden-tags` and `jls-prefs-seen`.

## Themes / Pride modes

Three flag-colored themes are available — `pride`, `bi`, and `trans`. Each one paints headings and titles with a gradient and swaps the site logos for a themed variant.

The site auto-applies a theme on these dates:

| Date | Default theme |
| --- | --- |
| June 1, 4, 7, … (every 3rd day) | `pride` |
| June 2, 5, 8, … | `bi` |
| June 3, 6, 9, … | `trans` |
| July 1 (Pride doesn't end when the month does) | `pride` |
| March 31 (Trans Day of Visibility) | `trans` |
| November 13–20 (Trans Awareness Week + TDoR) | `trans` |

Override or force a theme with the `?theme=` query string:

- `?theme=pride` / `?theme=bi` / `?theme=trans` — force that theme on
- `?theme=normal` — disable any theme for the visit (overrides the date-based default)

The toggle is applied in `layouts/_default/baseof.html`.

Themed logos live alongside the standard ones in `static/images/` — e.g. `logo_pride.png`, `logo_header_bi.png`, `logo_trans.png`. To opt an `<img>` into theming, add `data-theme-logo="<basename>"` (e.g. `data-theme-logo="logo_header"`) and provide `<basename>_pride.png`, `<basename>_bi.png`, and `<basename>_trans.png`. The script in `layouts/_default/baseof.html` swaps the `src` when a theme is active.

## Fonts

Self-hosted under `static/fonts/`:

```
fonts/clash-display/   ClashDisplay-Semibold.woff2, ClashDisplay-Bold.woff2
fonts/commit-mono/     CommitMono-400-Regular.woff2, 400-Italic, 700-Regular
fonts/inter/           Inter-Regular.woff2, Inter-Italic, Inter-SemiBold
```

Three are preloaded in `layouts/partials/head.html`; the rest swap in on demand with `font-display: swap`.

## Deployment

`hugo --minify` writes the site to `/public/`. Deploy the contents of that directory to any static host. The site has no server-side component.

## Scripts

`scripts/` holds one-off Python utilities for importing from other platforms (FA, DA, Patreon, BTS) and for batch-optimizing images. They're not part of the build.

## Todo

- [ ] Add a TOS page, including how people are allowed to use the art from my site and terms for commissioning me for art.
- [ ] Category for characters, including ref sheets and link to art of that character.
- [ ] Newsletter signup.
- [ ] Store link
- [ ] When 'created_date' is present in the "Fursuiting" category, use "Originally taken" instead of "Originally created".
- [ ] Use migration scripts to migrate deviantArt journal entries.
- [ ] Add "Or as I like to call it..." subtitle to review entries.
