import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCart,
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/cartSlice";
import { resolveProductImage } from "../utils/image";
import { notifyCartError } from "../utils/cartToast";

function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-indigo-500"
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
      </div>
      <h1 className="mt-5 text-xl font-bold text-slate-900">Your cart is empty</h1>
      <p className="mt-2 text-sm text-slate-500">
        Looks like you haven't added anything yet. Start browsing to fill it up.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Browse products
      </Link>
    </div>
  );
}

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const status = useSelector((state) => state.cart.status);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }))
      .unwrap()
      .catch((message) => notifyCartError(message));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
      .unwrap()
      .catch((message) => notifyCartError(message));
  };

  const handleClear = () => {
    dispatch(clearCart())
      .unwrap()
      .catch((message) => notifyCartError(message));
  };

  return (
    <div className="bg-slate-50">
      <div className="container py-8 lg:py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Your Cart
        </h1>

        {status === "loading" && items.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">Loading your cart...</p>
        ) : items.length === 0 ? (
          <div className="mt-6">
            <EmptyCart />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ul className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex items-center gap-4 p-4 sm:p-5">
                      <Link
                        to={`/products/${item.product.id}`}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <img
                          src={resolveProductImage(item.product.image)}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-indigo-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-10 w-10 items-center justify-center text-lg text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.countInStock}
                          aria-label="Increase quantity"
                          className="flex h-10 w-10 items-center justify-center text-lg text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          +
                        </button>
                      </div>

                      <p className="w-20 shrink-0 text-right text-sm font-semibold text-slate-900">
                        ${item.subtotal.toFixed(2)}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id)}
                        aria-label={`Remove ${item.product.name}`}
                        className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
                            d="M6 7.5h12M9.75 7.5V5.25a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5V7.5m-7.5 0 .662 11.26a2 2 0 0 0 2 1.99h5.176a2 2 0 0 0 2-1.99L17.25 7.5"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="mt-4 text-sm font-medium text-slate-500 transition-colors hover:text-red-600"
              >
                Clear cart
              </button>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
                  </span>
                  <span className="font-semibold text-slate-900">${total.toFixed(2)}</span>
                </div>

                <div className="my-4 h-px w-full bg-slate-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
