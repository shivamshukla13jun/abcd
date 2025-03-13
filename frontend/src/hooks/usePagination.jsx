import { useState } from 'react';

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const next = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prev = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const jump = (page) => {
    setCurrentPage(Math.max(1, page));
  };

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to the first page when changing the limit
  };

  return {
    currentPage,
    limit,
    next,
    prev,
    jump,
    changeLimit,
  };
};

export default usePagination;