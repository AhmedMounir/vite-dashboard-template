/**
 * The time-series charts, on shadcn's Chart (Recharts inside ChartContainer,
 * tooltips in ChartTooltip with the ChartTooltipContent look).
 *
 * One series each, so no legend: the heading names it (dataviz). One y-axis,
 * always. 2px line, 4.5px markers with a 2px surface ring, recessive grid, and
 * a crosshair tooltip on hover. Every chart has a table view beside it.
 */
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@workspace/ui/components/chart"

import { compact, num, signed as signedNum } from "@/lib/format"
import { useT } from "@/lib/i18n"

type Point = { date: string; value: number; note?: string }

/** Axis ticks as in the dashboard's chart: no tick lines, no axis line, a little air. */
const axis = { tickLine: false, axisLine: false, tickMargin: 8 } as const
/** The series colours live in the charts; the config only names the one value. */
const CONFIG = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig
/** ChartTooltipContent's box. */
const TIP =
  "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"

function Tip({
  active,
  payload,
  unit,
  signed,
}: {
  active?: boolean
  payload?: { payload: Point }[]
  unit: string
  signed?: boolean
}) {
  const p = active ? payload?.[0]?.payload : undefined
  if (!p) return null
  return (
    <div className={TIP}>
      <div className="font-medium">{p.date}</div>
      <div className="figure">
        {signed ? signedNum(p.value, 0) : num(p.value, 2)} {unit}
      </div>
      {p.note && <div className="text-muted-foreground">{p.note}</div>}
    </div>
  )
}

/** A few points over time: every point marked, so a two-point series still reads. */
export function PointsLine({
  points,
  unit,
  label,
}: {
  points: Point[]
  unit: string
  label: string
}) {
  const t = useT()
  return (
    <ChartContainer
      config={CONFIG}
      role="img"
      aria-label={t(label)}
      dir="ltr"
      className="aspect-auto h-56 w-full"
    >
      <LineChart
        data={points}
        margin={{ top: 12, right: 16, bottom: 4, left: 4 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          {...axis}
          tickFormatter={(d: string) => d.slice(5)}
        />
        <YAxis
          {...axis}
          width={56}
          domain={[(lo: number) => lo * 0.995, (hi: number) => hi * 1.005]}
          tickFormatter={(v: number) => compact(v, 2)}
        />
        <ChartTooltip content={<Tip unit={unit} />} cursor={false} />
        <Line
          type="linear"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{
            r: 4.5,
            fill: "var(--chart-1)",
            stroke: "var(--card)",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "var(--chart-1)",
            stroke: "var(--card)",
            strokeWidth: 2,
          }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

/**
 * One value per month as columns from a zero baseline. A negative month is a
 * different thing, not less of the same, so it takes the second hue; the sign
 * is in the tooltip too, never colour alone.
 */
export function MonthColumns({
  points,
  unit,
  label,
}: {
  points: Point[]
  unit: string
  label: string
}) {
  const ends = points.length ? [points[0]!.date, points.at(-1)!.date] : []
  const t = useT()
  return (
    <ChartContainer
      config={CONFIG}
      role="img"
      aria-label={t(label)}
      dir="ltr"
      className="aspect-auto h-56 w-full"
    >
      <BarChart
        data={points}
        margin={{ top: 12, right: 12, bottom: 4, left: 4 }}
        barCategoryGap={2}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          {...axis}
          ticks={ends}
          interval="preserveStartEnd"
        />
        <YAxis {...axis} width={56} tickFormatter={(v: number) => compact(v)} />
        <ReferenceLine y={0} stroke="var(--border)" />
        <ChartTooltip content={<Tip unit={unit} signed />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {points.map((p) => (
            <Cell
              key={p.date}
              fill={p.value >= 0 ? "var(--chart-1)" : "var(--chart-3)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/**
 * The same quantity read two ways, on one axis: two lines and a legend. Not
 * two measures on two scales; that would be two charts.
 */
export function TwoLines({
  rows,
  a,
  b,
  unit,
  label,
}: {
  rows: { date: string; a: number; b: number }[]
  a: string
  b: string
  unit: string
  label: string
}) {
  const t = useT()
  return (
    <div>
      <ChartContainer
        config={CONFIG}
        role="img"
        aria-label={t(label)}
        dir="ltr"
        className="aspect-auto h-56 w-full"
      >
        <LineChart
          data={rows}
          margin={{ top: 12, right: 16, bottom: 4, left: 4 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" {...axis} />
          <YAxis
            {...axis}
            width={56}
            domain={[0, "auto"]}
            tickFormatter={(v: number) => compact(v)}
          />
          <ChartTooltip
            content={<PairTip a={a} b={b} unit={unit} />}
            cursor={false}
          />
          <Line
            type="linear"
            dataKey="b"
            stroke="var(--chart-other)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="a"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-0.5 w-4 bg-chart-1" />
          {t(a)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-0.5 w-4 bg-chart-other" />
          {t(b)}
        </span>
      </div>
    </div>
  )
}

function PairTip({
  active,
  payload,
  a,
  b,
  unit,
}: {
  active?: boolean
  payload?: { payload: { date: string; a: number; b: number } }[]
  a: string
  b: string
  unit: string
}) {
  const t = useT()
  const p = active ? payload?.[0]?.payload : undefined
  if (!p) return null
  return (
    <div dir="auto" className={TIP}>
      <div className="font-medium">{p.date}</div>
      <div>
        <span>{t(a)}</span>:{" "}
        <span className="figure">
          {num(p.a, 0)} {unit}
        </span>
      </div>
      <div className="text-muted-foreground">
        <span>{t(b)}</span>:{" "}
        <span className="figure">
          {num(p.b, 0)} {unit}
        </span>
      </div>
    </div>
  )
}

/** A long daily series: area plus line, end dates only on the axis, crosshair on hover. */
export function SeriesArea({
  points,
  unit,
  label,
}: {
  points: Point[]
  unit: string
  label: string
}) {
  const ends = points.length ? [points[0]!.date, points.at(-1)!.date] : []
  const t = useT()
  return (
    <ChartContainer
      config={CONFIG}
      role="img"
      aria-label={t(label)}
      dir="ltr"
      className="aspect-auto h-64 w-full"
    >
      <AreaChart
        data={points}
        margin={{ top: 12, right: 12, bottom: 4, left: 4 }}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          {...axis}
          ticks={ends}
          interval="preserveStartEnd"
        />
        <YAxis
          {...axis}
          width={56}
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => compact(v)}
        />
        <ChartTooltip content={<Tip unit={unit} />} cursor={false} />
        <Area
          type="linear"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#area-fill)"
          activeDot={{
            r: 4.5,
            fill: "var(--chart-1)",
            stroke: "var(--card)",
            strokeWidth: 2,
          }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
