# Charts

shadcn's `Chart` (`ChartContainer`, `ChartTooltip`) with Recharts inside.
Shapes Recharts lacks (gauges, range bars, a scale with markers, ladders) are
**small hand-written SVG components** in the same file, using the same tokens.

## Rules

1. **One question per chart, one measure per chart, one y-axis, always.** Two
   measures on two scales = two charts.
2. **One series → no legend**; the card title names it. Two lines only when
   they are the *same quantity read two ways* (then a small legend below).
3. **A table view behind every chart** (`TableView`, collapsed), for
   accessibility and for exact values.
4. **Colour by meaning:** a plain series is `--chart-1` (green; the default in
   every stock chart). Negative columns take ink (`--chart-3`, "the other
   kind"); a comparison line takes `--chart-other`; buy/sell-type markers
   `--chart-3`/`--chart-2`. Blue `--series` is for neutral marks (bars,
   scale markers), not for lines. If green reads as "gain" in your domain,
   change `CONFIG` and the strokes in `charts.tsx` to `--series` in one place.
5. Colour is never the only cue: buy/sell markers are triangles up/down;
   signs in tooltips.
6. Every chart has `role="img"` and an `aria-label`, and sits in `dir="ltr"`
   (time runs left to right in Arabic too).
7. No animation (`isAnimationActive={false}`).

## Mark specs

| Element | Spec |
|---|---|
| Container | `ChartContainer className="aspect-auto h-56 w-full"` (`h-64` for long series) |
| Margins | `{ top: 12, right: 12–16, bottom: 4, left: 4 }` |
| Grid | `<CartesianGrid vertical={false} />` (horizontal only, recessive) |
| Axes | `tickLine={false} axisLine={false} tickMargin={8}`; y-axis `width={56}`, compact ticks (`8.4bn`, `628k`) |
| X ticks on long series | only the two end dates: `ticks={[first, last]} interval="preserveStartEnd"` |
| Line | `type="linear"`, `strokeWidth={2}` |
| Markers (few points) | `r: 4.5`, fill = series, `stroke: var(--card)`, `strokeWidth: 2`; active `r: 6` |
| Area | line + gradient fill from 22% opacity to 0 |
| Columns | `radius={[4,4,0,0]}`, `barCategoryGap={2}`, a `ReferenceLine y={0} stroke="var(--border)"` |
| Tooltip | ChartTooltipContent's box: `grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl`; date in `font-medium`, value in `figure`; `cursor={false}` |
| Legend (when needed) | below the chart, `mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground`, swatch `inline-block h-0.5 w-4 bg-…` |

## Stock components

| Component | When |
|---|---|
| `PointsLine` | A few points over time, every point marked (reads with 2 points) |
| `SeriesArea` | A long daily series: area + line, end dates only, hover crosshair |
| `MonthColumns` | One value per period from a zero baseline; negatives in the second hue |
| `TwoLines` | One quantity read two ways (e.g. value vs. money put in), with a legend |
| `PriceChart` | Daily closes as a line + event markers (triangles) at their value |
| SVG: gauge, range bar, value scale | Scores, ratios, value against a range |

## Sparklines and inline marks

- Sparklines in table rows: no axes, no grid, 1.5 px line, `--chart-1`.
- A range/scale bar: a dotted track (`border-t-2 border-dotted border-line`),
  a vertical marker (`h-6 w-0.5 bg-…`), a label chip above it
  (`rounded bg-… px-1.5 py-0.5 font-mono text-[11.5px] text-white`).
