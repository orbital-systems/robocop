import React from "react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { IndeterminateCheckbox } from "../InterminateCheckbox";
import {
  Button,
  Input,
  Select,
  Table as SemanticTable,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
} from "semantic-ui-react";

interface DataTableProps {
  data: unknown[];
  columns: ColumnDef<unknown, unknown>[];
  rowSelection?: any;
  setRowSelection?(d: any): void;
}

export const DataTable = ({
  data,
  columns,
  rowSelection,
  setRowSelection,
}: DataTableProps) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <SemanticTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHeaderCell key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div style={{ marginLeft: 8 }}>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHeaderCell>
                );
              })}
            </tr>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </tr>
            );
          })}
        </TableBody>
        {rowSelection && (
          <tfoot>
            <tr>
              <td className="p-1">
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected(),
                    onChange: table.getToggleAllPageRowsSelectedHandler(),
                  }}
                />
              </td>
              <td colSpan={20}>
                Page Rows ({table.getRowModel().rows.length})
              </td>
            </tr>
          </tfoot>
        )}
      </SemanticTable>

      <div className="flex items-center gap-2">
        {rowSelection && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {Object.keys(rowSelection).length} of{" "}
            {table.getPreFilteredRowModel().rows.length} items selected
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: 16,
            justifyContent: "center",
          }}
        >
          {`Page ${
            table.getState().pagination.pageIndex + 1
          } of ${table.getPageCount()}`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",

            marginBottom: 8,
          }}
        >
          {`Go to page`}
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </div>
        {table.getPageCount() > 10 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {`Show pages`}
            <Select
              options={[
                { key: "10", value: 10, text: "10" },
                { key: "20", value: 20, text: "20" },
                { key: "30", value: 30, text: "30" },
                { key: "40", value: 40, text: "40" },
                { key: "50", value: 50, text: "50" },
              ]}
              onChange={(e, { value }) => {
                table.setPageSize(Number(value));
              }}
              value={table.getState().pagination.pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <Input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <Input
      type="text"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}
