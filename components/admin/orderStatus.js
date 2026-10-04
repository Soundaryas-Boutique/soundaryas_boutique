// One definition of the order lifecycle, shared by the status pill, the
// status picker and the filter bar.
//
// The colours are the shop's own: gold for work waiting on you, royal purple
// while it is being packed, saffron in transit, emerald when it lands, and
// the sindoor red for a cancellation. Generic traffic lights would carry the
// same information and none of the identity.

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "#D4AF37" },
  { value: "processing", label: "Processing", color: "#4A148C" },
  { value: "shipped", label: "Shipped", color: "#F4511E" },
  { value: "delivered", label: "Delivered", color: "#004D40" },
  { value: "cancelled", label: "Cancelled", color: "#B71C1C" },
];

export const statusMeta = (value) =>
  ORDER_STATUSES.find((s) => s.value === value) ?? {
    value,
    label: value,
    color: "#757575",
  };

/** Statuses that still need the shop to do something. */
export const OPEN_STATUSES = ["pending", "processing"];
