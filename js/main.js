const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=59.9&lon=30.3&appid=696e0165a8519d9d732e3bc2be82fcb5&units=metric&cnt=6&lang=ru';
const temperatureUnit = '°';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

let currentData;

async function getData() {
    let response = await fetch(url);
    if (response.ok) {
        let jsonData = await response.json();
        return jsonData;
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function convertPressure(value) {
    return (value / 1.33).toFixed();
}

Number.prototype.pad = function (size) {
    let numStr = String(this);
    while (numStr.length < (size || 2)) {
        numStr = '0' + numStr;
    }
    return numStr;
}

function getHoursString(dateTime) {
    let date = new Date(dateTime.replace(" ", "T"));
    let hours = date.getHours().pad();
    return hours;
}

function getValueWithUnit(value, unit) {
    return `${value}${unit}`;
}

function getTemperature(value) {
    let temperature = value.toFixed();
    return getValueWithUnit(temperature, temperatureUnit);
}

function render(data) {
    renderCity(data);
    renderCurrentTemperature(data);
    renderCurrentDescription(data);
    renderForecast(data);
    renderDetails(data);
    renderDayOrNigth(data);
}

function renderCity(data) {
    const city = document.querySelector('.current__city');
    city.textContent = data.city.name;
}

function renderCurrentTemperature(data) {
    const currentTemperature = document.querySelector('.current__temperature');
    currentTemperature.textContent = getTemperature(data.list[0].main.temp);
}

function renderCurrentDescription(data) {
    const currentDescription = document.querySelector('.current__description');
    currentDescription.textContent = data.list[0].weather[0].description;
}

function renderForecast(data) {
    const forecastContainer = document.querySelector('.forecast');
    let forecast = '';
    for (let i = 0; i < 6; i++) {
        let item = data.list[i];
        let temperature = getTemperature(item.main.temp);
        let icon = item.weather[0].icon;
        let hours = (i == 0 ? 'Сейчас' : getHoursString(`${item.dt_txt}`));
        forecast += `<div class="forecast__item">
        <div class="forecast__time">${hours}</div>
        <div class="forecast__icon icon__${icon}"></div>
        <div class="forecast__temperature">${temperature}</div>
      </div>`
    }
    forecastContainer.innerHTML = forecast;
}

function renderDetails(data) {
    let item = data.list[0];
    let feelslike = getTemperature(item.main.feels_like);
    let pressure = getValueWithUnit(convertPressure(item.main.pressure), pressureUnit);
    let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
    let wind = getValueWithUnit(item.wind.speed, windUnit);
    renderDetailsItem('feelslike', feelslike);
    renderDetailsItem('pressure', pressure);
    renderDetailsItem('humidity', humidity);
    renderDetailsItem('wind', wind);
}

function renderDetailsItem(className, value) {
    let container = document.querySelector(`.${className}`).querySelector('.details__value');
    container.textContent = value;
}

function renderDayOrNigth(data) {
    const wrapper = document.querySelector('.wrapper');
    if (data.list[0].sys.pod == 'n' && wrapper.classList.contains('night') == false) {
        wrapper.classList.add('night');
    }
    if (data.list[0].sys.pod == 'd' && wrapper.classList.contains('night') == true) {
        wrapper.classList.remove('night');
    }
}

function start() {
    getData().then(data => {
        render(data);
    });
}
start();

setInterval(start, 10 * 60 * 1000);

