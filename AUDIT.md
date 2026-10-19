# Smart Fleet functional audit

## Page and data-source audit

| Page/component | Current behavior | Missing or broken behavior | Improvement made | Data source required | Files likely changed |
|---|---|---|---|---|---|
| Dashboard | Shared fleet KPIs, alerts, telemetry chart, vehicle selection, feed demo, selected vehicle map, incident snapshot, reset | Telemetry chart and feed panels are demonstrations; no live event history or GPS provider | Provider status and timestamps now come from shared snapshot; marker selection uses shared state and reusable Fleet Map | Authenticated vehicle gateway; approved incident source; map tile service | `Dashboard.tsx`, `fleetProvider.ts`, `useFleetSimulation.ts`, `FleetMap.tsx` |
| Fleet | Search through shared topbar, status totals, telemetry table, detail modal | No pagination (seven demo vehicles do not need it) | Added current-status filter, sort-field selection, and direction toggle; centralized diagnostic status remains | Fleet telemetry provider | `Fleet.tsx`, `App.tsx`, `diagnostics.ts` |
| Fleet Map | Leaflet vehicle markers and popups | Previously no search/filter or explicit map controls; invalid coordinates not rejected | Added coordinate validation, vehicle/route search, status filter, zoom, selected center, fit, default view, popup details, tile-error state | Valid GPS stream; tile provider suitable for deployment scale | `FleetMap.tsx`, `fleetProvider.ts`, `FleetMapPage.tsx` |
| Traffic | Fleet-derived zone estimates and fixed trend sample | No real traffic provider; historical samples are not current observations | Existing sample is labeled as demonstration; zone calculations remain locally derived | Authorized traffic provider/API | `Traffic.tsx`, `traffic.ts` |
| Security | Simulated locations and diagnostic status with demo geofence labels | No actual trackers, geofence crossing, or access/security event source | Existing demo explanation retained; no false enforcement claims added | Authenticated tracking/security provider | `Security.tsx` |
| Accidents | Risk heuristic using speed and diagnostic warnings | No accident detection/records, impact or braking sensors | Existing heuristic remains clearly distinct from verified incidents and uses shared warning thresholds | Authorized incident/collision source | `Accidents.tsx`, `diagnostics.ts` |
| Parking | Simulated stop timer based on speed and duration | No parking-space coordinates, occupancy, or arrival/departure records; area labels are not parking locations | Reframed as stop monitoring; explicitly marks parking records unavailable and avoids claiming parked status | Configured/imported parking dataset or authorized parking-event provider | `Parking.tsx`, `fleetProvider.ts`, `README.md` |
| Road Risk | Fixed demo moisture inputs and simulated mean-speed index | No road sensors, weather, engineering, or hazard provider | Existing formula and demo limitations retained | Road/weather data provider with documented units and freshness | `RoadRisk.tsx` |
| Reports | Four CSV report downloads based on current shared fleet and derived traffic | No range selection; no live source; exports are snapshots | CSV headers start on first row and include generation timestamp; risk thresholds share diagnostics | Shared provider and any requested period filters | `Reports.tsx`, `diagnostics.ts` |
| Shared app/topbar | Nine sidebar buttons, global search, source badge, notifications button, lazy pages | Notification button had no meaningful action; no data-provider boundary or error fallback | Notification button opens Dashboard alert overview; added data source interface, status timestamp, error boundary | Provider-specific source | `App.tsx`, `Topbar.tsx`, `fleetProvider.ts`, `fleet.ts` |

## Visible control inventory

| Component/control | Expected behavior | Current behavior after this pass | Verification |
|---|---|---|---|
| Sidebar navigation | Open selected page | Preserved; active-page state is retained | Build verified; browser unavailable |
| Global search | Case-insensitive vehicle/route/location filtering | Shared across pages; folds repeated whitespace | Build verified; browser unavailable |
| Dashboard quick links | Open Fleet Map or Reports | Changes active page | Build verified; browser unavailable |
| Dashboard vehicle rows | Select matching vehicle | Updates shared selected-vehicle details/map | Build verified; browser unavailable |
| Demo feed arrows | Move among three illustrative feeds | Updates the active feed | Build verified; browser unavailable |
| Incident filters | Filter by all/critical/warning/healthy | Filters the current telemetry snapshot | Build verified; browser unavailable |
| Reset Simulation | Restore demo telemetry and positions after confirmation | Resets provider state and keeps the single provider subscription alive | Build verified; browser unavailable |
| Map search/status controls | Filter visible valid-coordinate markers | Filters by ID/route and diagnostic status | Build verified; browser unavailable |
| Map zoom/selected/fit/default controls | Change map viewport | Connected to Leaflet map methods | Build verified; browser unavailable |
| Map marker and popup | Select/open vehicle details | Updates selected vehicle and opens details action | Build verified; browser unavailable |
| Topbar alert button | Navigate to alert overview | Opens Dashboard | Build verified; browser unavailable |
| Fleet Details | Open vehicle modal | Preserved | Build verified; browser unavailable |
| Fleet status/sort controls | Filter current rows by diagnostic status; sort by vehicle, route, location, or telemetry value | Implemented in Fleet page; counts remain the overall currently searched fleet | Build verified; browser unavailable |
| CSV buttons | Download valid report snapshot | Downloads CSV with header row and `generated_at` | Source inspection only; no browser download test |
| Other pages | Display current page-specific monitoring/calculations | No extra controls existed in inspected source; demo/heuristic scope is labeled | Build verified; browser unavailable |

## Data and integration audit

- No backend, database, credentials, environment configuration, GPS gateway, traffic API, incident provider, security integration, parking dataset, or camera service is present in the repository.
- `src/data/fleetData.ts` holds the demo coordinates, route labels, and initial telemetry. Coordinates are latitude/longitude in the correct Leaflet `[lat, lng]` order, but are illustrative and unverified for operational use.
- The `demoFleetProvider` is the only connected provider. It emits `SIMULATED` status and timestamps. It locally perturbs demo telemetry and positions; that behavior must not be reused as a live provider.
- Incoming live telemetry has a typed boundary and validation helper. `getFreshnessStatus` supports `LIVE` to `STALE` resolution for a future adapter. No live adapter has been implemented or tested.
- Parking space occupancy is unavailable. A stopped vehicle is explicitly not treated as a confirmed parked vehicle.
- The map uses Leaflet and standard OpenStreetMap raster tiles with linked attribution. OSM tile availability is best-effort, has no SLA, and requires policy compliance; use a contracted provider or self-hosted tiles for production scale. See the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/).
