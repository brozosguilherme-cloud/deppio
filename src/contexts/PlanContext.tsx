"use client";

import { createContext, useContext } from "react";
import type { Plan } from "@/lib/plans";

interface PlanContextValue {
  plan: Plan;
  isDemo: boolean;
}

const PlanContext = createContext<PlanContextValue>({ plan: "ESSENCIAL", isDemo: true });

export const usePlan = () => useContext(PlanContext).plan;
export const useIsDemo = () => useContext(PlanContext).isDemo;
export const usePlanContext = () => useContext(PlanContext);
export const PlanProvider = PlanContext.Provider;
