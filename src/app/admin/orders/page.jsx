"use client"

import OrdersDashboard from "../../../../components/admin/OrdersDashboard";
// This is a Server Component, but OrdersDashboard is client-side
export default function AdminOrdersPage() {
  return (
    <OrdersDashboard />
  );
}