/**
 * The data table from shadcn's dashboard-01, made generic: tabs of views (a
 * select on narrow screens), drag-to-reorder rows, row selection, a column
 * picker, sortable headers, pagination, and a drawer with a row's detail.
 *
 * The order a row is dragged to lasts while the page is open; it is a reading
 * aid, never saved. Columns come from the caller (`dataTableColumns<T>()`).
 */
import * as React from "react"
import { createPortal } from "react-dom"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnVisibilityState,
  type Row,
  type RowData,
  type SortingState,
} from "@tanstack/react-table"

import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { useT } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"

/** Per-column display hints: `end` for figures (right in English, left in Arabic), the name in the column picker, classes for the body cells. */
export type DataColumnMeta = {
  align?: "end"
  label?: string
  className?: string
}

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  columnMeta: {} as DataColumnMeta,
})

type F = typeof dataTableFeatures
// Columns of one table hold different value types, so the value type is open here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataColumn<T extends RowData> = ColumnDef<F, T, any>

export const dataTableColumns = <T extends RowData>() =>
  createColumnHelper<F, T>()

/** A header that sorts its column; the arrow says which way. */
export function SortHeader<T extends RowData, V = unknown>({
  column,
  title,
}: {
  column: Column<F, T, V>
  title: string
}) {
  const dir = column.getIsSorted()
  const Icon =
    dir === "asc"
      ? IconSortAscending
      : dir === "desc"
        ? IconSortDescending
        : IconArrowsSort
  const end = column.columnDef.meta?.align === "end"
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-mx-2 h-8 gap-1 px-2 font-medium",
        end && "ms-auto flex flex-row-reverse"
      )}
      onClick={() => column.toggleSorting(dir === "desc" ? false : true)}
      aria-sort={
        dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"
      }
    >
      {title}
      <Icon className={cn(!dir && "opacity-40")} />
    </Button>
  )
}

function DragHandle({ id }: { id: UniqueIdentifier }) {
  const t = useT()
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">{t("Drag to reorder")}</span>
    </Button>
  )
}

function Cells<T extends RowData>({ row }: { row: Row<F, T> }) {
  return (
    <>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            cell.column.columnDef.meta?.align === "end" && "figure text-end",
            cell.column.columnDef.meta?.className
          )}
        >
          <FlexRender cell={cell} />
        </TableCell>
      ))}
    </>
  )
}

function DraggableRow<T extends RowData>({
  row,
  id,
  className,
}: {
  row: Row<F, T>
  id: UniqueIdentifier
  className?: string
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id })
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80",
        className
      )}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <Cells row={row} />
    </TableRow>
  )
}

