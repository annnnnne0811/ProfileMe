/* 

can move reused script code for html files here and then link using 

<script src="script.js"></script>

in the necessary html files if we want
*/


document.addEventListener('DOMContentLoaded', async () => {
    
    // checks session on load
    try {
        const sessionRes = await fetch('/check-session', { credentials: 'include' });
        if (!sessionRes.ok) return;

        const session = await sessionRes.json();

        // updates sidebar/profile display
        const sidebarTitle = document.getElementById('sidebarMenuLabel');
        if (sidebarTitle) {
            sidebarTitle.textContent = `${session.FirstName} ${session.LastName}`;
        }

        // logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.classList.remove('d-none');
        }
    } catch (err) {
        console.error('Session check failed:', err);
    }

    // login form (index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const Email = document.getElementById('loginEmail').value;
            const Password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ Email, Password })
                });

                const data = await response.json();
                alert(data.message);
                if (response.ok) window.location.reload();
            } catch (err) {
                console.error('Login failed:', err);
                alert('Login failed.');
            }
        });
    }

    // register form (index.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const FirstName = document.getElementById('registerFirstName').value;
            const LastName = document.getElementById('registerLastName').value;
            const Email = document.getElementById('registerEmail').value;
            const Password = document.getElementById('registerPassword').value;
            const DateOfBirth = document.getElementById('registerDOB').value;

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ FirstName, LastName, Email, Password, DateOfBirth })
                });

                const data = await response.json();
                alert(data.message);
                if (response.ok) window.location.reload();
            } catch (err) {
                console.error('Registration failed:', err);
                alert('Registration failed.');
            }
        });
    }
});
