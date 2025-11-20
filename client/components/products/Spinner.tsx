import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Spinner;
