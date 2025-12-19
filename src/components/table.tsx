import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react';

export interface Column<T = unknown> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    onSort?: () => void;
}

interface TableComponentProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (id: string) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    startIndex?: number;
    totalItems?: number;
    itemsPerPage?: number;
    sortOrder?: 'asc' | 'desc';
    sortBy?: string;
    loading?: boolean;
}

const TableComponent = <T extends { id: string | number }>({
    data = [],
    columns,
    onEdit,
    onDelete,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    startIndex = 0,
    totalItems = 0,
    itemsPerPage = 5,
    sortOrder,
    sortBy,
    loading = false
}: TableComponentProps<T>) => {
    return (
        <React.Fragment>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className='bg-gray-200 '>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableHead className='text-center text-black font-bold' key={String(col.key)}>
                                            {col.sortable && col.onSort ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={col.onSort}
                                                    className={`data-[state=open]:bg-accent hover:bg-transparent text-black font-bold}`}
                                                >
                                                    {col.label}
                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortBy === col.key && sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                                                </Button>
                                            ) : (
                                                col.label
                                            )}
                                        </TableHead>
                                    ))}
                                    {(onEdit || onDelete) && <TableHead className="text-center text-black font-bold">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : data.length > 0 ? (
                                    data.map((item, index) => (
                                        <TableRow key={item.id || index}>
                                            {columns.map((col, colIndex) => (
                                                <TableCell className="text-center" key={colIndex}>
                                                    {String(item[col.key])}
                                                </TableCell>
                                            ))}
                                            {(onEdit || onDelete) && (
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {onEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => onEdit(item)}
                                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {onDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => onDelete(String(item.id))}
                                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No entries found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {onPageChange && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 py-4 px-4 sm:px-0">
                    <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                        Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="text-xs sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default TableComponent;
