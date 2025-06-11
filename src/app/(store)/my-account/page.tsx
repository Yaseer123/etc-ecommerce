"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HouseLine,
  Package,
  Tag,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Dashboard from "@/components/store-components/UserDashboard/Dashboard";
import OrderHistory from "@/components/store-components/UserDashboard/OrderHistory";
import AddressTab from "@/components/store-components/UserDashboard/Address";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HomeIcon } from "lucide-react";

const MyAccount = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | undefined>("dashboard");

  const breadcrumbItems = [
    { label: <HomeIcon size={16} />, href: "/" },
    { label: "my-account" },
  ];

  if (!session?.user) {
    router.push("/login");
  }

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb pageTitle="My Account" items={breadcrumbItems} />
      </div>
      <div className="profile-block py-10 md:py-20">
        <div className="container">
          <div className="content-main flex w-full gap-y-8 max-md:flex-col">
            <div className="left w-full md:w-1/3 md:pr-[16px] lg:pr-[28px] xl:pr-[3.125rem]">
              <div className="user-infor rounded-xl bg-surface px-4 py-5 md:rounded-[20px] lg:px-7 lg:py-10">
                <div className="heading flex flex-col items-center justify-center">
                  <div className="avatar">
                    <Image
                      src={session?.user.image ?? "/images/avatar/1.png"}
                      width={300}
                      height={300}
                      alt="avatar"
                      className="h-[120px] w-[120px] rounded-full md:h-[140px] md:w-[140px]"
                    />
                  </div>
                  <div className="name heading6 mt-4 text-center">
                    {session?.user.name}
                  </div>
                  <div className="mail heading6 mt-1 text-center font-normal normal-case text-secondary">
                    {session?.user.email}
                  </div>
                </div>
                <div className="menu-tab mt-6 w-full max-w-none lg:mt-10">
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <HouseLine size={20} />
                    <strong className="heading6">Dashboard</strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package size={20} />
                    <strong className="heading6">Orders History</strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "address" ? "active" : ""}`}
                    onClick={() => setActiveTab("address")}
                  >
                    <Tag size={20} />
                    <strong className="heading6">My Address</strong>
                  </Link>
                  <Link
                    href={"/api/auth/signout"}
                    className="item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white"
                  >
                    <SignOut size={20} />
                    <strong className="heading6">Logout</strong>
                  </Link>
                </div>
              </div>
            </div>
            <div className="right w-full pl-2.5 md:w-2/3">
              <Dashboard activeTab={activeTab} />
              <OrderHistory activeTab={activeTab} />
              <AddressTab activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
