# Warm

A theme plugin for Kelpi: soft warm neutrals, a clay accent and panes on rounded cards, with no
backend and no views. It is two stylesheets, which Kelpi loads for as long as the plugin is
enabled:

- `ui/theme.css` styles the window. Its palette overrides Kelpi's `--kelpi-*` chrome tokens and
  `--kelpi-term-*` terminal tokens, light and dark, and its shape rules put panes on rounded
  cards with gutters, quiet the rules between the title bar, sidebar and status bar, and give
  the phone rounded sheets.
- `ui/documents.css` (`"target": "documents"`) styles markdown and diff panes: prose in a book
  serif, warm neutrals, and the clay accent for links, quotes and ticked tasks.

The terminal colours apply to terminals whose colours you have not chosen. A `theme` or
`background` line in your ghostty config still wins.

Install it from the checkout root, or from Settings → Plugins:

```sh
kelpi plugin validate ./examples/plugins/warm-theme
kelpi plugin install ./examples/plugins/warm-theme --trust
```

`kelpi plugin disable example.warm-theme` puts Kelpi's own look back. To share a theme of your
own, copy this directory, change the `id`, and pack it:

```sh
kelpi plugin pack ./examples/plugins/warm-theme --out ./warm.kelpi-plugin
```

The look was drawn with 10 px of space around each terminal's text. Terminal padding is a
ghostty setting rather than a style, so set it in Settings → Appearance → Terminal, or in your
ghostty config:

```
window-padding-x = 10
window-padding-y = 10
```
