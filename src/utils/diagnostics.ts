import type { FleetAlert, Vehicle } from "../types/fleet";

export const TELEMETRY_THRESHOLDS = {
  speedLimit: 50,
  criticalTemperature: 100,
  warningTemperature: 93,
  criticalOilPressure: 25,
  warningOilPressure: 32,
} as const;

export function getVehicleStatus(temperature: number, oilPressure: number): Vehicle["status"] {
  if (temperature >= TELEMETRY_THRESHOLDS.criticalTemperature || oilPressure < TELEMETRY_THRESHOLDS.criticalOilPressure) return "CRITICAL";
  if (temperature >= TELEMETRY_THRESHOLDS.warningTemperature || oilPressure < TELEMETRY_THRESHOLDS.warningOilPressure) return "WARNING";
  return "HEALTHY";
}

export function getVehicleStatusExplanation(temperature: number, oilPressure: number): string {
  const status = getVehicleStatus(temperature, oilPressure);
  if (temperature >= TELEMETRY_THRESHOLDS.criticalTemperature) return "Engine temperature is at or above the critical threshold.";
  if (oilPressure < TELEMETRY_THRESHOLDS.criticalOilPressure) return "Oil pressure is below the critical threshold.";
  if (temperature >= TELEMETRY_THRESHOLDS.warningTemperature) return "Engine temperature is above the warning threshold.";
  if (oilPressure < TELEMETRY_THRESHOLDS.warningOilPressure) return "Oil pressure is below the warning threshold.";
  return status === "HEALTHY" ? "Temperature and oil pressure are within configured thresholds." : "Telemetry needs review.";
}

function createTimestamp() {
return new Date().toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
});
}

export function generateVehicleAlerts(
vehicle: Vehicle,
): FleetAlert[] {
const alerts: FleetAlert[] = [];

  if (vehicle.temperature >= TELEMETRY_THRESHOLDS.criticalTemperature) {
alerts.push({
id: `${vehicle.id}-temperature-critical`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "HIGH_TEMPERATURE",
severity: "CRITICAL",
title: "Critical Engine Temperature",
message:
"Engine temperature has exceeded the critical simulated threshold.",
value: vehicle.temperature,
unit: "°C",
timestamp: createTimestamp(),
});
  } else if (vehicle.temperature >= TELEMETRY_THRESHOLDS.warningTemperature) {
alerts.push({
id: `${vehicle.id}-temperature-warning`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "HIGH_TEMPERATURE",
severity: "WARNING",
title: "Elevated Engine Temperature",
message:
"Engine temperature is above the normal simulated operating range.",
value: vehicle.temperature,
unit: "°C",
timestamp: createTimestamp(),
});
}

  if (vehicle.oilPressure < TELEMETRY_THRESHOLDS.criticalOilPressure) {
alerts.push({
id: `${vehicle.id}-oil-critical`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "LOW_OIL_PRESSURE",
severity: "CRITICAL",
title: "Critical Oil Pressure",
message:
"Oil pressure is below the critical simulated threshold.",
value: vehicle.oilPressure,
unit: "PSI",
timestamp: createTimestamp(),
});
  } else if (vehicle.oilPressure < TELEMETRY_THRESHOLDS.warningOilPressure) {
alerts.push({
id: `${vehicle.id}-oil-warning`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "LOW_OIL_PRESSURE",
severity: "WARNING",
title: "Low Oil Pressure",
message:
"Oil pressure is below the normal simulated operating range.",
value: vehicle.oilPressure,
unit: "PSI",
timestamp: createTimestamp(),
});
}

  if (vehicle.speed > TELEMETRY_THRESHOLDS.speedLimit) {
alerts.push({
id: `${vehicle.id}-speed`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "OVERSPEED",
severity: "WARNING",
title: "Overspeed Detected",
message:
"Vehicle speed has exceeded the configured simulated speed limit.",
value: vehicle.speed,
unit: "km/h",
timestamp: createTimestamp(),
});
}

if (
    vehicle.temperature >= TELEMETRY_THRESHOLDS.criticalTemperature &&
    vehicle.oilPressure < TELEMETRY_THRESHOLDS.criticalOilPressure
) {
alerts.push({
id: `${vehicle.id}-combined-risk`,
vehicleId: vehicle.id,
location: vehicle.location,
type: "COMBINED_RISK",
severity: "CRITICAL",
title: "Combined Engine Risk",
message:
"High engine temperature and low oil pressure are occurring together.",
value: vehicle.temperature,
unit: "°C",
timestamp: createTimestamp(),
});
}

return alerts;
}

export function generateFleetAlerts(
vehicles: Vehicle[],
): FleetAlert[] {
return vehicles.flatMap(generateVehicleAlerts);
}
