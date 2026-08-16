import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../store/productsSlice";
import { addToCart } from "../store/cartSlice";
import { resolveProductImage } from "../utils/image";
import { notifyAddedToCart } from "../utils/cartToast";
import Pagination from "../components/Pagination";
import BannerSlider from "../components/BannerSlider";
import ShopByCategory from "../components/ShopByCategory";
import FeaturedProducts from "../components/FeaturedProducts";
import LatestProducts from "../components/LatestProducts";
import "./Home.css";

const stockInfo = (countInStock) => {
  if (countInStock === 0) return { label: "Out of stock", className: "out" };
  if (countInStock < 10) return { label: `Only ${countInStock} left`, className: "low" };
  return { label: "In stock", className: "in" };
};

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error, page, totalPages } = useSelector(
    (state) => state.products,
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  return (
    <>
      <BannerSlider />
      <ShopByCategory />
      <FeaturedProducts />
      <LatestProducts />

      <div className="container home">
        <h1>Products</h1>

        {status === "loading" && <p>Loading products...</p>}
        {status === "failed" && <div className="error-banner">{error}</div>}

        {status === "succeeded" && (
          <div className="product-grid">
            {items.map((product) => {
              const stock = stockInfo(product.countInStock);
              const filledStars = Math.round(product.rating);

              return (
                <div className="product-card" key={product.id}>
                  <Link to={`/products/${product.id}`} className="product-card-link">
                    <div className="product-card-image-wrap">
                      <img
                        className="product-card-image"
                        src={resolveProductImage(product.image)}
                        alt={product.name}
                      />
                      {product.isFeatured && (
                        <span className="product-card-badge">Featured</span>
                      )}
                    </div>

                    <div className="product-card-body">
                      <div className="product-card-meta">
                        <span className="product-card-category">
                          {product.category}
                        </span>
                        {product.brand && (
                          <span className="product-card-brand">{product.brand}</span>
                        )}
                      </div>

                      <h3 className="product-card-name">{product.name}</h3>

                      {product.description && (
                        <p className="product-card-description">
                          {product.description}
                        </p>
                      )}

                      <div className="product-card-rating">
                        <span className="product-card-stars" aria-hidden="true">
                          {"★".repeat(filledStars)}
                          {"☆".repeat(5 - filledStars)}
                        </span>
                        <span className="product-card-reviews">
                          {product.rating.toFixed(1)} ({product.numReviews})
                        </span>
                      </div>

                      <div className="product-card-footer">
                        <p className="product-card-price">
                          ${product.price.toFixed(2)}
                        </p>
                        <span className={`product-card-stock ${stock.className}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="product-card-actions">
                    <button
                      type="button"
                      className="product-card-add-btn"
                      disabled={product.countInStock === 0}
                      onClick={() => {
                        dispatch(addToCart(product));
                        notifyAddedToCart(product.name);
                      }}
                    >
                      {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {status === "succeeded" && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
