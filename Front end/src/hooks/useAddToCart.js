import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../store/cartSlice";
import { notifyAddedToCart, notifyCartError } from "../utils/cartToast";

// The cart is stored per-user in the DB, so adding to it requires being
// logged in — bounce guests to /login instead of letting the API call 401.
export default function useAddToCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (product, quantity = 1) => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(addToCart({ productId: product.id, quantity }))
      .unwrap()
      .then(() => notifyAddedToCart(product.name))
      .catch((message) => notifyCartError(message));
  };
}
