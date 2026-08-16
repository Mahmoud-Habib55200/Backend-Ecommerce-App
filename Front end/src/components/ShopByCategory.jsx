import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/productsSlice";
import { addToCart } from "../store/cartSlice";
import { getProducts } from "../api/products";
import { notifyAddedToCart } from "../utils/cartToast";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function ShopByCategory() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  const status = useSelector((state) => state.products.categoriesStatus);

  const [selectedCategory, setSelectedCategory] = useState(null); // null = All
  const [products, setProducts] = useState([]);
  const [productsStatus, setProductsStatus] = useState("idle");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  useEffect(() => {
    let cancelled = false;

    setProductsStatus("loading");

    const params = selectedCategory ? { category: selectedCategory, limit: 8 } : { limit: 9 };

    getProducts(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data.data.products);
        setProductsStatus("succeeded");
      })
      .catch(() => {
        if (cancelled) return;
        setProductsStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    notifyAddedToCart(product.name);
  };

  if (status === "failed" || (status === "succeeded" && categories.length === 0)) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Shop by Category
        </h2>

        <div className="flex flex-wrap gap-2">
          {status === "loading"
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 animate-pulse rounded-full bg-slate-200"
                />
              ))
            : (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                >
                  All
                </button>

                {categories.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCategory(name)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === name
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-600 hover:text-indigo-600"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </>
            )}
        </div>

        <div className="mt-6">
          {productsStatus === "failed" && (
            <p className="text-sm text-slate-500">
              Couldn't load products, try again.
            </p>
          )}

          {productsStatus === "succeeded" && products.length === 0 && (
            <p className="text-sm text-slate-500">
              No products in this category yet.
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productsStatus === "loading"
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
