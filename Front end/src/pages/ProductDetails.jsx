import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProductById, clearCurrentProduct } from "../store/productsSlice";
import { addToCart } from "../store/cartSlice";
import { resolveProductImage } from "../utils/image";
import { notifyAddedToCart } from "../utils/cartToast";

const stockInfo = (countInStock) => {
  if (countInStock === 0) return { label: "Out of stock", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" };
  if (countInStock < 10) return { label: `Only ${countInStock} left`, dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" };
  return { label: "In stock", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
};

const TRUST_BADGES = [
  {
    label: "Secure checkout",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3M5.25 10.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    ),
  },
  {
    label: "Fast delivery",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3.75 6h9v9m-9-9v9m9-9 3.5 0 3.25 4.5v4.5h-2.5m-10.25 0h6.5"
      />
    ),
  },
  {
    label: "Easy 7-day returns",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
      />
    ),
  },
];

function Breadcrumb({ category, name }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link to="/" className="transition-colors hover:text-indigo-600">
        Home
      </Link>
      {category && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{category}</span>
        </>
      )}
      {name && (
        <>
          <span className="text-slate-300">/</span>
          <span className="max-w-[16rem] truncate font-medium text-slate-700">{name}</span>
        </>
      )}
    </nav>
  );
}

function DetailsSkeleton() {
  return (
    <div>
      <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-slate-200" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>

        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-5 w-1/3 rounded bg-slate-200" />
          <div className="h-9 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/4 rounded bg-slate-200" />
          <div className="h-10 w-1/3 rounded bg-slate-200" />
          <div className="h-px w-full bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-2 h-14 w-full rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function NotFoundState({ message }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75 14.25 14.25M14.25 9.75 9.75 14.25M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          />
        </svg>
      </div>
      <h1 className="mt-5 text-xl font-bold text-slate-900">
        {message === "Product not found" ? "Product not found" : "Something went wrong"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {message === "Product not found"
          ? "This product may have been removed, or the link you followed is incorrect."
          : message}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Back to products
      </Link>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.currentProduct);
  const status = useSelector((state) => state.products.currentProductStatus);
  const error = useSelector((state) => state.products.currentProductError);

  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    notifyAddedToCart(product.name);
  };

  return (
    <div className="bg-slate-50">
      <div className="container py-8 lg:py-12">
        <Breadcrumb
          category={product?.category}
          name={status === "succeeded" ? product?.name : undefined}
        />

        <div className="mt-6">
          {status === "loading" && <DetailsSkeleton />}

          {status === "failed" && <NotFoundState message={error} />}

          {status === "succeeded" && product && (() => {
            const stock = stockInfo(product.countInStock);
            const filledStars = Math.round(product.rating);
            const thumbnails = [product.image, ...(product.images || [])];

            return (
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Gallery */}
                <div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={resolveProductImage(activeImage)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                      {product.isFeatured && (
                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                        <span className="rounded-lg bg-slate-900/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {thumbnails.length > 1 && (
                    <div className="mt-4 flex gap-3">
                      {thumbnails.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImage(img)}
                          aria-label={`Show image ${i + 1}`}
                          className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition-all ${
                            activeImage === img
                              ? "border-indigo-600 ring-2 ring-indigo-100"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img
                            src={resolveProductImage(img)}
                            alt={`${product.name} thumbnail ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trust badges */}
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TRUST_BADGES.map((badge) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 shrink-0 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          {badge.icon}
                        </svg>
                        <span className="text-xs font-medium text-slate-600">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info panel */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="text-sm font-medium text-slate-400">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {product.name}
                  </h1>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="tracking-wide text-amber-400" aria-hidden="true">
                      {"★".repeat(filledStars)}
                      {"☆".repeat(5 - filledStars)}
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400">
                      ({product.numReviews} reviews)
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <p className="text-4xl font-bold text-slate-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stock.bg} ${stock.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${stock.dot}`} />
                      {stock.label}
                    </span>
                  </div>

                  <p className="mt-6 leading-relaxed text-slate-600">
                    {product.description}
                  </p>

                  <div className="my-8 h-px w-full bg-slate-200" />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white sm:justify-start">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-12 w-12 items-center justify-center text-lg text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) => Math.min(product.countInStock, q + 1))
                        }
                        disabled={quantity >= product.countInStock}
                        aria-label="Increase quantity"
                        className="flex h-12 w-12 items-center justify-center text-lg text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={handleAddToCart}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.694 2.602-7.152.096-.39-.207-.752-.612-.752H5.106M7.5 14.25 5.106 5.383M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                      {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>

                  {/* Specs */}
                  <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="divide-y divide-slate-100">
                      <div className="flex items-center justify-between px-5 py-3 text-sm">
                        <span className="text-slate-500">Brand</span>
                        <span className="font-medium text-slate-800">
                          {product.brand || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-3 text-sm">
                        <span className="text-slate-500">Category</span>
                        <span className="font-medium text-slate-800">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-3 text-sm">
                        <span className="text-slate-500">Availability</span>
                        <span className={`font-medium ${stock.text}`}>
                          {stock.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-5 py-3 text-sm">
                        <span className="text-slate-500">SKU</span>
                        <span className="font-mono text-xs font-medium text-slate-500">
                          {product.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
