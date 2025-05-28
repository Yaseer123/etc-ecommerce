"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { OrderStatus } from "@prisma/client";
import { format } from "date-fns";
import { useState } from "react";

const statusOptions = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = api.order.getAllOrders.useQuery();
  const updateStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => refetch(),
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);

  return (
    <div className="p-4 md:p-10">
      <h2 className="mb-6 text-center text-2xl font-semibold">All Orders</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-500">Failed to load orders.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="border p-2 font-mono">{order.id}</td>
                  <td className="border p-2">
                    {order.user?.name || order.user?.email || "-"}
                  </td>
                  <td className="border p-2">
                    {updatingId === order.id ? (
                      <select
                        value={newStatus || order.status}
                        onChange={(e) =>
                          setNewStatus(e.target.value as OrderStatus)
                        }
                        className="rounded border px-2 py-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded bg-gray-200 px-2 py-1">
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="border p-2">৳{order.total}</td>
                  <td className="border p-2">
                    {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
                  </td>
                  <td className="border p-2">
                    {updatingId === order.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (newStatus && newStatus !== order.status) {
                              updateStatus.mutate({
                                orderId: order.id,
                                status: newStatus,
                              });
                            }
                            setUpdatingId(null);
                          }}
                          disabled={updateStatus.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setUpdatingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setUpdatingId(order.id);
                          setNewStatus(order.status);
                        }}
                      >
                        Update Status
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
