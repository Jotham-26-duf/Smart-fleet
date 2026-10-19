import type {
FleetEvent,
Vehicle,
} from "../types/fleet";

const SPEED_LIMIT = 50;
const HIGH_TEMPERATURE = 100;
const LOW_OIL_PRESSURE = 25;

function createTimestamp() {
return new Date().toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
});
}

function createEvent(
vehicle: Vehicle,
type: FleetEvent["type"],
severity: FleetEvent["severity"],
title: string,
message: string,
): FleetEvent {
return {
id: `${vehicle.id}-${type}-${Date.now()}-${Math.random()}`,
vehicleId: vehicle.id,
location: vehicle.location,
type,
severity,
title,
message,
timestamp: createTimestamp(),
};
}

export function analyzeVehicle(
vehicle: Vehicle,
): FleetEvent[] {
const events: FleetEvent[] = [];

if (vehicle.temperature >= HIGH_TEMPERATURE) {
events.push(
createEvent(
vehicle,
"DIAGNOSTIC_ALERT",
"CRITICAL",
"Critical Engine Temperature",
`Engine temperature is ${vehicle.temperature}°C and has exceeded the simulated critical threshold.`,
),
);
}

if (vehicle.oilPressure < LOW_OIL_PRESSURE) {
events.push(
createEvent(
vehicle,
"DIAGNOSTIC_ALERT",
"CRITICAL",
"Critical Oil Pressure",
`Oil pressure is ${vehicle.oilPressure} PSI and is below the simulated critical threshold.`,
),
);
}

if (vehicle.speed > SPEED_LIMIT) {
events.push(
createEvent(
vehicle,
"TRAFFIC",
"WARNING",
"Overspeed Detected",
`Vehicle speed is ${vehicle.speed} km/h, above the configured simulated limit of ${SPEED_LIMIT} km/h.`,
),
);
}

if (
vehicle.temperature >= HIGH_TEMPERATURE &&
vehicle.oilPressure < LOW_OIL_PRESSURE
) {
events.push(
createEvent(
vehicle,
"ACCIDENT_RISK",
"CRITICAL",
"Combined Vehicle Risk",
"High engine temperature and low oil pressure are occurring together and require inspection.",
),
);
}

if (vehicle.speed <= 2) {
events.push(
createEvent(
vehicle,
"PARKING",
"INFO",
"Vehicle Stopped",
"Vehicle is currently stationary in the simulated fleet environment.",
),
);
}

return events;
}

export function analyzeFleet(
vehicles: Vehicle[],
): FleetEvent[] {
return vehicles.flatMap(analyzeVehicle);
}
