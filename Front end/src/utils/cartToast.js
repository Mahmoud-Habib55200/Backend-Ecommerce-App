import Swal from "sweetalert2";

export const cartToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1800,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const notifyAddedToCart = (productName) =>
  cartToast.fire({
    icon: "success",
    title: `${productName} added to cart`,
  });

export const notifyCartError = (message) =>
  cartToast.fire({
    icon: "error",
    title: message || "Couldn't update your cart",
  });
