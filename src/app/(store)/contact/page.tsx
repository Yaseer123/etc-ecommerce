"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import { toast } from "sonner";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const contactMutation = api.contact.create.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Contact us",
    },
  ];

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="Contact us" />
      </div>
      <div className="contact-us py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex justify-between gap-y-10 max-lg:flex-col">
            <div className="left lg:w-2/3 lg:pr-4">
              <div className="text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
                Drop Us A Line
              </div>
              <div className="body1 mt-3 text-secondary2">
                Use the form below to get in touch with the sales team
              </div>
              <form className="mt-4 md:mt-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 gap-y-5 sm:grid-cols-2">
                  <div className="name">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      name="name"
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="email">
                    <input
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      name="email"
                      type="email"
                      placeholder="Your Email *"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="message sm:col-span-2">
                    <textarea
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      name="message"
                      rows={3}
                      placeholder="Your Message *"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="duration-400 md:text-sm inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black disabled:opacity-50 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
            <div className="right lg:w-1/4 lg:pl-4">
              <div className="item">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Our Store
                </div>
                <p className="mt-3">
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, United
                  States
                </p>
                <p className="mt-3">
                  Phone: <span className="whitespace-nowrap">+1 666 8888</span>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <span className="whitespace-nowrap">hi.avitex@gmail.com</span>
                </p>
              </div>
              <div className="item mt-10">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Open Hours
                </div>
                <p className="mt-3">
                  Mon - Fri:{" "}
                  <span className="whitespace-nowrap">7:30am - 8:00pm PST</span>
                </p>
                <p className="mt-3">
                  Saturday:{" "}
                  <span className="whitespace-nowrap">8:00am - 6:00pm PST</span>
                </p>
                <p className="mt-3">
                  Sunday:{" "}
                  <span className="whitespace-nowrap">9:00am - 5:00pm PST</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
