import React from "react";
import locationInfo from "./locationInfo.json";
import "./App.css";
import { Table } from "antd";
import { useState } from "react";

const fetch = require("isomorphic-fetch");
const { compose, withProps, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const {
  MarkerClusterer,
} = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBkvOaGiMAwCNM7g2nNTKmS1o04hsdEKek&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={11}
    defaultCenter={{ lat: 22.3825179, lng: 114.1433533 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map((marker, index) => (
        <Marker
          key={`${marker.photo_id}${index}`}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));

function App() {
  let locations = [];
  let map_details = locationInfo.storeList.eng.details;
  const [district, setDistrict] = useState("All");
  const [area, setArea] = useState("All");
  const [shopType, setShopType] = useState("All");
  const [restriction, setRestriction] = useState("All");

  const columns = [
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Shop",
      dataIndex: "shop",
      key: "shop",
    },
    {
      title: "Opening",
      dataIndex: "opening",
      key: "opening",
    },
    {
      title: "Accept Frozen Items",
      dataIndex: "acceptFrozen",
      key: "acceptFrozen",
      render: (item) => (
        <span>{item === "Y" ? <span>✔</span> : <span>✖</span>}</span>
      ),
    },
    {
      title: "Accept Chill Items",
      dataIndex: "acceptChill",
      key: "acceptChill",
      render: (item) => (
        <span>{item === "Y" ? <span>✔</span> : <span>✖</span>}</span>
      ),
    },
  ];

  if (area !== "All") {
    map_details = map_details.filter((item) => item.area === area);
  } else if (district !== "All") {
    map_details = map_details.filter((item) => item.district === district);
  }

  if (shopType !== "All") {
    map_details = map_details.filter((item) => item.category === shopType);
  }

  if (restriction !== "All") {
    // case frozen
    if (restriction === "frozen") {
      console.log("frozen");
      map_details = map_details.filter((item) => item.acceptFrozen === "Y");
    }
    // case chill
    if (restriction === "chill") {
      console.log("chill");
      map_details = map_details.filter((item) => item.acceptChill === "Y");
    }
  }

  for (let i = 0; i < map_details.length; i++) {
    locations.push({
      latitude: map_details[i].geometry.coordinates[0],
      longitude: map_details[i].geometry.coordinates[1],
      ...map_details[i],
      key: i.toString(),
    });
  }

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };

  const handleShopTypeChange = (e) => {
    setShopType(e.target.value);
  };
  const handleRestrictionChange = (e) => {
    setRestriction(e.target.value);
  };
  const handleReset = (e) => {
    e.preventDefault();
    console.log(">>>here");
    setDistrict("All");
    setArea("All");
    setShopType("All");
    setRestriction("All");
  };

  return (
    <div className="app">
      <div className="app__inputWrapper">
        {/* districts */}
        <select value={district} onChange={(e) => handleDistrictChange(e)}>
          <option value="All">All Districts</option>
          <option value="Kowloon">Kowloon</option>
          <option value="Hong Kong Island">Hong Kong Island</option>
          <option value="New Territories">New Territories</option>
        </select>
        {/* Areas */}
        <select value={area} onChange={(e) => handleAreaChange(e)}>
          <option value="All">All Areas</option>
          {district !== "All" &&
            locationInfo.storeList.eng.areaList[district].map((item) => (
              <option key={`areas${item}`} value={item}>
                {item}
              </option>
            ))}
        </select>
        {/* Shop Type */}
        <select value={shopType} onChange={(e) => handleShopTypeChange(e)}>
          <option value="All">All Shop Types</option>
          <option value="O2O Shop">O2O Shop</option>
          <option value="Pick-up Service Partner">
            Pick-up Service Partner
          </option>
          <option value="e-locker">e-locker</option>
        </select>
        <select
          value={restriction}
          onChange={(e) => handleRestrictionChange(e)}
        >
          <option value="All">No Item Restrictions</option>
          <option value="frozen">Accept Frozen Items</option>
          <option value="chill">Accept Chill Items</option>
        </select>
        <button onClick={(e) => handleReset(e)}>Reset</button>
      </div>
      <MapWithAMarkerClusterer markers={locations} />
      <Table
        className="tableCSS"
        dataSource={locations}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 5,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}

export default App;
