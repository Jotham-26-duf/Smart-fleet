import type { Vehicle } from "../types/fleet";

export interface TrafficZone {
name: string;
vehicles: number;
averageSpeed: number;
congestion: number;
status: "CLEAR" | "MODERATE" | "HEAVY" | "SEVERE";
}

const zones = [
{
name: "Kimironko",
lat: -1.9441,
lng: 30.0619,
},
{
name: "Nyabugogo",
lat: -1.955,
lng: 30.085,
},
{
name: "Nyamirambo",
lat: -1.951,
lng: 30.058,
},
{
name: "Kanombe",
lat: -1.96,
lng: 30.1,
},
{
name: "Kacyiru",
lat: -1.94,
lng: 30.08,
},
{
name: "Gikondo",
lat: -1.935,
lng: 30.07,
},
];

function getDistance(
lat1: number,
lng1: number,
lat2: number,
lng2: number,
) {
const latDifference = lat1 - lat2;
const lngDifference = lng1 - lng2;

return Math.sqrt(
latDifference * latDifference +
lngDifference * lngDifference,
);
}

function getTrafficStatus(
congestion: number,
): TrafficZone["status"] {
if (congestion >= 75) {
return "SEVERE";
}

if (congestion >= 55) {
return "HEAVY";
}

if (congestion >= 30) {
return "MODERATE";
}

return "CLEAR";
}

export function calculateTrafficZones(
vehicles: Vehicle[],
): TrafficZone[] {
return zones.map((zone) => {
const nearbyVehicles = vehicles.filter((vehicle) => {
const distance = getDistance(
vehicle.lat,
vehicle.lng,
zone.lat,
zone.lng,
);


  return distance < 0.025;
});

const vehicleCount = nearbyVehicles.length;

const averageSpeed =
  vehicleCount === 0
    ? 0
    : Math.round(
        nearbyVehicles.reduce(
          (total, vehicle) => total + vehicle.speed,
          0,
        ) / vehicleCount,
      );

const speedFactor = Math.max(
  0,
  Math.min(100, 100 - averageSpeed * 2),
);

const densityFactor = Math.min(
  100,
  vehicleCount * 15,
);

const congestion = Math.round(
  speedFactor * 0.6 + densityFactor * 0.4,
);

return {
  name: zone.name,
  vehicles: vehicleCount,
  averageSpeed,
  congestion,
  status: getTrafficStatus(congestion),
};


});
}

export function calculateFleetTraffic(
vehicles: Vehicle[],
) {
const zones = calculateTrafficZones(vehicles);

// Fleet totals are based on unique source vehicles; a vehicle can be close
// enough to more than one zone and must not be weighted multiple times.
const averageSpeed = vehicles.length === 0
? 0
: Math.round(vehicles.reduce((total, vehicle) => total + vehicle.speed, 0) / vehicles.length);

const activeZones = zones.filter((zone) => zone.vehicles > 0);

const averageCongestion =
activeZones.length === 0
? 0
: Math.round(
activeZones.reduce(
(total, zone) => total + zone.congestion,
0,
) / activeZones.length,
);

const congestedZones = zones.filter(
(zone) =>
zone.status === "HEAVY" ||
zone.status === "SEVERE",
).length;

return {
zones,
averageSpeed,
averageCongestion,
congestedZones,
vehiclesDetected: vehicles.length,
};
}
