const map = L.map('map').setView([42.926, 74.601], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap участники',
}).addTo(map);

function addShopMarker(lat, lon, text) {
  let direction = 0;
  const dirs = ['up', 'right', 'down', 'left'];
  let marker = createMarker(lat, lon, text, direction);
  marker.addTo(map);

  function createMarker(lat, lon, text, dirIndex) {
    // Создаём обёртку и содержимое
    const wrapper = document.createElement('div');
    wrapper.className = `shop-marker marker-${dirs[dirIndex]}`;

    const label = document.createElement('div');
    label.className = 'label-text';
    label.textContent = text;

    const triangle = document.createElement('div');
    triangle.className = 'triangle';

    // Управляемый порядок
    if (dirs[dirIndex] === 'left') {
      wrapper.append(triangle, label); // стрелка слева
    } else if (dirs[dirIndex] === 'right') {
      wrapper.append(label, triangle); // стрелка справа
    } else {
      wrapper.append(label, triangle); // верх/низ — стандартно
    }


    // Слушаем ПКМ
    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      map.removeLayer(marker);
      direction = (direction + 1) % 4;
      marker = createMarker(lat, lon, text, direction);
      marker.addTo(map);
    });

    // Временно добавляем в DOM, чтобы измерить размер
    wrapper.style.position = 'absolute';
    wrapper.style.visibility = 'hidden';
    document.body.appendChild(wrapper);
    const { width, height } = wrapper.getBoundingClientRect();
    document.body.removeChild(wrapper);
    wrapper.style.position = '';
    wrapper.style.visibility = '';

    // Вычисляем iconAnchor в зависимости от направления
    const anchorMap = {
      up:    [ width / 2, height ],
      down:  [ width / 2, 0      ],
      right: [ 0,           height / 2 ],
      left:  [ width,       height / 2 ],
    };
    const anchor = anchorMap[dirs[dirIndex]];

    // Создаём DivIcon
    const icon = L.divIcon({
      html: wrapper,
      className: '',
      iconSize: [ width, height ],
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

