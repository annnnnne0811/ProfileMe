document.addEventListener('DOMContentLoaded', () => {
  loadJobs();
  getUserLocationAndSearchJobs();
  initAutocomplete(); // Add this to initialize Google Places Autocomplete

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterJobsByText(searchTerm);
  });
});

// Add Google Places Autocomplete
function initAutocomplete() {
  const input = document.getElementById("searchInput");
  const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)']
      // You can add componentRestrictions here if needed, e.g., { country: 'Ie' }
  });

  autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      console.log("Selected location:", place.formatted_address);
      filterJobsByText(place.formatted_address.toLowerCase());
  });
}

function filterJobsByText(searchTerm) {
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach(card => {
      const title = card.querySelector('h5').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const location = card.querySelector('small')?.textContent.toLowerCase() || '';

      card.parentElement.style.display =
          title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm)
              ? 'block'
              : 'none';
  });
}

async function loadJobs() {
  try {
      const response = await fetch('/get-jobs');
      const jobs = await response.json();
      const jobsContainer = document.getElementById('jobsContainer');
      jobsContainer.innerHTML = '';

      if (jobs.length === 0) {
          jobsContainer.innerHTML = '<p class="text-center">No jobs found. Be the first to post!</p>';
          return;
      }

      jobs.forEach(job => {
          const jobCard = document.createElement('div');
          jobCard.className = 'col-md-4';
          jobCard.innerHTML = `
              <div class="card job-card p-3">
                  <h5>${job.Title}</h5>
                  <p>${job.Description}</p>
                  <small class="job-location"><strong>Location:</strong> ${job.Location}</small><br>
                  <small class="text-muted">Posted on: ${new Date(job.DatePosted).toLocaleDateString()}</small>
              </div>
          `;
          jobsContainer.appendChild(jobCard);
      });
  } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Could not load jobs. Please try again later.');
  }
}

async function getUserLocationAndSearchJobs() {
  if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by your browser.");
      return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state || "";

          if (city) {
              document.getElementById('searchInput').value = city;
              filterJobsByText(city.toLowerCase());
          }
      } catch (error) {
          console.warn('Could not resolve city name from coordinates:', error);
      }
  }, (error) => {
      console.warn('Location access denied or unavailable:', error);
  });
}

async function logoutUser(e) {
  e.preventDefault();
  await fetch('/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
}

document.getElementById('navLogoutBtn').addEventListener('click', logoutUser);
document.getElementById('sidebarLogoutBtn').addEventListener('click', logoutUser);