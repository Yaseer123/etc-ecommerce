"use client";

import { AuroraBackground as AuroraBgBase } from "@/components/ui/aurora-background";
import React from "react";

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return <AuroraBgBase>{children}</AuroraBgBase>;
}
