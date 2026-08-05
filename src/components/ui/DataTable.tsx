import type { ReactNode } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export interface ColumnDef<T> {
  key: string;
  label: ReactNode;
  render?: (item: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  pagination?: ReactNode;
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyState,
  pagination,
  keyExtractor,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={`font-semibold text-slate-600 ${col.headerClassName || ""}`}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 && emptyState ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 p-0">
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)} 
                  className={onRowClick ? "cursor-pointer hover:bg-slate-50/50" : ""}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.cellClassName}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Render Pagination at the bottom if provided and we have data */}
      {pagination && data.length > 0 && (
        <div className="mt-auto">
          {pagination}
        </div>
      )}
    </div>
  );
}