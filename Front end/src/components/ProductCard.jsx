import { Link } from "react-router-dom";
import { resolveProductImage } from "../utils/image";

const stockInfo = (countInStock) => {
  if (countInStock === 0) return { label: "Out of stock", className: "text-red-600" };
  if (countInStock < 10) return { label: `Only ${countInStock} left`, className: "text-amber-600" };
  return { label: "In stock", className: "text-emerald-600" };
};

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-square bg-slate-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-8 w-full rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, onAddToCart }) {
  const stock = stockInfo(product.countInStock);
  const filledStars = Math.round(product.rating);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={resolveProductImage(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured && (
            <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4 pb-0">
          <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-500">
            <span>{product.category}</span>
            {product.brand && <span className="text-slate-400">{product.brand}</span>}
          </div>

          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-600">
            {product.name}
          </h3>

          {product.description && (
            <p className="line-clamp-2 text-sm text-slate-500">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-sm">
            <span className="tracking-wide text-amber-400" aria-hidden="true">
              {"★".repeat(filledStars)}
              {"☆".repeat(5 - filledStars)}
            </span>
            <span className="text-slate-500">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <p className="text-lg font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
            <span className={`text-xs font-medium ${stock.className}`}>
              {stock.label}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-2">
        <button
          type="button"
          disabled={product.countInStock === 0}
          onClick={() => onAddToCart(product)}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
