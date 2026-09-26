import type { Order, OrderStatus } from "./types";

export const STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "placed", label: "Order placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "out-for-delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
];

export const createOrderId = () => {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `RR-${n}`;
};

/** Simulated fulfilment timeline so tracking feels real before a warehouse is connected. */
export const statusOf = (order: Order, now = Date.now()): OrderStatus => {
  const hours = (now - new Date(order.createdAt).getTime()) / 3_600_000;
  if (order.payment === "cod") {
    if (hours < 2) return "placed";
    if (hours < 8) return "confirmed";
    if (hours < 24) return "packed";
    if (hours < 48) return "shipped";
    if (hours < 80) return "out-for-delivery";
    return "delivered";
  }
  if (hours < 1) return "placed";
  if (hours < 4) return "confirmed";
  if (hours < 18) return "packed";
  if (hours < 40) return "shipped";
  if (hours < 70) return "out-for-delivery";
  return "delivered";
};

export const statusIndex = (status: OrderStatus) => STATUSES.findIndex((s) => s.id === status);
