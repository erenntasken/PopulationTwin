import LayerGroup from "ol/layer/Group.js";
import OSM from 'ol/source/OSM.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import VectorSource from "ol/source/Vector.js";
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js'
import TileLayer from "ol/layer/Tile.js";
import XYZ from 'ol/source/XYZ.js';
import Overlay from 'ol/Overlay.js';

import { drawShapesOnMap } from "./buildingStyle";

const pathOfMap = './data/map2.geojson';


const map = createMap();
const buildingsGeoJSON = loadGeoJSON(pathOfMap);

map.addLayer(buildingsGeoJSON);
drawShapesOnMap(buildingsGeoJSON)
setPopup(map);

function createMap(){
    const map = new Map({
        view : new View({
            center: [3245075.5956414873, 5008280.403576283],
            zoom: 17,
            maxZoom: 20
        }),
        target: 'js-map'
    });

    const standartLayer = new TileLayer({ // kontrol , Tile idi
        source: new OSM(),
        visible: true,
        zIndex: 1,
        title: "OSMStandard"
    });

    
    const humaniterianLayer = new TileLayer({
        source: new OSM({
          url: ' https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        zIndex: 1,
        title: "OSMHumanitarian"
    });

    const key = '0GaezYjFLpwM2dMexGjy';
    const roadLayer = new TileLayer({
        source: new XYZ({
          url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZRoad",
    });

    const aerialLayer = new TileLayer({
        source: new XYZ({
          url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        }),
        visible: false,
        zIndex: 1,
        title: "XYZAeriel",
    });

    const baseLayerGroup = new LayerGroup({ // test et bozulabilir. Degisik isimlendirme oldu node paketinde
      layers: [ standartLayer, humaniterianLayer, roadLayer, aerialLayer]
    });


    let baseLayerElement = document.getElementById("maps")
    baseLayerElement.addEventListener('change',function(){
        let baseLayerElementValue = this.value;
        baseLayerGroup.getLayers().forEach(function(element){
          let baseLayerTitle = element.get('title');
          element.setVisible(baseLayerTitle === baseLayerElementValue);
        })
      })
    
    map.on('click',function(e){
        console.log(e.coordinate)
    });

    map.addLayer(baseLayerGroup);

    return map;
}

function loadGeoJSON(path){
    const buildingsGeoJSON = new VectorImageLayer({
        source: new VectorSource({
            url: path,
            format: new GeoJSON()
        }),
        opacity: 0.8,
        visible: true,
        zIndex: 1,
        title: 'buildingsGeoJSON',
    });
    return buildingsGeoJSON;
}

function setPopup(map){
    let container = document.getElementById('popup');
    let content = document.getElementById('popup-content');
    let closer = document.getElementById('popup-closer');
    
    let overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlay)

    map.on('click', (e)=>{
      map.forEachFeatureAtPixel(e.pixel, feature=>{
        console.log(feature.values_);

        infoTxt = `<p>`
        for (var key in feature.values_){
          if(key == "geometry"){
            continue;
          }
          infoTxt = infoTxt + `${key}: ${feature.values_[key]}<br>`;
        }
        infoTxt = infoTxt + `</p><code>`;

        content.innerHTML = infoTxt;
        overlay.setPosition(e.coordinate);
      });
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
}
