import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as geojson from "../PointsData.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFtb2w5OCIsImEiOiJjbGpjc2RxYjIyNXExM2pxeDF1eHQ0YTRoIn0.uS2VanLqC_a7Gh1ZB6qwJQ";
export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v8",
      projection: "globe",
      zoom: zoom,
    });
    map.current.on("style.load", () => {
      map.current.setFog({
        color: "rgb(186, 210, 235)", // Lower atmosphere
        "high-color": "rgb(36, 92, 223)", // Upper atmosphere
        "horizon-blend": 0.002, // Atmosphere thickness (default 0.2 at low zooms)
        "space-color": "rgb(11, 11, 25)", // Background color
        "star-intensity": 0.4, // Background star brightness (default 0.35 at low zoooms )
      });
    });

    map.current.on("load", () => {
      for (const feature of geojson.features) {
        // create a HTML element for each feature

        const el = document.createElement("div");
        el.className = "marker";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 30, closeButton: false }) // add popups
              .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
              )
          )
          .addTo(map.current);
        el.addEventListener("click", (e) => {
          map.current.flyTo({
            center: feature.geometry.coordinates,
            zoom: 4,
          });
        });
      }
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container"></div>
    </div>
  );
}
