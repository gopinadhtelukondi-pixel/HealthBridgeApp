import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useApp } from "@/context/AppContext";
import { getMapPoints } from "@/services/api";

const FILTER_BTNS = ["All", "Hospitals", "Doctors", "Emergency"];
const FILTER_MAP = {
  All: null,
  Hospitals: "hospital",
  Doctors: "doctor",
  Emergency: "emergency",
};

const iconColors = {
  hospital: "#c0392b",
  doctor: "#0a84ff",
  emergency: "#ff6b35",
};

const buildIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<span style="background:${color};border:2px solid white;border-radius:50%;display:inline-block;height:18px;width:18px;box-shadow:0 0 8px rgba(0,0,0,0.15);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);
  return null;
}

export function GISMap() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [points, setPoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { addToast } = useApp();

  useEffect(() => {
    getMapPoints().then(setPoints).catch((err) => addToast(err.message || "Failed to load map points", "error"));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  }, []);

  const visibleType = FILTER_MAP[activeFilter];
  const filteredPoints = useMemo(
    () => points.filter((point) => !visibleType || point.type === visibleType),
    [points, visibleType]
  );

  const activeEmergencyPoints = useMemo(
    () => points.filter((point) => point.type === "emergency"),
    [points]
  );

  const defaultCenter = [16.515, 80.631];
  const mapCenter = userLocation || defaultCenter;

  const nearestHospitals = useMemo(() => {
    if (!userLocation) return points.filter((p) => p.type === "hospital").slice(0, 5);
    const [userLat, userLng] = userLocation;
    const copy = [...points];
    return copy
      .filter((point) => point.type === "hospital")
      .map((point) => {
        const dLat = (point.lat - userLat) * Math.PI / 180;
        const dLng = (point.lng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLat * Math.PI / 180) * Math.cos(point.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...point, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [points, userLocation]);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-line-light flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-[16px] text-primary">Healthcare GIS Map</h3>
          <p className="text-sm text-ink-muted">Leaflet-powered hospital and emergency coverage map with nearby intelligence.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTER_BTNS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                activeFilter === f ? "bg-primary text-white" : "border-line text-ink-muted hover:bg-slate-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_360px] gap-0">
        <div className="h-[640px] bg-slate-100">
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false}
          >
            <ZoomControl position="topright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
              <>
                <Marker position={userLocation} icon={buildIcon("#2563eb")}>
                  <Popup>Your location</Popup>
                </Marker>
                <Circle center={userLocation} radius={2500} pathOptions={{ color: "#2563eb", opacity: 0.25, fillOpacity: 0.08 }} />
              </>
            )}

            {activeEmergencyPoints.map((point) => (
              <Circle
                key={`radius-${point.id}`}
                center={[point.lat, point.lng]}
                radius={3500}
                pathOptions={{ color: "#ff6b35", dashArray: "6 10", opacity: 0.35, fillOpacity: 0.05 }}
              />
            ))}

            {filteredPoints.map((point) => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={buildIcon(iconColors[point.type] || "#6b7280")}
              >
                <Popup>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">{point.name}</div>
                    <div className="text-ink-muted">{point.description}</div>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-700">
                      <span className="px-2 py-1 bg-slate-100 rounded">{point.type}</span>
                      <span className="px-2 py-1 bg-slate-100 rounded">{point.rating} ★</span>
                      {point.beds ? <span className="px-2 py-1 bg-slate-100 rounded">{point.beds} beds</span> : null}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            <RecenterMap position={mapCenter} />
          </MapContainer>
        </div>

        <aside className="p-5 border-l border-line-light bg-white">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Map insights</p>
            <h4 className="font-semibold text-lg text-ink mt-2">Emergency coverage & density</h4>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-line p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Current center</p>
              <p className="mt-2 text-sm text-ink">{userLocation ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}` : "Default Vijayawada view"}</p>
            </div>

            <div className="rounded-3xl border border-line p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Nearby hospitals</p>
              <div className="mt-3 space-y-3">
                {nearestHospitals.map((point) => (
                  <div key={point.id} className="rounded-2xl bg-white p-3 border border-line">
                    <p className="text-sm font-semibold text-ink">{point.name}</p>
                    <p className="text-xs text-ink-muted">{point.beds ? `${point.beds} beds` : "Clinic"} · {point.rating} ★</p>
                    {point.distance != null && (
                      <p className="text-xs text-ink-mid mt-1">{point.distance.toFixed(1)} km away</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Emergency facilities</p>
              <div className="mt-3 space-y-3">
                {activeEmergencyPoints.map((point) => (
                  <div key={point.id} className="rounded-2xl bg-white p-3 border border-red-100">
                    <p className="text-sm font-semibold text-ink">{point.name}</p>
                    <p className="text-xs text-red-700">Emergency radius: 3.5 km</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

