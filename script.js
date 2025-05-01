const map = L.map('map').setView([42.926, 74.601], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap участники',
}).addTo(map);

function addShopMarker(lat, lon, text) {
  const dirs = ['up', 'right', 'down', 'left'];

  // Загружаем направление из localStorage, если есть
  const savedDirection = localStorage.getItem(`marker-dir-${text}`);
  let direction = savedDirection ? parseInt(savedDirection) : 0;

  let marker = createMarker(lat, lon, text, direction);
  marker.addTo(map);

  function createMarker(lat, lon, text, dirIndex) {
    const wrapper = document.createElement('div');
    wrapper.className = `shop-marker marker-${dirs[dirIndex]}`;

    const label = document.createElement('div');
    label.className = 'label-text';
    label.textContent = text;

    const triangle = document.createElement('div');
    triangle.className = 'triangle';

    // Порядок элементов
    if (dirs[dirIndex] === 'left') {
      wrapper.append(triangle, label);
    } else if (dirs[dirIndex] === 'right') {
      wrapper.append(label, triangle);
    } else {
      wrapper.append(label, triangle);
    }

    // Слушаем ПКМ — меняем направление и сохраняем
    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      map.removeLayer(marker);
      direction = (direction + 1) % 4;

      // Сохраняем новое значение
      localStorage.setItem(`marker-dir-${text}`, direction);

      marker = createMarker(lat, lon, text, direction);
      marker.addTo(map);
    });

    // Вычисляем размеры
    wrapper.style.position = 'absolute';
    wrapper.style.visibility = 'hidden';
    document.body.appendChild(wrapper);
    const { width, height } = wrapper.getBoundingClientRect();
    document.body.removeChild(wrapper);

    const anchorMap = {
      up:    [width / 2, height],
      down:  [width / 2, 0],
      right: [0, height / 2],
      left:  [width, height / 2],
    };
    const anchor = anchorMap[dirs[dirIndex]];

    const icon = L.divIcon({
      html: wrapper,
      className: '',
      iconSize: [width, height],
      iconAnchor: anchor
    });

    return L.marker([lat, lon], { icon });
  }
}


// Все магазины
addShopMarker(42.915532, 74.590593, 'Улан');
addShopMarker(42.916844, 74.590007, 'Бермет');
addShopMarker(42.932802, 74.597648, 'Мадина');
addShopMarker(42.932875, 74.601755, 'Данек');
addShopMarker(42.935660, 74.602599, 'Эки-Таксыр');
addShopMarker(42.936371, 74.602587, 'Бакыт');
addShopMarker(42.936658, 74.602665, 'Малика');
addShopMarker(42.938149, 74.602337, 'Изобилие');
addShopMarker(42.926627, 74.602338, 'Бекмырза');
addShopMarker(42.926394, 74.601607, 'Алия');
addShopMarker(42.923612, 74.601835, 'Бегимай');
addShopMarker(42.919181, 74.600906, 'Аман Эсен');
addShopMarker(42.917486, 74.601318, 'Кок Бел');
addShopMarker(42.917465, 74.600922, 'Лимон');
addShopMarker(42.924070, 74.608577, 'Бекзат');
addShopMarker(42.929405, 74.602156, 'Шекер');

