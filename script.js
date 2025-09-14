const apiKey = '10fc3ac49dce41b79c8115706251409'; // Use your own API key here
const apiUrl = 'http://api.weatherapi.com/v1/current.json';

const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const locationName = document.getElementById('locationName');
const localTime = document.getElementById('localTime');
const tempValue = document.getElementById('tempValue');
const conditionText = document.getElementById('conditionText');
const weatherIcon = document.getElementById('weatherIcon');
const windSpeed = document.getElementById('windSpeed');
const humidityValue = document.getElementById('humidityValue');
const cloudCover = document.getElementById('cloudCover');
const airQuality = document.getElementById('airQuality');

// Initial state
messageDiv.classList.remove('hidden');

const fetchWeather = async (location) => {
    // Clear previous states
    weatherDisplay.classList.add('hidden');
    messageDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}&q=${location}&aqi=yes`);
        const data = await response.json();

        loadingDiv.classList.add('hidden');

        if (response.ok) {
            const { current, location } = data;
            locationName.textContent = location.name;
            localTime.textContent = new Date(location.localtime).toLocaleString();
            tempValue.textContent = `${current.temp_c}°C`;
            conditionText.textContent = current.condition.text;
            weatherIcon.src = current.condition.icon;
            windSpeed.textContent = `${current.wind_kph} km/h`;
            humidityValue.textContent = `${current.humidity}%`;
            cloudCover.textContent = `${current.cloud}%`;
            
            // Air Quality Index
            const aqi_data = current.air_quality;
            const aqi_index = aqi_data['us-epa-index'];
            let aqi_text = '';
            switch(aqi_index) {
                case 1: aqi_text = 'Good'; break;
                case 2: aqi_text = 'Moderate'; break;
                case 3: aqi_text = 'Unhealthy for Sensitive Groups'; break;
                case 4: aqi_text = 'Unhealthy'; break;
                case 5: aqi_text = 'Very Unhealthy'; break;
                case 6: aqi_text = 'Hazardous'; break;
                default: aqi_text = 'Not available';
            }
            airQuality.textContent = `Air Quality (US EPA Index): ${aqi_text}`;

            weatherDisplay.classList.remove('hidden');
            weatherDisplay.style.animation = 'none'; // Reset animation
            void weatherDisplay.offsetWidth; // Trigger reflow
            weatherDisplay.style.animation = null; // Re-enable animation
        } else {
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        loadingDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        console.error('Error fetching weather data:', error);
    }
};

searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        messageDiv.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
        errorDiv.classList.add('hidden');
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});