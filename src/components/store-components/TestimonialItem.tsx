import { type TestimonialType } from "@/type/TestimonialType";
import Rate from "./Rate";
import Image from "next/image";
interface TestimonialProps {
  data: TestimonialType;
  type: string;
}
export default function TestimonialItem({ data, type }: TestimonialProps) {
  return (
    <>
      {type === "style-one" ? (
        <div className="testimonial-item style-one h-full">
          <div className="testimonial-main h-full rounded-2xl bg-white p-8">
            <Rate currentRate={data.star} size={14} />
            <div className="heading6 title mt-4">{data.title}</div>
            <div className="desc mt-2">{data.description}</div>
            <div className="text-button name mt-4">{data.name}</div>
            <div className="caption2 date mt-1 text-secondary2">
              {data.date}
            </div>
          </div>
        </div>
      ) : (
        <>
          {type === "style-four" ? (
            <div className="testimonial-item style-four h-full">
              <div className="testimonial-main h-full">
                <Rate currentRate={data.star} size={14} />
                <div className="text-button-uppercase mt-4 text-secondary">
                  Customer reviews
                </div>
                <div className="heading4 desc mt-2 font-normal normal-case">
                  {data.description}
                </div>
                <div className="text-button name mt-4">{data.name}</div>
                <div className="caption2 date text-secondary2">{data.date}</div>
              </div>
            </div>
          ) : (
            <>
              {type === "style-six" ? (
                <div className="testimonial-item style-six h-full">
                  <div className="testimonial-main h-full">
                    <Rate currentRate={data.star} size={14} />
                    <div className="text-button-uppercase mt-4 text-secondary">
                      Customer reviews
                    </div>
                    <div className="heading4 desc mt-2 font-normal normal-case">
                      {data.description}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="text-button name">{data.name}</div>
                      <div className="caption1 date text-secondary2">
                        From {data.address}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {type === "style-seven" ? (
                    <>
                      <div className="testimonial-item style-seven h-full">
                        <div className="testimonial-main h-full rounded-[20px] bg-white px-7 py-8">
                          <div className="heading flex items-center gap-4">
                            <div className="avatar h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={data.avatar}
                                width={500}
                                height={500}
                                alt="avatar"
                                className="h-full w-full"
                              />
                            </div>
                            <div className="infor">
                              <Rate currentRate={data.star} size={14} />
                              <div className="text-title name">{data.name}</div>
                            </div>
                          </div>
                          <div className="body1 desc mt-4">
                            {data.description}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
