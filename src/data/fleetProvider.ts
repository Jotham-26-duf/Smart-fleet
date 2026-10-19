import { fleetData } from "./fleetData";
import { getVehicleStatus } from "../utils/diagnostics";
import type { DataSourceStatus, IncomingVehicleTelemetry, Vehicle } from "../types/fleet";

export interface FleetSnapshot {
  vehicles: Vehicle[];
  status: DataSourceStatus;
  lastUpdatedAt: string;
  message: string;
}

/**
 * Integration boundary for a backend or authenticated telemetry stream.
 * A live implementation can replace this provider without coupling pages to
 * transport details. No real provider is configured in this project.
 */
export interface FleetDataProvider {
  readonly status: DataSourceStatus;
  getInitialSnapshot(): FleetSnapshot;
  subscribe(listener: (snapshot: FleetSnapshot) => void): () => void;
  reset(): FleetSnapshot;
}

export const DEMO_STOP_SPEED_KMH = 2;
export const DEMO_START_SPEED_KMH = 4;

function normalizeVehicles(vehicles: Vehicle[], now: number): Vehicle[] {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    status: getVehicleStatus(vehicle.temperature, vehicle.oilPressure),
    lastUpdatedAt: new Date(now).toISOString(),
    sourceStatus: "SIMULATED",
  }));
}

function updateVehicle(vehicle: Vehicle, now: number): Vehicle {
  const speed = Math.max(0, Math.min(60, vehicle.speed + Math.round((Math.random() - 0.5) * 8)));
  const temperature = Math.max(75, Math.min(110, vehicle.temperature + Math.round((Math.random() - 0.5) * 4)));
  const oilPressure = Math.max(18, Math.min(55, vehicle.oilPressure + Math.round((Math.random() - 0.5) * 4)));
  const rpm = Math.max(900, Math.min(2400, vehicle.rpm + Math.round((Math.random() - 0.5) * 250)));
  const stoppedSince = speed <= DEMO_STOP_SPEED_KMH
    ? vehicle.stoppedSince ?? now
    : speed >= DEMO_START_SPEED_KMH ? null : vehicle.stoppedSince;

  return {
    ...vehicle,
    speed,
    temperature,
    oilPressure,
    rpm,
    // The local demo intentionally simulates movement. Real providers must
    // supply GPS positions and must never fall back to these demo coordinates.
    lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
    lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
    stoppedSince,
    status: getVehicleStatus(temperature, oilPressure),
    lastUpdatedAt: new Date(now).toISOString(),
    sourceStatus: "SIMULATED",
  };
}

function initialSnapshot(): FleetSnapshot {
  const now = Date.now();
  return {
    vehicles: normalizeVehicles(fleetData, now),
    status: "SIMULATED",
    lastUpdatedAt: new Date(now).toISOString(),
    message: "Locally generated development data; no vehicle connection is configured.",
  };
}

export const demoFleetProvider: FleetDataProvider = {
  status: "SIMULATED",
  getInitialSnapshot: initialSnapshot,
  reset() {
    const snapshot = initialSnapshot();
    currentVehicles = snapshot.vehicles;
    for (const listener of listeners) listener(snapshot);
    return snapshot;
  },
  subscribe(listener) {
    listeners.add(listener);
    if (listeners.size === 1) timer = window.setInterval(() => {
      const now = Date.now();
      currentVehicles = currentVehicles.map((vehicle) => updateVehicle(vehicle, now));
      const snapshot = {
        vehicles: currentVehicles,
        status: "SIMULATED",
        lastUpdatedAt: new Date(now).toISOString(),
        message: "Locally generated development data; no vehicle connection is configured.",
      } satisfies FleetSnapshot;
      for (const subscriber of listeners) subscriber(snapshot);
    }, 3000);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
  },
};

let currentVehicles = initialSnapshot().vehicles;
const listeners = new Set<(snapshot: FleetSnapshot) => void>();
let timer: number | undefined;

export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
  return typeof lat === "number" && Number.isFinite(lat) && lat >= -90 && lat <= 90
    && typeof lng === "number" && Number.isFinite(lng) && lng >= -180 && lng <= 180;
}

export function getFreshnessStatus(status: DataSourceStatus, lastUpdatedAt: string | null | undefined, now = Date.now(), freshnessLimitMs = 30_000): DataSourceStatus {
  if (status !== "LIVE") return status;
  if (!lastUpdatedAt) return "UNAVAILABLE";
  const updatedAt = Date.parse(lastUpdatedAt);
  if (!Number.isFinite(updatedAt)) return "UNAVAILABLE";
  return now - updatedAt > freshnessLimitMs ? "STALE" : "LIVE";
}

export function isValidIncomingTelemetry(value: unknown): value is IncomingVehicleTelemetry {
  if (typeof value !== "object" || value === null) return false;
  const reading = value as Record<string, unknown>;
  if (typeof reading.id !== "string" || reading.id.trim().length === 0) return false;
  if (typeof reading.lastUpdatedAt !== "string" || !Number.isFinite(Date.parse(reading.lastUpdatedAt))) return false;
  if ((reading.lat == null) !== (reading.lng == null)) return false;
  if (reading.lat != null && !isValidCoordinate(reading.lat, reading.lng)) return false;
  const nonNegative = ["gpsAccuracyM", "speed", "temperature", "oilPressure", "rpm"];
  for (const field of nonNegative) {
    const readingValue = reading[field];
    if (readingValue !== undefined && readingValue !== null
      && (typeof readingValue !== "number" || !Number.isFinite(readingValue) || readingValue < 0)) return false;
  }
  if (reading.route !== undefined && reading.route !== null && typeof reading.route !== "string") return false;
  if (reading.ignitionOn !== undefined && reading.ignitionOn !== null && typeof reading.ignitionOn !== "boolean") return false;
  return true;
}
