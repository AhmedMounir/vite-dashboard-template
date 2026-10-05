/** Sample rows for the demo pages. Replace with the app's own queries. */

export type Order = {
  id: string
  customer: string
  status: "Paid" | "Pending" | "Refunded"
  amount: number | null
  date: string
}

export const ORDERS: Order[] = [
  {
    id: "A-1001",
    customer: "Northwind",
    status: "Paid",
    amount: 1240.5,
    date: "2026-09-02",
  },
  {
    id: "A-1002",
    customer: "Contoso",
    status: "Pending",
    amount: 310,
    date: "2026-09-05",
  },
  {
    id: "A-1003",
    customer: "Fabrikam",
    status: "Paid",
    amount: 5210.75,
    date: "2026-09-11",
  },
  {
    id: "A-1004",
    customer: "Tailspin",
    status: "Refunded",
    amount: -420,
    date: "2026-09-14",
  },
  {
    id: "A-1005",
    customer: "Litware",
    status: "Paid",
    amount: 980,
    date: "2026-09-18",
  },
  {
    id: "A-1006",
    customer: "Adventure Works",
    status: "Pending",
    amount: null,
    date: "2026-09-21",
  },
  {
    id: "A-1007",
    customer: "Wingtip",
    status: "Paid",
    amount: 2300,
    date: "2026-09-24",
  },
  {
    id: "A-1008",
    customer: "Proseware",
    status: "Paid",
    amount: 760.2,
    date: "2026-09-27",
  },
  {
    id: "A-1009",
    customer: "Lucerne",
    status: "Pending",
    amount: 1890,
    date: "2026-09-29",
  },
  {
    id: "A-1010",
    customer: "Coho",
    status: "Paid",
    amount: 430,
    date: "2026-10-01",
  },
  {
    id: "A-1011",
    customer: "Woodgrove",
    status: "Paid",
    amount: 3120,
    date: "2026-10-02",
  },
  {
    id: "A-1012",
    customer: "Margie's",
    status: "Refunded",
    amount: -150,
    date: "2026-10-03",
  },
]

/** A daily series: 120 days of a slowly rising value. */
export const DAILY = Array.from({ length: 120 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 5, 7 + i))
  return {
    date: d.toISOString().slice(0, 10),
    value: Math.round(42000 + i * 180 + Math.sin(i / 6) * 2400),
  }
})

export const MONTHLY = [
  { date: "2026-04", value: 3200 },
  { date: "2026-05", value: 4100 },
  { date: "2026-06", value: -900 },
  { date: "2026-07", value: 2600 },
  { date: "2026-08", value: 5300 },
  { date: "2026-09", value: 1800 },
]
