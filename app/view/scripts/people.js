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

      list.forEach((person, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
  <div class="person-card" style="animation-delay: ${index * 100}ms">
    <h5><strong>${person.FirstName} ${person.LastName}</strong></h5>
    <p><i class="fas fa-envelope"></i> ${person.Email}</p>
    <div class="d-flex gap-2 mt-2">
      <button class="btn btn-primary btn-sm add-friend-btn"><i class="fas fa-user-plus me-1"></i> Add Friend</button>
      <button class="btn btn-secondary btn-sm" onclick="openUCVModal('${person.ProfileVideo || ''}')">
        <i class="fas fa-play-circle me-1"></i> Check UCV
      </button>
    </div>
  </div>
`;
        peopleContainer.appendChild(card);
      });

      // Apply animation classes after DOM updates
      const cards = peopleContainer.querySelectorAll('.person-card');
      cards.forEach(card => card.classList.add('fade-in-stagger'));
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

// Logout handler
async function logoutUser(e) {
  e.preventDefault();
  await fetch('/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
}

document.getElementById('navLogoutBtn').addEventListener('click', logoutUser);
document.getElementById('sidebarLogoutBtn').addEventListener('click', logoutUser);

// Show modal
function openUCVModal(videoUrl) {
  const modal = document.getElementById('ucvModal');
  const video = document.getElementById('ucvVideo');
  if (videoUrl) {
      video.src = videoUrl;
      modal.style.display = 'flex';
  } else {
      alert("This user has not uploaded a profile video yet.");
  }
}

// Close modal
function closeUCVModal() {
  const modal = document.getElementById('ucvModal');
  const video = document.getElementById('ucvVideo');
  modal.style.display = 'none';
  video.pause();
  video.src = '';
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("add-friend-btn")) {
    e.preventDefault();

    // Show toast
    const toastEl = document.getElementById("friendToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Optional: disable button or change text
    e.target.disabled = true;
    e.target.textContent = "Requested";
  }
});