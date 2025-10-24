import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filterable?: boolean;
  width?: string | number;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowSelection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
  };
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
  };
  actions?: {
    view?: (record: T) => void;
    edit?: (record: T) => void;
    delete?: (record: T) => void;
    custom?: Array<{
      label: string;
      onClick: (record: T) => void;
      icon?: React.ReactNode;
    }>;
  };
  bulkActions?: Array<{
    label: string;
    onClick: (selectedRecords: T[]) => void;
    icon?: React.ReactNode;
  }>;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  pagination,
  rowSelection,
  onRow,
  actions,
  bulkActions,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const selectedRecords = React.useMemo(() => {
    if (!rowSelection?.selectedRowKeys) return [];
    return data.filter(record => 
      rowSelection.selectedRowKeys.includes(String(record.id))
    );
  }, [data, rowSelection?.selectedRowKeys]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Bulk Actions */}
      {bulkActions && selectedRecords.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRecords.length} selected
          </span>
          {bulkActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => action.onClick(selectedRecords)}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              {rowSelection && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={rowSelection.selectedRowKeys.length === data.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        rowSelection.onChange(data.map(record => String(record.id)));
                      } else {
                        rowSelection.onChange([]);
                      }
                    }}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.width ? `w-[${column.width}]` : ''}>
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sorter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(column.key)}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-12">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (rowSelection ? 1 : 0) + (actions ? 1 : 0)}>
                  <div className="text-center py-8 text-muted-foreground">
                    No data available
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record, index) => (
                <TableRow key={record.id}>
                  {rowSelection && (
                    <TableCell>
                      <Checkbox
                        checked={rowSelection.selectedRowKeys.includes(String(record.id))}
                        onCheckedChange={(checked) => {
                          const newKeys = checked
                            ? [...rowSelection.selectedRowKeys, String(record.id)]
                            : rowSelection.selectedRowKeys.filter(key => key !== String(record.id));
                          rowSelection.onChange(newKeys);
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(
                            column.dataIndex ? record[column.dataIndex] : record,
                            record,
                            index
                          )
                        : column.dataIndex
                        ? record[column.dataIndex]
                        : record[column.key]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.view && (
                            <DropdownMenuItem onClick={() => actions.view?.(record)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          )}
                          {actions.edit && (
                            <DropdownMenuItem onClick={() => actions.edit?.(record)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {actions.custom?.map((action, index) => (
                            <DropdownMenuItem key={index} onClick={() => action.onClick(record)}>
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                          {actions.delete && (
                            <DropdownMenuItem 
                              onClick={() => actions.delete?.(record)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.current - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
