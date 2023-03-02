import { useState , useRef } from "react";
import osmtogeojson from "osmtogeojson";
import axios from "axios";
import { MapContainer, GeoJSON, useMap, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

const Geo = () => {
    const minX = useRef(null);
    const minY = useRef(null);
    const maxX = useRef(null);
    const maxY = useRef(null);
    const [data, setData] = useState();
    const fetchData = () => {
        axios.get(`https://api.openstreetmap.org/api/0.6/map.json?bbox=${minX.current.value},${minY.current.value},${maxX.current.value},${maxY.current.value}`)
            .then((response) => {
                let result = osmtogeojson(response.data);
                setData(result);
            });
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="Type minX" value='76.36808519471933' ref={minX}/>
                <input type="text" placeholder="Type minY" value='64.41713173392363' ref={minY}/>
                <input type="text" placeholder="Type maxX" value='76.75875957883649' ref={maxX}/>
                <input type="text" placeholder="Type maxY" value='64.50167155517451' ref={maxY}/>
            </div>
            <div>
                <input type="button" value="Fetch Data" onClick={fetchData} />
            </div>
            <div style={{width: '800px', height: '600px'}}>
                <MapContainer
                    doubleClickZoom={false}
                    id="mapId"
                    zoom={5}
                    center={[67.0166015625, 26.31311263768267]}
                >
                    <MyData data={data} />
                    <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
      />
                </MapContainer>
            </div>
        </div>
    );
}
const MyData = ({ data }) => {
    const map = useMap();

    if (data) {
        const geojsonObject = L.geoJSON(data);
        map.fitBounds(geojsonObject.getBounds());
        return <GeoJSON data={data} />;
    } else {
        return null;
    }
};

export default Geo;