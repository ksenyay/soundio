import React from "react";
import Categories from "./Categories";
import ProductsList from "./ProductsList";

const Products = async () => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Featured Sounds</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover our curated collection of premium audio files perfect for
          relaxation, focus, and creative projects.
        </p>
      </div>

      {/* Categories */}
      <Categories />

      {/* Products  */}
      <ProductsList />
    </div>
  );
};

export default Products;
