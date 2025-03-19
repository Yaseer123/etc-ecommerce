"use client"

import React from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

type ParseContentProps = { content?: string | null };

const ParseContent: React.FC<ParseContentProps> = ({ content }) => (
  <div className="body1 prose prose-sm mt-3 outline-none sm:prose-base lg:prose-lg xl:prose-2xl">
    {content && parse(DOMPurify.sanitize(content))}
  </div>
);

export default ParseContent;

// import DOMPurify from "dompurify";

// export default function ParseContent({content}: {content: string}) {
//     return (
//         <div
//                 className="body1 prose prose-sm mt-3 outline-none sm:prose-base lg:prose-lg xl:prose-2xl"
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//                 dangerouslySetInnerHTML={{
//                   __html: DOMPurify.sanitize(content),
//                 }}
//               />
//     );
// }
