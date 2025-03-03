"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import ReactPixel from "react-facebook-pixel";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!;

export default function AnalyticsScript() {
  const pathname = usePathname();
  const [fbPixelInitialized, setFbPixelInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // ✅ Google Analytics Page Tracking
      window.gtag?.("config", GA_TRACKING_ID, {
        page_path: pathname,
      });

      // ✅ Initialize Facebook Pixel Once
      if (!fbPixelInitialized) {
        ReactPixel.init(FB_PIXEL_ID);
        setFbPixelInitialized(true);
      }

      // ✅ Track page views only if fbq exists
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    }
  }, [pathname, fbPixelInitialized]);

  return (
    <>
      {/* ✅ Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* ✅ Facebook Pixel Script */}
      <Script
        id="facebook-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Facebook Pixel"
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
