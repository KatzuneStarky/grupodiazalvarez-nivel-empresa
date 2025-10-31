"use client"

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsuariosDashboard } from "@/modules/usuarios/hooks/use-usuarios-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, LayoutGrid, List, Table2 } from "lucide-react"
import UserFilters from "@/modules/usuarios/components/user-filters"
import { useUsuarios } from "@/modules/usuarios/hooks/use-usuarios"
import UserTable from "@/modules/usuarios/components/user-table"
import UserCards from "@/modules/usuarios/components/user-card"
import { Card, CardContent } from "@/components/ui/card"
import { ViewMode } from "@/modules/usuarios/types/user"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

const UsuariosPage = () => {
    const { usuarios } = useUsuarios()
    const {
        ITEMS_PER_PAGE_OPTIONS,
        allSelected,
        currentPage,
        filteredAndSortedUsers,
        filters,
        handleClearFilters,
        handleFiltersChange,
        handlePageChange,
        handleSelectAll,
        handleSelectUser,
        handleSort,
        handleViewUser,
        itemsPerPage,
        paginatedUsers,
        selectedUserIds,
        setItemsPerPage,
        setViewMode,
        setCurrentPage,
        someSelected,
        sortDirection,
        sortField,
        startIndex,
        totalPages,
        viewMode
    } = useUsuariosDashboard(usuarios)

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                <UserFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    onExportUsers={() => { }}
                    onImportUsers={() => { }}
                    onCreateUser={() => {}}
                    totalUsers={usuarios.length}
                    filteredUsers={filteredAndSortedUsers.length}
                />

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                                <TabsList>
                                    <TabsTrigger value="table" className="flex items-center gap-2">
                                        <Table2 className="h-4 w-4" />
                                        Tabla
                                    </TabsTrigger>
                                    <TabsTrigger value="cards" className="flex items-center gap-2">
                                        <LayoutGrid className="h-4 w-4" />
                                        Tarjeta
                                    </TabsTrigger>
                                    <TabsTrigger value="list" className="flex items-center gap-2">
                                        <List className="h-4 w-4" />
                                        Lista
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSort(sortField)}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowUpDown className="h-4 w-4" />
                                        Sort: {sortField} {sortDirection === "asc" ? "↑" : "↓"}
                                    </Button>
                                </div>

                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => {
                                        setItemsPerPage(Number(value))
                                        setCurrentPage(1)
                                    }}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={option.toString()}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Tabs value={viewMode} className="space-y-4">
                            <TabsContent value="table" className="space-y-4">
                                <UserTable
                                    users={paginatedUsers}
                                    selectedUserIds={selectedUserIds}
                                    onSelectUser={handleSelectUser}
                                    onSelectAll={handleSelectAll}
                                    allSelected={allSelected}
                                    someSelected={someSelected}
                                    onViewUser={handleViewUser}
                                    onEditUser={() => { }}
                                    onSuspendUser={() => { }}
                                    onSort={handleSort}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                />
                            </TabsContent>

                            <TabsContent value="cards" className="space-y-4">
                                <UserCards
                                    users={paginatedUsers}
                                    selectedUserIds={selectedUserIds}
                                    onSelectUser={handleSelectUser}
                                    onViewUser={handleViewUser}
                                    onEditUser={() => { }}
                                    onSuspendUser={() => { }}
                                />
                            </TabsContent>

                            <TabsContent value="list" className="space-y-4">
                                <UserCards
                                    users={paginatedUsers}
                                    selectedUserIds={selectedUserIds}
                                    onSelectUser={handleSelectUser}
                                    onViewUser={handleViewUser}
                                    onEditUser={() => { }}
                                    onSuspendUser={() => { }}
                                    variant="list"
                                />
                            </TabsContent>
                        </Tabs>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} of{" "}
                                    {filteredAndSortedUsers.length} results
                                </p>

                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = i + 1
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(page)}
                                                        isActive={currentPage === page}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UsuariosPage