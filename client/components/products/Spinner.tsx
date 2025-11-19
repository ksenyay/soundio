import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 24 24">
        <circle
          className="opacity-75"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Spinner;
