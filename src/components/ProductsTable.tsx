"use client";

import { Product, products } from "@/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { cn, formatDate, formatPrice } from "@/lib/utils";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Table as ShadcnTable,
  type ColumnDef,
  type ColumnSort,
  type PaginationState,
} from "unstyled-table";
// import { DebounceInput } from "@/components/debounce-input"
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import DebounceInput from "./DebounceInput";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import { toast } from "./ui/useToast";
import {
  deleteProductsAction,
  deleteProductAction,
} from "@/app/_actions/product";

interface ProductsTableProps {
  data: Product[];
  pageCount?: number;
  storeId: number;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  data,
  pageCount,
  storeId,
}: ProductsTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = React.useTransition();

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        // Column for row selection
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        ),
        // Disable column sorting for this column
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ cell }) => {
          const categories = Object.values(products.category.enumValues);
          const category = cell.getValue() as Product["category"];

          if (!category || !categories.includes(category)) return null;

          return (
            <Badge variant="outline" className="capitalize">
              {category}
            </Badge>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },
      {
        accessorKey: "inventory",
        header: "Inventory",
      },
      {
        accessorKey: "rating",
        header: "Rating",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
      },
      {
        // Column for row actions
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-transparent text-foreground hover:bg-transparent hover:text-foreground">
                  <Icons.verticalThreeDots
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/stores/${storeId}/products/${product.id}`}
                  >
                    <Icons.edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />{" "}
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/stores/${storeId}/products/${product.id}`}
                  >
                    <Icons.view className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />{" "}
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await deleteProductAction({ storeId, id: product.id });
                        toast({title: "Success", description: "Product deleted"});
                      } catch (e) {
                        e instanceof Error
                          ? toast({
                              title: "Error",
                              description: e.message,
                              variant: "destructive",
                            })
                          : toast({
                              title: "Error",
                              description:
                                "Something went wrong, please try again.",
                              variant: "destructive",
                            });
                      }
                    });
                  }}
                >
                  <Icons.trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [storeId]
  );

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "10";
  const sort = searchParams?.get("sort");
  const [column, order] = sort?.split(".") ?? [];
  const name = searchParams.get("name");
  const date_range = searchParams.get("date_range");

  // Handle server-side column sorting
  const [sorting, setSorting] = React.useState<ColumnSort[]>([
    {
      id: column ?? "createdAt",
      desc: order === "desc" ? true : false,
    },
  ]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: Number(page) - 1,
    pageSize: Number(per_page),
  });

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle server-side column (name) filtering
  const [nameFilter, setNameFilter] = React.useState(name ?? "");

  // Handle server-side column (date) filtering
  const [dateFilter, setDateFilter] = React.useState<DateRange | undefined>(
    date_range
      ? {
          from: dayjs(date_range.split("to")[0]).toDate(),
          to: dayjs(date_range.split("to")[1]).toDate(),
        }
      : undefined
  );

  const [isDateChanged, setIsDateChanged] = React.useState(false);

  return (
    <div className="w-full overflow-hidden">
      <div className="grid gap-2 px-1 pb-1">
        <Popover
          onOpenChange={(isOpen) => {
            if (!isOpen && isDateChanged) {
              startTransition(() => {
                router.push(
                  `${pathname}?${createQueryString({
                    page: 1,
                    date_range: dateFilter
                      ? `${dayjs(dateFilter.from).format(
                          "YYYY-MM-DD"
                        )}to${dayjs(dateFilter.to).format("YYYY-MM-DD")}`
                      : null,
                  })}`
                );
              });
            }
            setIsDateChanged(false);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "h-8 justify-start text-left font-normal lg:w-[280px]",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter?.from ? (
                dateFilter.to ? (
                  <>
                    {formatDate(dateFilter.from)} - {formatDate(dateFilter.to)}
                  </>
                ) : (
                  formatDate(dateFilter.from)
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateFilter?.from}
              selected={dateFilter}
              onSelect={(date) => {
                setDateFilter(date);
                setIsDateChanged(true);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <ShadcnTable
        columns={columns}
        data={data ?? []}
        // Rows per page
        pageCount={pageCount ?? 0}
        state={{ sorting, pagination }}
        manualPagination
        manualSorting
        setSorting={setSorting}
        setPagination={setPagination}
        renders={{
          table: ({ children, tableInstance }) => {
            return (
              <div className="w-full space-y-4 p-1">
                <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden">
                  <DebounceInput
                    className="h-8 w-[150px] lg:w-[280px]"
                    placeholder="Filter names..."
                    value={nameFilter}
                    onChange={(value) => {
                      setNameFilter(String(value));
                      startTransition(() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: 1,
                            name: String(value),
                          })}`
                        );
                      });
                    }}
                  />
                  <div className="ml-auto flex items-center space-x-2">
                    {tableInstance.getFilteredSelectedRowModel().rows.length ===
                    0 ? (
                      <Button
                        aria-label="Add new product"
                        size="sm"
                        className="flex h-8 items-center"
                        onClick={() => router.push(`${pathname}/new`)}
                      >
                        <Icons.addCircle className="h-4 w-4" />
                        <span className="hidden lg:inline-block">
                          Add product
                        </span>
                        <span className="inline-block lg:hidden">New</span>
                      </Button>
                    ) : (
                      <Button
                        aria-label="Delete selected rows"
                        variant={"destructive"}
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          startTransition(async () => {
                            // Delete the selected rows
                            try {
                              await deleteProductsAction({
                                storeId,
                                ids: tableInstance
                                  .getSelectedRowModel()
                                  .rows.map((row) => row.original.id),
                              });
                            } catch (e) {
                              e instanceof Error
                                ? toast({
                                    title: "Error",
                                    description: e.message,
                                    variant: "destructive",
                                  })
                                : toast({
                                    title: "Error",
                                    description:
                                      "Something went wrong, please try again.",
                                    variant: "destructive",
                                  });
                            }
                          });
                        }}
                        disabled={
                          !tableInstance.getSelectedRowModel().rows.length ||
                          isPending
                        }
                      >
                        <Icons.trash className="mr-2 h-4 w-4" aria-hidden />
                        Delete (
                        {tableInstance.getSelectedRowModel().rows.length})
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Control view"
                          variant="outline"
                          className="ml-auto h-8"
                        >
                          <Icons.horizontalSliders className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {tableInstance
                          .getAllColumns()
                          .filter(
                            (column) =>
                              typeof column.accessorFn !== "undefined" &&
                              column.getCanHide()
                          )
                          .map((column) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => {
                                  column.toggleVisibility(!!value);
                                }}
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            );
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>{children}</Table>
                </div>
              </div>
            );
          },
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          headerCell: ({ children }) => (
            <TableHead className="whitespace-nowrap">{children}</TableHead>
          ),
          body: ({ children }) => (
            <TableBody>
              {data.length
                ? children
                : !isPending && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          ),
          bodyRow: ({ children }) => <TableRow>{children}</TableRow>,
          bodyCell: ({ children }) => (
            <TableCell>
              {isPending ? <Skeleton className="h-6 w-20" /> : children}
            </TableCell>
          ),
          filterInput: ({}) => null,
          paginationBar: ({ tableInstance }) => {
            return (
              <div className="flex flex-col-reverse items-center gap-4 py-2 md:flex-row">
                <div className="flex-1 text-sm font-medium">
                  {tableInstance.getFilteredSelectedRowModel().rows.length} of{" "}
                  {per_page} row(s) selected.
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select
                      value={per_page ?? "10"}
                      onValueChange={(value) => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: 1,
                              per_page: value,
                              sort,
                            })}`
                          );
                        });
                      }}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue placeholder={per_page} />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 40, 50].map((item) => (
                          <SelectItem key={item} value={item.toString()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm font-medium">
                    {`Page ${page} of ${pageCount}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: 1,
                              per_page,
                              sort,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending}
                    >
                      <Icons.chevronsLeft
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">First page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) - 1,
                              per_page,
                              sort,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending}
                    >
                      <Icons.chevronLeft
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) + 1,
                              per_page,
                              sort,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) >= (pageCount ?? 1) || isPending}
                    >
                      <Icons.chevronRight
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Next page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: pageCount ?? 1,
                            per_page,
                            sort,
                          })}`
                        );
                      }}
                      disabled={Number(page) >= (pageCount ?? 1) || isPending}
                    >
                      <Icons.chevronsRight
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Last page</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default ProductsTable;
