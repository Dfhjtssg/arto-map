const map = L.map('map', {
  zoomControl: false
}).setView([42.832991, 74.604317], 14); // стартовый центр

L.control.zoom({
  position: 'topright'
}).addTo(map);

L.tileLayer('https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1', {
  attribution: '&copy; OpenStreetMap участники',
}).addTo(map);

// 👉 функция: центр по меткам
function getCenterOfMarkers(markers) {
  if (!markers.length) return null;

  let sumLat = 0;
  let sumLon = 0;

  for (const [lat, lon] of markers) {
    sumLat += lat;
    sumLon += lon;
  }

  const centerLat = sumLat / markers.length;
  const centerLon = sumLon / markers.length;

  return [centerLat, centerLon];
}

function addShopMarker(lat, lon, text, initialDirection = 'up') {
  const dirs = ['up', 'right', 'down', 'left'];
  let directionIndex = dirs.indexOf(initialDirection);
  if (directionIndex === -1) directionIndex = 0;

  let marker = createMarker(lat, lon, text, dirs[directionIndex]);
  marker.addTo(map);

  function createMarker(lat, lon, text, direction) {
    const wrapper = document.createElement('div');
    wrapper.className = `shop-marker marker-${direction}`;

    const label = document.createElement('div');
    label.className = 'label-text';
    label.textContent = text;

    const triangle = document.createElement('div');
    triangle.className = 'triangle';

    if (direction === 'left') {
      wrapper.append(triangle, label);
    } else {
      wrapper.append(label, triangle);
    }

    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      map.removeLayer(marker);
      directionIndex = (directionIndex + 1) % dirs.length;
      marker = createMarker(lat, lon, text, dirs[directionIndex]);
      marker.addTo(map);
    });

    wrapper.style.position = 'absolute';
    wrapper.style.visibility = 'hidden';
    document.body.appendChild(wrapper);
    const { width, height } = wrapper.getBoundingClientRect();
    document.body.removeChild(wrapper);
    wrapper.style.position = '';
    wrapper.style.visibility = '';

    const anchorMap = {
      up:    [ width / 2, height ],
      down:  [ width / 2, 0 ],
      right: [ 0, height / 2 ],
      left:  [ width, height / 2 ]
    };

    const icon = L.divIcon({
      html: wrapper,
      className: '',
      iconSize: [ width, height ],
      iconAnchor: anchorMap[direction]
    });

    return L.marker([lat, lon], { icon });
  }
}

// 📌 Поддержка параметра m=lat,lon,text,side;lat,lon,text,side...
const m = new URLSearchParams(window.location.search).get('m');

if (m) {
  try {
    const entries = m.split(';');
    const coords = []; // для вычисления центра

    for (const entry of entries) {
      const parts = entry.split(',');

      if (parts.length < 4) continue;

      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      const side = parts.pop();
      const text = decodeURIComponent(parts.slice(2).join(','));

      if (!isNaN(lat) && !isNaN(lon) && side) {
        addShopMarker(lat, lon, text, side);
        coords.push([lat, lon]); // добавляем координаты
      }
    }

    // 👉 центрируем карту на общий центр всех меток
    const center = getCenterOfMarkers(coords);
    if (center) {
      map.setView(center, 15); // можешь изменить зум
    }

  } catch (e) {
    console.error('Ошибка разбора параметра m:', e);
  }
}
