document.getElementById('postJobForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    try {
      const sessionRes = await fetch('/check-session', { credentials: 'include' });
      if (!sessionRes.ok) {
        alert('You must be logged in to post a job.');
        window.location.href = '/';
        return;
      }
  
      const jobData = {
        title: document.getElementById('jobTitle').value,
        description: document.getElementById('jobDescription').value,
        location: document.getElementById('jobLocation').value
      };
  
      const response = await fetch('/post-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(jobData)
      });
  
      const result = await response.json();
      alert(result.message);
  
      if (response.ok) {
        document.getElementById('postJobForm').reset();
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Something went wrong while posting the job.');
    }
});

function handleLogout(e) {
  e.preventDefault();
  window.location.href = 'index.html';
}

document.getElementById('navLogoutBtn').addEventListener('click', handleLogout);
document.getElementById('sidebarLogoutBtn').addEventListener('click', handleLogout)