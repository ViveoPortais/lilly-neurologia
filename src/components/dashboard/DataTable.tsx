"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { CgSpinner } from "react-icons/cg";

import { useLateralMenu } from "@/hooks/useMenus";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { HiCheck, HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronDown, HiChevronLeft, HiChevronRight} from "react-icons/hi";
import * as Select from "@radix-ui/react-select";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageSizeOptions?: number[];
  bgColor?: string;
  textColor?: string;
  hasHeaderNumberOfRows?: boolean;
  contentHeaderNumberOfRows?:string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  bgColor,
  textColor,
  hasHeaderNumberOfRows,
  contentHeaderNumberOfRows
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  const { isMenuOpen } = useLateralMenu();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const pageSizeOptions =  [5, 10, 20, 50];

  return (
    <div className={`w-[90vw] ${isMenuOpen ? "lg:w-[70vw]" : "lg:w-[calc(95vw-100px)]"} mx-auto`}>
      <div className="border-separate border-spacing-0">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 z-20 flex items-center justify-center">
            <CgSpinner size={36} className={`${textColor} animate-spin`} />
          </div>
        )}
        <Table className="table-auto w-full border-separate border-spacing-0">
          <TableHeader className="bg-gray-200 text-black">
            {hasHeaderNumberOfRows && (
              <TableRow className="">
                <TableHead
                  className="text-start text-xl min-w-[150px]  max-w-[200px] truncate bg-gray-100 text-black font-bold rounded-t-lg"
                  colSpan={table.getAllColumns().length}
                >
                  {contentHeaderNumberOfRows} : {table.getPrePaginationRowModel().rows.length}
                </TableHead>
            </TableRow>
            )}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const hideOnMobile = header.column.columnDef.meta?.hideOnMobile;
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-start text-base min-w-[150px] max-w-[200px] truncate bg-gray-200 text-black ${
                        hideOnMobile ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&>*:nth-child(even)]:bg-gray-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group">
                {row.getVisibleCells().map((cell) => {
                  const hideOnMobile = cell.column.columnDef.meta?.hideOnMobile;
                  return (
                    <TableCell
                      key={cell.id}
                      className={`text-start min-w-[150px] max-w-[200px] truncate bg-white whitespace-nowrap border-b border-gray-400 ${
                        hideOnMobile ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24  text-center text-[#919191]">
                  Sem dados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isMobile &&(
        <div className="flex w-full items-center justify-between gap-4 overflow-auto md:px-2 py-1 flex-row sm:gap-8 mt-2">
      <div className="flex items-center gap-4">
        Linhas por página
        <Select.Root
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <Select.Trigger
            className="inline-flex items-center justify-between w-[80px] px-3 py-1.5 border border-[rgb(213,43,30)] text-[rgb(213,43,30)] rounded-md text-sm focus:outline-none"
          >
            <Select.Value />
            <Select.Icon>
              <HiChevronDown className="w-4 h-4 text-[rgb(213,43,30)]" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="bg-white border border-gray-200 rounded-md shadow">
              <Select.Viewport className="p-1">
                {pageSizeOptions.map((size) => (
                  <Select.Item
                    key={size}
                    value={String(size)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <Select.ItemText>{size}</Select.ItemText>
                    <Select.ItemIndicator>
                      <HiCheck className="w-4 h-4 text-[rgb(213,43,30)]" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Ir para a primeira página"
              variant="semighost"
              className="hidden size-8 p-0 lg:flex text-[rgb(213,43,30)] font-bold"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <HiChevronDoubleLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Ir para a página anterior"
              variant="semighost"
              className="size-8 p-0 text-[rgb(213,43,30)] font-bold"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <HiChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Ir para a próxima página"
              variant="semighost"
              className="size-8 p-0 text-[rgb(213,43,30)] font-bold"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <HiChevronRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Ir para a última página"
              variant="semighost"
              className="hidden size-8 p-0 lg:flex text-[rgb(213,43,30)] font-bold"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <HiChevronDoubleRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
