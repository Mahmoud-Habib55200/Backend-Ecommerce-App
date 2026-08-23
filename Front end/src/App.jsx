import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { fetchMe } from "./store/authSlice";
import { fetchCart, resetCart } from "./store/cartSlice";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  // The cart lives in the DB per user — load it once we know who's logged
  // in, and wipe the locally-held copy on logout so it never leaks into
  // the next person's session.
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      dispatch(resetCart());
    }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <CategoryBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
