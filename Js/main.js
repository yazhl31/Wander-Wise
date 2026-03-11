// ===== WanderWise Main JavaScript =====

// Global variables
let swiperInstance;
let mapInstance = null;

// ===== City Data =====
const cityData = {
  paris: {
    name: 'Paris',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    desc: 'Paris, the city of light, enchants with its romantic streets, iconic landmarks, and world-class art.',
    lat: 48.8566,
    lng: 2.3522,
    highlights: ['Eiffel Tower & Seine cruise', 'Louvre museum', 'French cuisine', 'Champs-Élysées']
  },
  tokyo: {
    name: 'Tokyo',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1974&auto=format&fit=crop',
    desc: 'Tokyo is a dazzling blend of ultramodern and traditional. Neon-lit skyscrapers, ancient temples.',
    lat: 35.6762,
    lng: 139.6503,
    highlights: ['Shibuya crossing', 'Senso-ji Temple', 'Tsukiji market', 'Shinjuku']
  },
  dubai: {
    name: 'Dubai',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    desc: 'Dubai is a futuristic oasis with record-breaking architecture, desert adventures, and luxury shopping.',
    lat: 25.2048,
    lng: 55.2708,
    highlights: ['Burj Khalifa', 'Desert safari', 'Gold souks', 'Palm Jumeirah']
  },
  nyc: {
    name: 'New York',
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
    desc: 'The Big Apple pulses with energy. Broadway, Central Park, world-famous museums.',
    lat: 40.7128,
    lng: -74.0060,
    highlights: ['Statue of Liberty', 'Central Park', 'Metropolitan Museum', 'Broadway']
  },
  italy: {
    name: 'Italy',
    img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
    desc: 'Italy is a feast for the senses: ancient history, Renaissance art, rolling vineyards.',
    lat: 41.9028,
    lng: 12.4964,
    highlights: ['Colosseum', 'Venice canals', 'Florence', 'Amalfi coast']
  },
  maldives: {
    name: 'Maldives',
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop',
    desc: 'Crystal clear waters, private overwater villas, and vibrant coral reefs.',
    lat: 3.2028,
    lng: 73.2207,
    highlights: ['Overwater bungalows', 'Snorkeling', 'Dolphin cruises', 'Spa']
  }
};

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  initializeSwiper();
  loadUserPreferences();
  setupEventListeners();
  resetToNormal();
});

// ===== Swiper Initialization =====
function initializeSwiper() {
  swiperInstance = new Swiper('.background-swiper', {
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.slider-section__next-button',
      prevEl: '.slider-section__prev-button'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    effect: 'slide',
    grabCursor: true
  });
  console.log('Swiper initialized');
}

// ===== Load User Preferences (Theme & Language) =====
function loadUserPreferences() {
  const body = document.body;
  
  // Load theme
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.replace('light', 'dark');
  }
  
  // Load language
  if (localStorage.getItem('lang') === 'es') {
    body.setAttribute('data-lang', 'es');
    document.getElementById('langLabel').innerText = 'ES';
  } else {
    document.getElementById('langLabel').innerText = 'EN';
  }
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Language toggle
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);
  
  // Search button
  document.getElementById('searchBtn').addEventListener('click', performSearch);
  
  // Explore buttons
  const exploreBtns = document.querySelectorAll('.explore-btn');
  console.log('Found', exploreBtns.length, 'explore buttons');
  
  exploreBtns.forEach(btn => {
    btn.addEventListener('click', handleExploreClick);
  });
  
  // Start planning button
  document.getElementById('startPlanningBtn').addEventListener('click', () => {
    bootstrap.Modal.getInstance(document.getElementById('cityModal')).hide();
  });
  
  // Save plan button
  document.getElementById('savePlanBtn').addEventListener('click', () => {
    alert('Your customized itinerary has been saved (demo).');
  });
}

// ===== Theme Toggle =====
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('light')) {
    body.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  }
}

// ===== Language Toggle =====
function toggleLanguage() {
  const body = document.body;
  const langLabel = document.getElementById('langLabel');
  
  if (body.getAttribute('data-lang') === 'en') {
    body.setAttribute('data-lang', 'es');
    localStorage.setItem('lang', 'es');
    langLabel.innerText = 'ES';
  } else {
    body.setAttribute('data-lang', 'en');
    localStorage.setItem('lang', 'en');
    langLabel.innerText = 'EN';
  }
}

