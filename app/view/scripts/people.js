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
  
    // Render people
    function renderPeople(list) {
      peopleContainer.innerHTML = '';
      list.forEach(person => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
          <div class="person-card">
            <h5><strong>${person.FirstName} ${person.LastName}</strong></h5>
            <p><i class="fas fa-envelope"></i> ${person.Email}</p>
          </div>
        `;
        peopleContainer.appendChild(card);
      });
    }
  
    // Filter results as user types
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = people.filter(p =>
        `${p.FirstName} ${p.LastName}`.toLowerCase().includes(query)
      );
      renderPeople(filtered);
    });
  });

  function handleLogout(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  }

document.getElementById('navLogoutBtn').addEventListener('click', handleLogout);
document.getElementById('sidebarLogoutBtn').addEventListener('click', handleLogout)