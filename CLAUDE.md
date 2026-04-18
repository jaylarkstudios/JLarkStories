# Instructions for Claude

## Keep README.md in sync

`README.md` is the human-facing guide for how to use this site. Whenever you make a change that affects **how the site is used or authored**, update `README.md` in the same turn — don't leave it for later.

Trigger an update when you:

- Add, remove, or rename a frontmatter field that authors are expected to set (e.g. `thumbnail`, `artists`, `rating`, `sequence`, new taxonomy).
- Add or restructure a content directory under `content/` (new blog section, new content type, new taxonomy).
- Change the schema of any data file under `data/` — `featured.toml`, `content_warnings.toml`, `artists.json`. This includes adding new fields (like the `variant` key on featured spreads) or changing how existing fields are interpreted.
- Add, remove, or rename a `[params]` entry in `config.toml` that the author is expected to edit (e.g. `taglines`, `social.*`, `bio`).
- Add a new homepage section, featured-spread variant, or partial that takes author-curated input.
- Change how content warnings, the preferences modal, or the first-visit banner behave from a visitor's or author's perspective.
- Add or change a build/dev command, deploy step, or required tool.
- Add a new script under `scripts/` that authors are expected to run.
- Add or swap a self-hosted font family.

Do **not** update the README for internal refactors that don't change the author-facing contract: CSS tweaks, template reorganizations, JS internals, renaming classes, changing tokens, etc. The README documents *how to use the site*, not how it's built.

When updating, keep it practical: show the exact frontmatter, exact TOML key, exact command. Match the existing tone — short sentences, concrete examples, tables where they help.

If you're unsure whether a change is "major" enough to document, err toward updating. A stale README is a worse problem than one extra edit.
