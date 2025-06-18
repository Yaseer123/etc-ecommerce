"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ORDER_STATUS_COLORS } from "@/utils/constants";
import type { OrderStatus } from "@prisma/client";
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
                <th className="border p-2">Address</th>
                <th className="border p-2">SKU</th>
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
                    {order.user?.name ?? order.user?.email ?? "-"}
                  </td>
                  <td className="whitespace-pre-line border p-2">
                    {order.address
                      ? `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipCode}\n${order.address.phone}`
                      : "-"}
                  </td>
                  <td className="border p-2">
                    {order.items && order.items.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {order.items.map((item) => (
                          <span key={item.id} className="font-mono text-xs">
                            {item.sku ?? "-"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">
                    {updatingId === order.id ? (
                      <select
                        value={newStatus ?? order.status}
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
                      <Badge
                        variant={undefined}
                        className={ORDER_STATUS_COLORS[order.status]?.color}
                      >
                        {ORDER_STATUS_COLORS[order.status]?.label ??
                          order.status}
                      </Badge>
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
