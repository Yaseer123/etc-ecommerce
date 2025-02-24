export default function Newsletter() {
  return (
    <>
      <div className={`newsletter-block bg-green py-7`}>
        <div className="container flex items-center justify-center gap-8 gap-y-4 max-lg:flex-col lg:justify-between">
          <div className="text-content">
            <div className="heading3 max-lg:text-center">
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
                className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
                required
              />
              <button className="button-main absolute bottom-1 right-1 top-1 flex items-center justify-center bg-green text-black">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}