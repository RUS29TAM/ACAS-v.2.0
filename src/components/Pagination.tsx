'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../app/styles/page.module.css';

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
    const maxPagesToShow = 10;

    const createQueryString = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return params.toString();
    };

    // Вычисляем диапазон страниц для отображения
    const getPageNumbers = () => {
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const displayedPages = getPageNumbers();

    return (
        <nav className={`${styles.nav} d-flex justify-content-center ${className}`}>
            <ul className="pagination">
                {/* Кнопка "Назад" */}
                {currentPage > 1 && (
                    <li className="page-item">
                        <Link
                            className="page-link"
                            href={`?${createQueryString(currentPage - 1)}`}
                            aria-label="Previous"
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </Link>
                    </li>
                )}

                {/* Основные страницы */}
                {displayedPages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Link className="page-link" href={`?${createQueryString(page)}`}>
                            {page}
                        </Link>
                    </li>
                ))}

                {/* Кнопка "Вперед" */}
                {currentPage < totalPages && (
                    <li className="page-item">
                        <Link
                            className="page-link"
                            href={`?${createQueryString(currentPage + 1)}`}
                            aria-label="Next"
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
