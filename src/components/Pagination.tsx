'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Pagination({
                                       currentPage,
                                       totalItems,
                                       itemsPerPage,
                                       className = '',
                                   }: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    className?: string;
}) {
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const createQueryString = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return params.toString();
    };

    return (
        <nav className={`d-flex justify-content-center ${className}`}>
            <ul className="pagination">
                {currentPage > 1 && (
                    <li className="page-item">
                        <Link
                            className="page-link"
                            href={`?${createQueryString(currentPage - 1)}`}
                        >
                            Назад
                        </Link>
                    </li>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Link className="page-link" href={`?${createQueryString(page)}`}>
                            {page}
                        </Link>
                    </li>
                ))}

                {currentPage < totalPages && (
                    <li className="page-item">
                        <Link
                            className="page-link"
                            href={`?${createQueryString(currentPage + 1)}`}
                        >
                            Вперед
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
