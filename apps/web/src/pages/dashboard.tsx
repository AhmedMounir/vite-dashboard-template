/**
 * The dashboard layout (dense): section cards across the top, a chart with
 * its table behind it, then the data table with tabs of views. A demo of the
 * patterns in docs/ui; every figure here is sample data.
 */
import { useMemo } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Delta, TableView } from "@/components/bits"
import { MonthColumns, SeriesArea } from "@/components/charts"
import {
  DataGrid,
  DataTable,
  DetailList,
  RowDrawer,
  SortHeader,
  dataTableColumns,
} from "@/components/data-table"
import { Page, Section } from "@/components/page"
import { formatDate, num, signed } from "@/lib/format"
import { useT } from "@/lib/i18n"
import { DAILY, MONTHLY, ORDERS, type Order } from "@/pages/demo-data"

const GRID =
  "grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"

function Trend({ pct }: { pct: number }) {
  const Icon = pct >= 0 ? IconTrendingUp : IconTrendingDown
  return (
    <Badge
      variant="outline"
      className={cn("figure", pct >= 0 ? "text-up" : "text-down")}
    >
      <Icon />
      {signed(pct, 1)}%
    </Badge>
  )
}

const TILES = [
  { label: "Revenue", value: 18_490.45, pct: 12.4, change: 2_040.1, digits: 2 },
  { label: "Orders", value: 1_284, pct: 3.1, change: 39, digits: 0 },
  { label: "Refunds", value: 570, pct: -8.2, change: -51, digits: 2 },
  { label: "Customers", value: 312, pct: 1.6, change: 5, digits: 0 },
]

export function DashboardPage() {
  const t = useT()
  const asOf = "2026-10-03"

  const columns = useMemo(() => {
    const h = dataTableColumns<Order>()
    return [
      h.accessor("id", {
        header: ({ column }) => (
          <SortHeader column={column} title={t("Order")} />
        ),
        cell: ({ row }) => (
          <RowDrawer
            title={row.original.id}
            description={row.original.customer}
          >
            <DetailList
              rows={[
                [t("Customer"), row.original.customer],
                [t("Status"), t(row.original.status)],
                [t("Amount"), num(row.original.amount, 2)],
                [t("Date"), formatDate(row.original.date)],
              ]}
            />
          </RowDrawer>
        ),
        meta: { label: t("Order") },
      }),
      h.accessor("customer", {
        header: ({ column }) => (
          <SortHeader column={column} title={t("Customer")} />
        ),
        meta: { label: t("Customer") },
      }),
      h.accessor("status", {
        header: t("Status"),
        cell: ({ getValue }) => (
          <Badge variant="outline" className="text-muted-foreground">
            {t(getValue())}
          </Badge>
        ),
        meta: { label: t("Status") },
      }),
      h.accessor("date", {
        header: ({ column }) => (
          <SortHeader column={column} title={t("Date")} />
        ),
        cell: ({ getValue }) => formatDate(getValue()),
        meta: { label: t("Date") },
      }),
      h.accessor("amount", {
        header: ({ column }) => (
          <SortHeader column={column} title={t("Amount")} />
        ),
        cell: ({ getValue }) => {
          const v = getValue()
          return v == null ? (
            <span className="text-muted-foreground">{t("unknown")}</span>
          ) : (
            num(v, 2)
          )
        },
        meta: { align: "end", label: t("Amount") },
      }),
    ]
  }, [t])

  const dayColumns = useMemo(() => {
    const h = dataTableColumns<(typeof DAILY)[number]>()
    return [
      h.accessor("date", {
        header: t("Date"),
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      h.accessor("value", {
        header: t("Value"),
        cell: ({ getValue }) => num(getValue(), 0),
        meta: { align: "end" },
      }),
    ]
  }, [t])

  const monthColumns = useMemo(() => {
    const h = dataTableColumns<(typeof MONTHLY)[number]>()
    return [
      h.accessor("date", { header: t("Month") }),
      h.accessor("value", {
        header: t("Net"),
        cell: ({ getValue }) => <Delta value={getValue()} digits={0} />,
        meta: { align: "end" },
      }),
    ]
  }, [t])

  return (
    <Page title="Home" helpId="page-home">
      <div className={GRID}>
        {TILES.map((tile) => (
          <Card key={tile.label} className="@container/card">
            <CardHeader>
              <CardDescription>{t(tile.label)}</CardDescription>
              <CardTitle className="figure text-2xl font-semibold @[250px]/card:text-3xl">
                {num(tile.value, tile.value % 1 ? 2 : 0)}
              </CardTitle>
              <CardAction>
                <Trend pct={tile.pct} />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-1 font-medium">
                <span className="figure">
                  {signed(tile.change, tile.digits)}
                </span>
                {t("this month")}
              </div>
              <div className="text-muted-foreground">
                {t("As of {date}", { date: formatDate(asOf) })}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:gap-6 @5xl/main:grid-cols-2">
        <Section title="Value over time" helpId="card-value">
          <SeriesArea points={DAILY} unit="USD" label="Value over time" />
          <TableView>
            <DataGrid
              rows={DAILY.slice(-10).reverse()}
              columns={dayColumns}
              getRowId={(r) => r.date}
              drag={false}
              select={false}
              pageSize={false}
            />
          </TableView>
        </Section>
        <Section title="Net by month" helpId="card-monthly">
          <MonthColumns points={MONTHLY} unit="USD" label="Net by month" />
          <TableView>
            <DataGrid
              rows={MONTHLY}
              columns={monthColumns}
              getRowId={(r) => r.date}
              drag={false}
              select={false}
              pageSize={false}
            />
          </TableView>
        </Section>
      </div>

      <DataTable
        views={[
          {
            value: "all",
            label: t("All orders"),
            rows: ORDERS,
            columns,
            getRowId: (r: Order) => r.id,
          },
          {
            value: "pending",
            label: t("Pending"),
            rows: ORDERS.filter((o) => o.status === "Pending"),
            columns,
            getRowId: (r: Order) => r.id,
          },
          {
            value: "refunded",
            label: t("Refunded"),
            rows: ORDERS.filter((o) => o.status === "Refunded"),
            columns,
            getRowId: (r: Order) => r.id,
          },
        ]}
      />
    </Page>
  )
}
