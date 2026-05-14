export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatNumber = (num) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
