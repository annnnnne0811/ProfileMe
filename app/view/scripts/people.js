document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('searchPeopleInput');
    const peopleContainer = document.getElementById('peopleContainer');
    let people = [];
  
    // Fetch people from server
    try {
      const res = await fetch('/get-people');
      people = await res.json();
      renderPeople(people);
    } catch (err) {
      console.error('Error fetching people:', err);
    }
  
    // Render people with buttons
    function renderPeople(list) {
      peopleContainer.innerHTML = '';
      list.forEach(person => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="person-card">
            <h5><strong>${person.FirstName} ${person.LastName}</strong></h5>
            <p><i class="fas fa-envelope"></i> ${person.Email}</p>
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-primary btn-sm">Add Friend</button>
              <button class="btn btn-secondary btn-sm" onclick="openUCVModal('${person.UCV || ''}')">Check UCV</button>
            </div>
          </div>
        `;
        peopleContainer.appendChild(card);
      });
    }
  
    // Filter people on search input
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = people.filter(p =>
        `${p.FirstName} ${p.LastName}`.toLowerCase().includes(query)
      );
      renderPeople(filtered);
    });
  });
  
  // Show modal
  function openUCVModal(videoUrl) {
    const modal = document.getElementById('ucvModal');
    const video = document.getElementById('ucvVideo');
    video.src = videoUrl;
    modal.style.display = 'flex';
  }
  
  // Close modal
  function closeUCVModal() {
    const modal = document.getElementById('ucvModal');
    const video = document.getElementById('ucvVideo');
    modal.style.display = 'none';
    video.pause();
    video.src = '';
  }