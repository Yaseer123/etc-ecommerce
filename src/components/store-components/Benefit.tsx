export default function Benefit({ props }: { props: string }) {
  return (
    <>
      <div className="mx-auto w-full !max-w-[1322px] px-4">
        <div className={`benefit-block ${props}`}>
          <div className="list-benefit grid grid-cols-2 items-start gap-[30px] lg:grid-cols-4">
            <div className="benefit-item flex flex-col items-center justify-center">
              <i className="icon-phone-call text-5xl lg:text-7xl"></i>
              <div className="heading6 mt-5 text-center">
                24/7 Customer Service
              </div>
              <div className="mt-3 text-center text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                We&apos;re here to help you with any questions or concerns you
                have, 24/7.
              </div>
            </div>
            <div className="benefit-item flex flex-col items-center justify-center">
              <i className="icon-return text-5xl lg:text-7xl"></i>
              <div className="heading6 mt-5 text-center">14-Day Money Back</div>
              <div className="mt-3 text-center text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                If you&apos;re not satisfied with your purchase, simply return
                it within 14 days for a refund.
              </div>
            </div>
            <div className="benefit-item flex flex-col items-center justify-center">
              <i className="icon-guarantee text-5xl lg:text-7xl"></i>
              <div className="heading6 mt-5 text-center">Our Guarantee</div>
              <div className="mt-3 text-center text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                {" "}
                We stand behind our products and services and guarantee your
                satisfaction.
              </div>
            </div>
            <div className="benefit-item flex flex-col items-center justify-center">
              <i className="icon-delivery-truck text-5xl lg:text-7xl"></i>
              <div className="heading6 mt-5 text-center">
                Shipping worldwide
              </div>
              <div className="mt-3 text-center text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                We ship our products worldwide, making them accessible to
                customers everywhere.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