/** A row's name that opens its detail in a drawer (from the end side, or the bottom on a phone). */
export function RowDrawer({
  title,
  description,
  children,
  footer,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const t = useT()
  const rtl = document.documentElement.dir === "rtl"
  return (
    <Drawer swipeDirection={isMobile ? "down" : rtl ? "left" : "right"}>
      <DrawerTrigger
        render={
          <Button
            variant="link"
            className="h-auto w-fit px-0 text-start font-medium text-foreground"
          />
        }
      >
        {title}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {children}
        </div>
        <DrawerFooter>
          {footer}
          <DrawerClose render={<Button variant="outline" />}>
            {t("Close")}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

/** Label / value lines for a drawer. */
export function DetailList({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="figure text-end">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

export type DataGridOptions<T extends RowData> = {
  /** Drag handles to reorder rows (a reading aid, never saved). Default on. */
  drag?: boolean
  /** Row checkboxes. Default on. */
  select?: boolean
  /** Rows per page; `false` shows every row. Default 10. */
  pageSize?: number | false
  /** A totals row: content per column id, aligned as the column is. */
  footer?: Partial<Record<string, React.ReactNode>>
  /** Extra classes for a row (a muted or flagged line). */
  rowClassName?: (row: T) => string | undefined
}

function ViewTable<T extends RowData>({
  rows: initial,
  columns,
  getRowId,
  empty,
  toolbar,
  drag = true,
  select = true,
  pageSize = 10,
  footer,
  rowClassName,
}: DataGridOptions<T> & {
  rows: T[]
  columns: DataColumn<T>[]
  getRowId: (row: T) => string
  empty: string
  /** Where the column picker goes: the toolbar above the table. */
  toolbar: HTMLElement | null
}) {
  const t = useT()
  const [data, setData] = React.useState(() => initial)
  // New rows from the caller replace any dragged order (adjusted during render, not in an effect).
  const [shown, setShown] = React.useState(initial)
  if (shown !== initial) {
    setShown(initial)
    setData(initial)
  }
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize === false ? Number.MAX_SAFE_INTEGER : pageSize,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(getRowId),
    [data, getRowId]
  )

  const all: DataColumn<T>[] = React.useMemo(() => {
    const h = dataTableColumns<T>()
    return [
      ...(drag
        ? [
            h.display({
              id: "drag",
              header: () => null,
              cell: ({ row }) => <DragHandle id={row.id} />,
              enableHiding: false,
            }),
          ]
        : []),
      ...(select
        ? [
            h.display({
              id: "select",
              header: ({ table }) => (
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={
                      !table.getIsAllPageRowsSelected() &&
                      table.getIsSomePageRowsSelected()
                    }
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label={t("Select all")}
                  />
                </div>
              ),
              cell: ({ row }) => (
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label={t("Select row")}
                  />
                </div>
              ),
              enableSorting: false,
              enableHiding: false,
            }),
          ]
        : []),
      ...columns,
    ]
    // t changes with the language; the columns are rebuilt with it.
  }, [columns, t, drag, select])

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: all,
    state: { sorting, columnVisibility, rowSelection, pagination },
    getRowId,
    enableRowSelection: select,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (u) => {
      setSorting(u)
      // A sort replaces any dragged order.
      setData(initial)
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setSorting([])
      setData((d) =>
        arrayMove(d, dataIds.indexOf(active.id), dataIds.indexOf(over.id))
      )
    }
  }

  const columnsMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <IconLayoutColumns />
        <span className="hidden lg:inline">{t("Customize columns")}</span>
        <span className="lg:hidden">{t("Columns")}</span>
        <IconChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          {table
            .getAllColumns()
            .filter(
              (c) => typeof c.accessorFn !== "undefined" && c.getCanHide()
            )
            .map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={c.getIsVisible()}
                onCheckedChange={(value) => c.toggleVisibility(!!value)}
              >
                {c.columnDef.meta?.label ?? c.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  return (
    <>
      {toolbar &&
        table
          .getAllColumns()
          .some((c) => typeof c.accessorFn !== "undefined" && c.getCanHide()) &&
        createPortal(columnsMenu, toolbar)}
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.align === "end" &&
                          "text-end"
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              className={cn(drag && "**:data-[slot=table-cell]:first:w-8")}
            >
              {table.getRowModel().rows.length ? (
                drag ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        id={row.id}
                        className={rowClassName?.(row.original)}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={rowClassName?.(row.original)}
                    >
                      <Cells row={row} />
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={all.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {empty}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {footer && table.getRowModel().rows.length > 0 && (
              <TableFooter>
                <TableRow>
                  {table.getVisibleLeafColumns().map((c) => (
                    <TableCell
                      key={c.id}
                      className={cn(
                        c.columnDef.meta?.align === "end" && "figure text-end"
                      )}
                    >
                      {footer[c.id]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </DndContext>
      </div>
      {(table.getPageCount() > 1 || Object.keys(rowSelection).length > 0) && (
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {t("{n} of {m} row(s) selected.", {
              n: table.getFilteredSelectedRowModel().rows.length,
              m: table.getFilteredRowModel().rows.length,
            })}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label
                htmlFor={`${sortableId}-rows`}
                className="text-sm font-medium"
              >
                {t("Rows per page")}
              </Label>
              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) =>
                  value && table.setPageSize(Number(value))
                }
              >
                <SelectTrigger
                  size="sm"
                  className="w-20"
                  id={`${sortableId}-rows`}
                >
                  <SelectValue placeholder={table.state.pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              {t("Page {n} of {m}", {
                n: table.state.pagination.pageIndex + 1,
                m: Math.max(table.getPageCount(), 1),
              })}
            </div>
            <div className="ms-auto flex items-center gap-2 lg:ms-0">
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("Go to first page")}</span>
                <IconChevronsLeft className="rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("Go to previous page")}</span>
                <IconChevronLeft className="rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("Go to next page")}</span>
                <IconChevronRight className="rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("Go to last page")}</span>
                <IconChevronsRight className="rtl:rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export type DataTableView<T extends RowData> = DataGridOptions<T> & {
  value: string
  label: string
  rows: T[]
  columns: DataColumn<T>[]
  getRowId: (row: T) => string
  /** Shown when the view has no rows. */
  empty?: string
}

/** Several views of rows, one tab each. Views may hold different row types. */
export function DataTable({
  views,
  actions,
}: {
  // Each view may hold its own row type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  views: DataTableView<any>[]
  actions?: React.ReactNode
}) {
  const t = useT()
  const [tab, setTab] = React.useState(views[0]?.value ?? "")
  const [toolbar, setToolbar] = React.useState<HTMLDivElement | null>(null)

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(String(v))}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="view-selector" className="sr-only">
          {t("View")}
        </Label>
        <Select
          value={tab}
          items={views.map((v) => ({ value: v.value, label: v.label }))}
          onValueChange={(v) => v && setTab(v)}
        >
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder={t("Select a view")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {views.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          {views.map((v) => (
            <TabsTrigger key={v.value} value={v.value}>
              {v.label}{" "}
              {v.rows.length > 0 && (
                <Badge variant="secondary">{v.rows.length}</Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center gap-2">
          <div ref={setToolbar} className="contents" />
          {actions}
        </div>
      </div>
      {views.map((v) => (
        <TabsContent
          key={v.value}
          value={v.value}
          className="relative flex flex-col gap-4 overflow-auto"
        >
          {tab === v.value && (
            <ViewTable
              {...v}
              empty={v.empty ?? t("No rows.")}
              toolbar={toolbar}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

/**
 * One table, no tabs: the same data table (sortable headers, column picker,
 * drag, selection, pagination) for a table inside a card. `actions` sit
 * beside the column picker; `caption` on the start side of that row.
 */
export function DataGrid<T extends RowData>({
  rows,
  columns,
  getRowId,
  empty,
  actions,
  caption,
  ...options
}: DataGridOptions<T> & {
  rows: T[]
  columns: DataColumn<T>[]
  /** A row's id; the index when the rows have no natural key. */
  getRowId: (row: T, index: number) => string
  empty?: string
  actions?: React.ReactNode
  caption?: React.ReactNode
}) {
  const t = useT()
  const [toolbar, setToolbar] = React.useState<HTMLDivElement | null>(null)
  const ids = React.useMemo(
    () => new Map(rows.map((r, i) => [r, getRowId(r, i)])),
    [rows, getRowId]
  )
  const rowId = React.useCallback((r: T) => ids.get(r) ?? "", [ids])
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div
        className={cn(
          "items-center justify-between gap-2",
          caption ? "flex" : "hidden has-[button,a]:flex"
        )}
      >
        {caption ? (
          <div className="min-w-0 text-sm text-muted-foreground">{caption}</div>
        ) : null}
        <div className="ms-auto flex items-center gap-2">
          <div ref={setToolbar} className="contents" />
          {actions}
        </div>
      </div>
      <ViewTable
        rows={rows}
        columns={columns}
        getRowId={rowId}
        empty={empty ?? t("No rows.")}
        toolbar={toolbar}
        {...options}
      />
    </div>
  )
}
