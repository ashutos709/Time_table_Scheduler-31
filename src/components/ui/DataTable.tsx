
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

function DataTable<T>({
  data,
  columns,
  emptyState,
  onRowClick
}: DataTableProps<T>) {
  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row);
    }
    
    if (typeof column.accessorKey === 'function') {
      return column.accessorKey(row);
    }
    
    return row[column.accessorKey as keyof T] as React.ReactNode;
  };
  
  return (
    <div className="rounded-md border glass-effect animate-fade-in overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index}
                className="font-medium text-foreground"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center"
              >
                {emptyState || "No data to display."}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                className={cn(
                  "table-cell-shine",
                  onRowClick && "cursor-pointer hover:bg-secondary/30"
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
