import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.pagination}>
         <button
          className={`${styles.pageBtn} ${styles.navBtn}`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          السابق
        </button>

        {startPage > 1 && (
          <>
            <button className={styles.pageBtn} onClick={() => onPageChange(1)}>1</button>
            {startPage > 2 && <span className={styles.dots}>...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.dots}>...</span>}
            <button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

         <button
          className={`${styles.pageBtn} ${styles.navBtn}`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Pagination;