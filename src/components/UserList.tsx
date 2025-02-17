"use client";

import { api } from "@/trpc/react";
import { Button } from "./ui/button";

export default function UserList() {
  const [users] = api.user.getAll.useSuspenseQuery();

  const utils = api.useUtils();
  const makeAdmin = api.user.makeAdmin.useMutation({
    onSuccess: async () => {
      await utils.user.getAll.invalidate();
    },
  });
  return (
    <div className="p-10">
      <div className="flex flex-col gap-y-2">
        {users.map((user) => (
          <div className="flex items-center gap-x-10" key={user.id}>
            <div key={user.id}>{user.name}</div>
            <div>
              {user.role === "ADMIN" ? (
                <p className="text-black/50">Already an Admin</p>
              ) : (
                <Button onClick={() => makeAdmin.mutate({ id: user.id })}>
                  Make admin
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
