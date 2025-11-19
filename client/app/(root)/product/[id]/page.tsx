import ProductPage from "@/components/products/ProductPage";

const Product = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div className="page-container mt-0">
      <ProductPage id={id} />
    </div>
  );
};

export default Product;
