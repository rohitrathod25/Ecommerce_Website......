import React from 'react';
import Pagination from '@mui/material/Pagination';
import "./styles.css";

export default function PaginationComponent({ page, handlePageChange, count }) {
  return (
    <div className="pagination-container">
      <Pagination 
        count={count} 
        page={page}
        onChange={(event, value) => handlePageChange(event, value)}
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "1.4rem", // Increase font size
        
          },
          "& .Mui-selected": {
            backgroundColor: "var(--blue) !important",
            color: "#fff !important",
            borderColor: "var(--blue) !important",
          },
          "& .MuiPaginationItem-ellipsis": {
            border: "none",
          },
          "& .MuiPaginationItem-text": {
            color: "var(--white)",
            border: "1px solid var(--grey)",
          },
        }}
      />
    </div>
  );
}
