export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errors?.length) return data.errors[0].message;
  if (data?.message) return data.message;
  return "Something went wrong. Please try again.";
}
