# Content rules

How data and words appear. These matter as much as the colours: they're why
the pages feel calm and trustworthy.

## Data

1. **Every figure carries its date.** "as of 3 Oct 2026" under or beside it.
   A figure past its freshness window is greyed and says "stale".
2. **Unknown stays unknown, never 0.** Formatters return `"unknown"` (or `—`
   in tight cells) for `null`/`NaN`. A blank is better than a wrong zero.
3. **Say where a figure comes from** when there's more than one possible
   source (a small outline badge: "our ledger", "entered by you",
   "<provider> says"). Sources and working sit behind ⓘ or in a last
   "Working & sources" tab, **never inline** on reading pages.
4. **A card is a link** to the page that explains its figure, and shows the
   same figure that page shows (computed once, in one place).
5. **The UI formats; it never computes.** Sums, filters and thresholds come
   from the API's view for that page. The page orders and formats.
6. Formats: thousands separators, en-GB dates (`3 Oct 2026`, times in a fixed
   time zone), a real minus sign (`−`, U+2212) and an explicit `+` on
   changes, compact numbers on axes (`8.4bn`, `628k`), currency as code
   (`EGP 1,234`) or symbol for USD (`$403.62`).

## Words

1. **No explainer text in the UI.** No hint lines under controls, no notes
   about why something looks the way it does, no messages to the user about
   the app's design. Labels and values only. Explanations go in the help ⓘ
   (generic) or in docs. Screen-reader-only text (`sr-only`) is fine.
2. **One number and one sentence per card** on reading pages. If a card needs
   a paragraph, it's two cards or a chart.
3. **Generic help text**: describes the widget for any user, never one
   user's data or story.
4. **Product code holds no user data.** Names, figures and decisions live in
   data, not in components, copy or tests. (A test that greps the source for
   known private strings is a cheap guard.)
5. Sentence case for titles and buttons ("Start coverage", not "Start
   Coverage"). Short verbs on buttons.
6. Placeholders for unbuilt features say what will come, briefly, in a dashed
   card; pages not built are not in the menu.
