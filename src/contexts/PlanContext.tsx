"use client";

import { createContext, useContext } from "react";
import type { Plan } from "@/lib/plans";

const PlanContext = createContext<Plan>("ESSENCIAL");

export const usePlan = () => useContext(PlanContext);
export const PlanProvider = PlanContext.Provider;
