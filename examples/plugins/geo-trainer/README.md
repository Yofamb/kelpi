# Geo Trainer

A build-free GeoGuessr-style flashcard trainer: guess the country from its flag, or from a
one-line "tell" (driving side, road markings, pole/bollard style, plates, terrain) — four
multiple-choice options, drawn preferentially from genuinely confusable neighbors (Kenya /
Tanzania / Uganda, Estonia / Latvia / Lithuania, etc.) rather than random countries. Missed
countries are weighted back into rotation more often, so practice actually targets weak spots
instead of being uniformly random.

```sh
kelpi plugin install ./examples/plugins/geo-trainer --trust
kelpi plugin run example.geo-trainer.open
kelpi plugin run example.geo-trainer.stats
```

Choose `Geo Trainer` in Settings → Plugins → Workbench views to give it a sidebar or bottom
panel slot, or just open it as a pane. The status bar shows your current streak; Settings →
Plugins lets you drill just flags, just tells, or both. Streak/accuracy/miss stats persist
in plugin storage across restarts; the ↻ button (or the command palette's "Reset Geo Trainer
stats") clears them.

`ui/countries.js` holds the dataset — every "tell" is written from scratch for this example,
not copied from Plonkit or the GeoGuessr wiki (the underlying facts are common knowledge among
players; their specific wording is that site's own copyrighted content, so this ships original
phrasing instead). Flags are plain Unicode regional-indicator emoji, computed from each
country's ISO 3166-1 code — no bundled images, so the plugin works entirely offline inside the
view's sandboxed `allow-scripts` iframe with no network access at all.

This example is fully trusted code and runs on the daemon machine. See the
[plugin guide](../../../docs/plugins.md) for the API and execution model.