// ===== Handle Explore Button Click =====
function handleExploreClick(e) {
  const cityKey = e.currentTarget.getAttribute('data-city');
  console.log('Explore clicked for city:', cityKey);
  
  const data = cityData[cityKey] || cityData['paris'];
  
  // Populate modal
  document.getElementById('cityDetailImage').src = data.img;
  document.getElementById('cityDetailName').innerText = data.name;
  document.getElementById('cityDetailDescription').innerText = data.desc;
  
  const list = document.getElementById('cityDetailHighlights');
  list.innerHTML = '';
  data.highlights.forEach(h => {
    list.innerHTML += `<li><i class="bi bi-check-circle-fill text-primary me-2"></i> ${h}</li>`;
  });
  
  // Show modal
  const cityModal = new bootstrap.Modal(document.getElementById('cityModal'));
  cityModal.show();
  
  // Initialize map after modal is shown
  setTimeout(() => {
    initializeCityMap(data.lat, data.lng, data.name);
  }, 500);
}

// ===== Initialize City Map =====
function initializeCityMap(lat, lng, cityName) {
  console.log('Initializing map for', cityName, lat, lng);
  
  if (mapInstance) {
    mapInstance.remove();
  }
  
  const mapContainer = document.getElementById('cityMap');
  if (!mapContainer) return;
  
  mapInstance = L.map('cityMap').setView([lat, lng], 12);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; CartoDB'
  }).addTo(mapInstance);
  
  L.marker([lat, lng]).addTo(mapInstance)
    .bindPopup(cityName)
    .openPopup();
}

// ===== Reset to Normal (Show All) =====
function resetToNormal() {
  // Show all hotel cards
  document.querySelectorAll('#hotelGrid .hotel-card').forEach(card => {
    card.style.display = '';
  });
  
  // Show all flight cards
  document.querySelectorAll('#flightGrid .flight-card').forEach(card => {
    card.style.display = '';
  });
  
  // Reset UI text
  document.getElementById('hotelsSubtitle').innerText = 'Discover top-rated hotels worldwide';
  document.getElementById('searchFeedback').innerHTML = '<i class="bi bi-geo-alt"></i> Enter a destination';
  
  // Hide no-match messages
  document.getElementById('noHotelsMatch').style.display = 'none';
  const noFlightsMatch = document.getElementById('noFlightsMatch');
  if (noFlightsMatch) noFlightsMatch.style.display = 'none';
}

// ===== Perform Search =====
function performSearch() {
  const toInput = document.getElementById('toInput').value.trim().toLowerCase();
  
  if (toInput === '') {
    resetToNormal();
    return;
  }
  
  document.getElementById('searchFeedback').innerHTML = `<i class="bi bi-geo-alt"></i> Showing results for: ${toInput}`;
  document.getElementById('hotelsSubtitle').innerHTML = `Hotels in <strong>${toInput.charAt(0).toUpperCase() + toInput.slice(1)}</strong>`;
  
  // Filter hotels
  const hotelCards = document.querySelectorAll('#hotelGrid .hotel-card');
  let anyHotelVisible = false;
  
  hotelCards.forEach(card => {
    const location = card.getAttribute('data-location').toLowerCase();
    const keywords = card.getAttribute('data-keywords').toLowerCase();
    
    if (location.includes(toInput) || keywords.includes(toInput)) {
      card.style.display = '';
      anyHotelVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Filter flights
  const flightCards = document.querySelectorAll('#flightGrid .flight-card');
  let anyFlightVisible = false;
  
  flightCards.forEach(card => {
    const location = card.getAttribute('data-location').toLowerCase();
    const keywords = card.getAttribute('data-keywords').toLowerCase();
    
    if (location.includes(toInput) || keywords.includes(toInput)) {
      card.style.display = '';
      anyFlightVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide no results messages
  document.getElementById('noHotelsMatch').style.display = anyHotelVisible ? 'none' : 'block';
  
  const noFlightsMatch = document.getElementById('noFlightsMatch');
  if (noFlightsMatch) {
    noFlightsMatch.style.display = anyFlightVisible ? 'none' : 'block';
  }
}

// ===== Enter key for search =====
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && document.activeElement.id === 'toInput') {
    performSearch();
  }
});