/** Small demo pages: a figure grid, an empty state, a plain table. Sample data only. */
import { useMemo } from "react"

import { Figure } from "@/components/figure"
import { DataGrid, SortHeader, dataTableColumns } from "@/components/data-table"
import { Page, Section } from "@/components/page"
import { Empty } from "@/components/states"
import { Button } from "@workspace/ui/components/button"
import { formatMoney } from "@/lib/format"
import { useT } from "@/lib/i18n"

type Member = { id: string; name: string; role: string; joined: string }

const MEMBERS: Member[] = [
  { id: "1", name: "Sam Lee", role: "Owner", joined: "2025-01-12" },
  { id: "2", name: "Noor Hassan", role: "Editor", joined: "2025-06-03" },
  { id: "3", name: "Alex Kim", role: "Viewer", joined: "2026-02-20" },
]

export function MembersPage() {
  const t = useT()
  const columns = useMemo(() => {
    const h = dataTableColumns<Member>()
    return [
      h.accessor("name", {
        header: ({ column }) => (
          <SortHeader column={column} title={t("Name")} />
        ),
        meta: { label: t("Name") },
      }),
      h.accessor("role", { header: t("Role"), meta: { label: t("Role") } }),
      h.accessor("joined", {
        header: t("Joined"),
        meta: { align: "end", label: t("Joined") },
      }),
    ]
  }, [t])
  return (
    <Page title="Members" actions={<Button size="sm">{t("Invite")}</Button>}>
      <Section title="Members">
        <DataGrid rows={MEMBERS} columns={columns} getRowId={(r) => r.id} />
      </Section>
    </Page>
  )
}

export function ActivityPage() {
  return (
    <Page title="Activity">
      <Empty title="Nothing yet" />
    </Page>
  )
}

export function LibraryPage() {
  return (
    <Page title="Library" helpId="page-library">
      <Section title="Balances">
        <div className="grid gap-6 sm:grid-cols-3">
          <Figure
            label="Cash"
            value={formatMoney(12500, "USD", 2)}
            asOf="2026-10-03"
            source="ours"
          />
          <Figure
            label="Savings"
            value={formatMoney(48210.4, "USD", 2)}
            asOf="2026-08-01"
            staleAfterDays={30}
            source="entered"
          />
          <Figure
            label="Pending"
            value="unknown"
            asOf={null}
            source="provider"
            provider="Bank"
          />
        </div>
      </Section>
    </Page>
  )
}

export function DataSettingsPage() {
  return (
    <Page title="Data settings">
      <Empty title="Comes later" />
    </Page>
  )
}
