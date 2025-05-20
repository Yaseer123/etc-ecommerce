import Link from "next/link";
import { Layers, LogIn, LogOut, User } from "lucide-react";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="mx-auto w-full max-w-md px-4 py-16">
          <div className="overflow-hidden rounded-lg bg-white/10 shadow-xl backdrop-blur-lg">
            <div className="p-8">
              {/* Logo and Header */}
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                {session && (
                  <div className="mt-3 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                    <User className="h-4 w-4 text-white" />
                    <p className="text-sm text-white">{session.user?.name}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {session && (
                  <Link
                    href="/admin"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    <Layers className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
                    session
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {session ? (
                    <>
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </Link>
              </div>

              {!session && (
                <p className="mt-6 text-center text-sm text-gray-300">
                  Please sign in to access the admin dashboard
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
