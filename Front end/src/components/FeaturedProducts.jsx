import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../store/productsSlice";
import useAddToCart from "../hooks/useAddToCart";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.featuredItems);
  const status = useSelector((state) => state.products.featuredStatus);
  const handleAddToCart = useAddToCart();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFeaturedProducts());
    }
  }, [status, dispatch]);

  if (status === "failed" || (status === "succeeded" && items.length === 0)) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {status === "loading"
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
