export type VehicleStatus = "HEALTHY" | "WARNING" | "CRITICAL";
export type DataSourceStatus = "LIVE" | "SIMULATED" | "STALE" | "OFFLINE" | "UNAVAILABLE";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertType =
| "HIGH_TEMPERATURE"
| "LOW_OIL_PRESSURE"
| "OVERSPEED"
| "COMBINED_RISK";

export type FleetEventType =
| "DIAGNOSTIC_ALERT"
| "TRAFFIC"
| "ACCIDENT_RISK"
| "PARKING"
| "SECURITY"
| "ROAD_RISK";

export interface Vehicle {
id: string;
route: string;
location: string;
lat: number;
lng: number;

speed: number;
temperature: number;
oilPressure: number;
rpm: number;

status: VehicleStatus;
  stoppedSince: number | null;
  lastUpdatedAt?: string;
  gpsAccuracyM?: number | null;
  sourceStatus?: DataSourceStatus;
}

export interface IncomingVehicleTelemetry {
  id: string;
  route?: string;
  lat?: number | null;
  lng?: number | null;
  gpsAccuracyM?: number | null;
  speed?: number | null;
  temperature?: number | null;
  oilPressure?: number | null;
  rpm?: number | null;
  ignitionOn?: boolean | null;
  lastUpdatedAt: string;
}

export interface FleetAlert {
id: string;
vehicleId: string;
location: string;
type: AlertType;
severity: AlertSeverity;
title: string;
message: string;
value: number;
unit: string;
timestamp: string;
}

export interface FleetEvent {
id: string;
vehicleId: string;
location: string;
type: FleetEventType;
severity: AlertSeverity;
title: string;
message: string;
timestamp: string;
}
