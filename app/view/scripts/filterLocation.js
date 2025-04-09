document.addEventListener('DOMContentLoaded', () => {
  loadJobs();
  getUserLocationAndSetInput();

  const locationInput = document.getElementById('locationInput');
  if (locationInput) {
    locationInput.addEventListener('input', (e) => {
      const locationFilter = e.target.value.toLowerCase();
      filterJobs(locationFilter);
    });
  } else {
    console.warn("❗ 'locationInput' element not found in DOM.");
  }
});

async function loadJobs() {
  try {
    const res = await fetch('/get-jobs');
    const jobs = await res.json();
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';

    jobs.forEach(job => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.dataset.location = job.Location.toLowerCase();
      li.innerHTML = `
        <strong>${job.Title}</strong><br>
        ${job.Description}<br>
        <small><strong>Location:</strong> ${job.Location}</small><br>
        <small class="text-muted">Posted: ${new Date(job.DatePosted).toLocaleDateString()}</small>
      `;
      jobList.appendChild(li);
    });
  } catch (err) {
    console.error('❌ Error loading jobs:', err);
  }
}

function filterJobs(location) {
  const jobs = document.querySelectorAll('#jobList li');
  jobs.forEach(job => {
    const jobLocation = job.dataset.location || '';
    job.style.display = jobLocation.includes(location) ? 'block' : 'none';
  });
}

async function getUserLocationAndSetInput() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
      if (city) {
        const locationInput = document.getElementById('locationInput');
        if (locationInput) {
          locationInput.value = city;
          filterJobs(city.toLowerCase());
        }
      }
    } catch (err) {
      console.warn('🌍 Failed to reverse geocode location:', err);
    }
  }, err => {
    console.warn('❌ Geolocation error:', err);
  });
}