// scripts/search.js

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
  
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const jobCards = document.querySelectorAll('.job-card');
  
      jobCards.forEach(card => {
        const title = card.querySelector('h5').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
  
        card.parentElement.style.display =
          title.includes(searchTerm) || description.includes(searchTerm)
            ? 'block'
            : 'none';
      });
    });
  });
  
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
            <small><strong>Location:</strong> ${job.Location}</small><br>
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
  