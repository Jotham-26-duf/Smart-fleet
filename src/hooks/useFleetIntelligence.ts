import { useMemo } from "react";

import type { Vehicle } from "../types/fleet";

import { analyzeFleet } from "../utils/intelligence";

export function useFleetIntelligence(
vehicles: Vehicle[],
) {
const currentEvents = useMemo(
() => analyzeFleet(vehicles),
[vehicles],
);

const eventHistory = currentEvents;

const eventCounts = useMemo(() => {
return {
total: eventHistory.length,

  critical: eventHistory.filter(
    (event) => event.severity === "CRITICAL",
  ).length,

  warnings: eventHistory.filter(
    (event) => event.severity === "WARNING",
  ).length,

  traffic: eventHistory.filter(
    (event) => event.type === "TRAFFIC",
  ).length,

  accidentRisk: eventHistory.filter(
    (event) => event.type === "ACCIDENT_RISK",
  ).length,

  parking: eventHistory.filter(
    (event) => event.type === "PARKING",
  ).length,

  security: eventHistory.filter(
    (event) => event.type === "SECURITY",
  ).length,

  roadRisk: eventHistory.filter(
    (event) => event.type === "ROAD_RISK",
  ).length,
};


}, [eventHistory]);

return {
currentEvents,
eventHistory,
eventCounts,
};
}
