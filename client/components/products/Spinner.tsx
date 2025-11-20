import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 24 24">
        <path
          className="opacity-75"
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10"
        />
      </svg>
    </div>
  );
};

export default Spinner;
