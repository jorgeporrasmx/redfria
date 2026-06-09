"use client";

import { useEffect } from "react";
import { seedData } from "@/lib/seed";

export function SeedInitializer() {
  useEffect(() => {
    seedData();
  }, []);

  return null;
}
