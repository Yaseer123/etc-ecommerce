"use client";

import { useEffect, useRef } from "react";

const ELEVENLABS_SCRIPT_SRC =
  "https://unpkg.com/@elevenlabs/convai-widget-embed";

export default function ElevenLabsWidget() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    // Check if script already exists
    if (!document.querySelector(`script[src=\"${ELEVENLABS_SCRIPT_SRC}\"]`)) {
      const script = document.createElement("script");
      script.src = ELEVENLABS_SCRIPT_SRC;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);
    }

    scriptLoaded.current = true;
  }, []);

  return (
    <elevenlabs-convai
      agent-id="agent_01jwztzq3cfy3r9hre1w2hsmsr"
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
    />
  );
}
