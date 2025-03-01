"use client";
import React from "react";
import reviewData from "@/data/Testimonial.json";
import Menu from "@/components/store-components/Menu";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import TestimonialItem from "@/components/store-components/TestimonialItem";


const CustomerFeedbacks = () => {
  return (
    <>
     
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb
          heading="Customer Feedbacks"
          subHeading="Customer Feedbacks"
        />
      </div>
      <div className="customer-feedbacks py-10 md:py-20">
        <div className="container">
          <div className="list-review grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-[30px] lg:grid-cols-3">
            {reviewData.map((item) => (
              <TestimonialItem key={item.id} data={item} type="style-one" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerFeedbacks;
