import { useCallback, useEffect, useState } from "react";
import { demoFleetProvider, type FleetSnapshot } from "../data/fleetProvider";

export function useFleetSimulation() {
  const [snapshot, setSnapshot] = useState<FleetSnapshot>(() => demoFleetProvider.getInitialSnapshot());

  useEffect(() => demoFleetProvider.subscribe(setSnapshot), []);

  const resetSimulation = useCallback(() => setSnapshot(demoFleetProvider.reset()), []);

  return { ...snapshot, resetSimulation };
}
