import React, { useRef } from "react";
import { useGoogleMap, useMap } from "./hook";
const API_KEY =
  "AIzaSyCiu15D6oDo4x6Qp-PUiNWdU_CQgakYobgAIzaSyCmeCDLj1uvr97KxjUiaade1zfeya02Uog";

const initialConfig = {
  zoom: 12,
};
// hookを利用して表示するコンポーネント
const Gmap = () => {
  const googleMap = useGoogleMap(API_KEY);
  const mapContainerRef = useRef(null);
  useMap({ googleMap, mapContainerRef, initialConfig });
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
      ref={mapContainerRef}
    />
  );
};

export default Gmap;
