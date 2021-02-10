import React, { useCallback } from "react";
import "./App.css";
import locationInfo from "./locationInfo.json";
import {
  GoogleMap,
  LoadScript,
  MarkerClusterer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
// import { GoogleMap, Marker } from "react-google-maps";
import { useState } from "react";
import { Table } from "antd";

function App() {
  // Online
  // const apiKeyCurrent = "AIzaSyCiu15D6oDo4x6Qp-PUiNWdU_CQgakYobg";
  // Local Test localhost:3000 in shoalter
  const apiKeyCurrent = "AIzaSyBkvOaGiMAwCNM7g2nNTKmS1o04hsdEKek";
  const apiKey = apiKeyCurrent;

  const [onLoad, setOnLoad] = useState(false);
  const [district, setDistrict] = useState("All");
  const [area, setArea] = useState("All");
  const [shopType, setShopType] = useState("All");
  const [restriction, setRestriction] = useState("All");
  const [center, setCenter] = useState({ lat: 22.3825179, lng: 114.1433533 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const mapStyles = {
    width: "100%",
    height: "500px",
  };

  const options = {
    styles: [
      {
        height: 53,
        url:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
        width: 53,
      },
      {
        height: 53,
        url:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
        width: 53,
      },
      {
        height: 56,
        url:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png",
        width: 56,
      },
      {
        height: 66,
        url:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
        width: 66,
      },
      {
        height: 78,
        url:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png",
        width: 78,
      },
    ],
  };

  let locations = [];
  let map_details = locationInfo.storeList.eng.details;
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
      map_details = map_details.filter((item) => item.acceptFrozen === "Y");
    }
    // case chill
    if (restriction === "chill") {
      map_details = map_details.filter((item) => item.acceptChill === "Y");
    }
  }

  // let latSum = 0;
  // let lngSum = 0;
  // let latAvg;
  // let lngAvg;

  for (let i = 0; i < map_details.length; i++) {
    locations.push({
      lat: map_details[i].geometry.coordinates[0],
      lng: map_details[i].geometry.coordinates[1],
      ...map_details[i],
      key: i.toString(),
    });
    // latSum += map_details[i].geometry.coordinates[0];
    // lngSum += map_details[i].geometry.coordinates[1];
    // latAvg = latSum / map_details.length;
    // lngAvg = lngSum / map_details.length;
  }

  const createKey = (location) => {
    return location.lat + location.lng;
  };

  // const handleCenterChange = (e) => {
  //   let latSum = 0;
  //   let lngSum = 0;
  //   let latAvg;
  //   let lngAvg;
  //   let map_details = locationInfo.storeList.eng.details;
  //   if (area !== "All") {
  //     map_details = map_details.filter((item) => item.area === area);
  //   } else if (district !== "All") {
  //     map_details = map_details.filter((item) => item.district === district);
  //   }

  //   if (shopType !== "All") {
  //     map_details = map_details.filter((item) => item.category === shopType);
  //   }

  //   if (restriction !== "All") {
  //     // case frozen
  //     if (restriction === "frozen") {
  //       map_details = map_details.filter((item) => item.acceptFrozen === "Y");
  //     }
  //     // case chill
  //     if (restriction === "chill") {
  //       map_details = map_details.filter((item) => item.acceptChill === "Y");
  //     }
  //   }

  //   // for (let i = 0; i < map_details.length; i++) {
  //   //   latSum += map_details[i].geometry.coordinates[0];
  //   //   lngSum += map_details[i].geometry.coordinates[1];
  //   //   latAvg = latSum / map_details.length;
  //   //   lngAvg = lngSum / map_details.length;
  //   // }

  //   // setCenter({ lat: latAvg, lng: lngAvg });

  //   // setCenter({
  //   //   lat: latAvg,
  //   //   lng: lngAvg,
  //   // });
  //   // latAvg = 0;
  //   // lngAvg = 0;
  // };

  const handleDistrictChange = useCallback(function callback(e) {
    setOnLoad(true);
    setDistrict(e.target.value);
    setArea("All");
    // handleCenterChange();
    setTimeout(() => {
      setOnLoad(false);
    }, 0.3);
  }, []);

  const handleAreaChange = useCallback(function callback(e) {
    setOnLoad(true);
    setArea(e.target.value);
    // handleCenterChange();
    setTimeout(() => {
      setOnLoad(false);
    }, 0.3);
  }, []);

  const handleShopTypeChange = useCallback(function callback(e) {
    setOnLoad(true);
    setShopType(e.target.value);
    // handleCenterChange();
    setTimeout(() => {
      setOnLoad(false);
    }, 0.3);
  }, []);
  const handleRestrictionChange = useCallback(function callback(e) {
    setOnLoad(true);
    setRestriction(e.target.value);
    // handleCenterChange();
    setTimeout(() => {
      setOnLoad(false);
    }, 0.3);
  }, []);
  const handleReset = useCallback(function callback(e) {
    e.preventDefault();
    setOnLoad(true);
    setDistrict("All");
    setArea("All");
    setShopType("All");
    setRestriction("All");
    // handleCenterChange();
    setTimeout(() => {
      setOnLoad(false);
    }, 0.3);
  }, []);

  const columns = [
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: "10%",
    },
    {
      title: "Shop",
      dataIndex: "shop",
      key: "shop",
      width: "30%",
    },
    {
      title: "Opening",
      dataIndex: "opening",
      key: "opening",
      width: "30%",
    },
    {
      title: "Accept Frozen Items",
      dataIndex: "acceptFrozen",
      key: "acceptFrozen",
      render: (item) => (
        <span>{item === "Y" ? <span>✔</span> : <span>✖</span>}</span>
      ),
      width: "15%",
    },
    {
      title: "Accept Chill Items",
      dataIndex: "acceptChill",
      key: "acceptChill",
      render: (item) => (
        <span>{item === "Y" ? <span>✔</span> : <span>✖</span>}</span>
      ),
      width: "15%",
    },
  ];

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
      <div className="googleMapWrapper">
        <LoadScript className="googleMap" googleMapsApiKey={apiKey}>
          <GoogleMap mapContainerStyle={mapStyles} zoom={11} center={center}>
            {isLoaded && !onLoad && (
              <MarkerClusterer
                averageCenter
                enableRetinaIcons
                gridSize={60}
                options={options}
              >
                {(clusterer) =>
                  locations.map((location) => (
                    <div>
                      {console.log("clusterer:", clusterer)}
                      <Marker
                        key={createKey(location)}
                        position={location}
                        clusterer={clusterer}
                      />
                    </div>
                  ))
                }
              </MarkerClusterer>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
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
      ;
    </div>
  );
}

export default App;
