window.onload = init;

const pathOfMap = './data/map2.geojson';

function init(){
    const map = createMap();
    const buildingsGeoJSON = loadGeoJSON(pathOfMap);
    map.addLayer(buildingsGeoJSON);
    drawShapesOnMap(buildingsGeoJSON);
    setPopup(map);
}

function createMap(){
    const map = new ol.Map({
        view : new ol.View({
            center: [3245075.5956414873, 5008280.403576283],
            zoom: 17,
            maxZoom: 20
        }),
        target: 'js-map'
    });

    const standartLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        zIndex: 1,
        title: "StandartLayer"
    });

    
    const humaniterianLayer = new ol.layer.Tile({
        source: new ol.source.OSM({
          url: ' https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        zIndex: 1,
        title: "HumaiterianLayer"
    });

    const baseLayerGroup = new ol.layer.Group({
      layers: [ standartLayer, humaniterianLayer]
    });

    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    console.log(baseLayerElements);
    for(let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change',function(){
        let baseLayerElementValue = this.values;
        baseLayerGroup.getLayers().forEach(function(element,index,array){
          let baseLayerTitle = element.get('title');
          element.setVisible(baseLayerTitle === baseLayerElementValue);
          console.log(baseLayerTitle+" "+baseLayerElementValue);
        })
      })
    }
    map.on('click',function(e){
        console.log(e.coordinate)
    });

    map.addLayer(baseLayerGroup);

    return map;
}

function loadGeoJSON(path){
    const buildingsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: path,
            format: new ol.format.GeoJSON()
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
    
    let overlay = new ol.Overlay({
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