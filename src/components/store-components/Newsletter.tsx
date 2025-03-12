export default function Newsletter() {
  return (
    <>
      <div className={`newsletter-block bg-green_custom py-7`}>
        <div className="mx-auto flex w-full !max-w-[1322px] items-center justify-center gap-8 gap-y-4 px-4 max-lg:flex-col lg:justify-between">
          <div className="text-content">
            <div className="text-[36px] font-semibold capitalize leading-[40px] max-lg:text-center md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
              Sign up and get 10% off
            </div>
            <div className="mt-2 max-lg:text-center">
              Sign up for early sale access, new in, promotions and more
            </div>
          </div>
          <div className="input-block h-[52px] w-full sm:w-3/5 md:w-1/2 xl:w-5/12">
            <form className="relative h-full w-full" action="post">
              <input
                type="email"
                placeholder="Enter your e-mail"
                className="h-full w-full rounded-xl border border-line pl-4 pr-14 text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                required
              />
              <button className="button-main bg-green_custom absolute bottom-1 right-1 top-1 flex items-center justify-center text-black">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
