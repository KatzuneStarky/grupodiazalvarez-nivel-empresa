"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ReporteViajesPaginationProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
    currentPage: number
    totalPages: number
}

const ReporteViajesPagination = ({
    setCurrentPage,
    currentPage,
    totalPages
}: ReporteViajesPaginationProps) => {
    const generatePages = () => {
        const pages: (number | string)[] = [];

        const firstPages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

        const lastPagesStart = Math.max(totalPages - 4, 1);
        const lastPages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => lastPagesStart + i);

        const shouldShowEllipsis = lastPagesStart > 6;

        pages.push(...firstPages);

        if (shouldShowEllipsis) {
            pages.push("ellipsis");
        }

        lastPages.forEach((page) => {
            if (!pages.includes(page)) pages.push(page);
        });

        return pages;
    };

    const pages = generatePages();

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {pages.map((page, idx) => (
                    <PaginationItem key={idx}>
                        {page === "ellipsis" ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page as number);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default ReporteViajesPagination