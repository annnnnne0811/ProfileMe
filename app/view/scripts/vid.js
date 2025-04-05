// scripts/vid.js

const socialIcons = {
    "Portfolio": "bi bi-link-45deg",
    "GitHub": "bi bi-github",
    "LinkedIn": "bi bi-linkedin",
    "Twitter": "bi bi-twitter",
    "Facebook": "bi bi-facebook",
    "Instagram": "bi bi-instagram",
    "YouTube": "bi bi-youtube",
    "TikTok": "bi bi-tiktok"
  };
  
  let isEditing = false;
  
  function addNewLink(icon = "bi bi-link-45deg", url = "") {
    const list = document.getElementById("usefulLinksList");
    const li = document.createElement("li");
    li.className = "mb-2 p-2 border rounded bg-light shadow-sm d-flex align-items-center justify-content-between";
  
    const iconPicker = document.createElement("select");
    iconPicker.className = "form-select me-2";
    Object.entries(socialIcons).forEach(([name, cls]) => {
      const option = document.createElement("option");
      option.value = cls;
      option.textContent = name;
      if (cls === icon) option.selected = true;
      iconPicker.appendChild(option);
    });
  
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.className = "form-control me-2";
    urlInput.placeholder = "Enter URL";
    urlInput.value = url;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.innerHTML = "&#10006;";
    deleteBtn.onclick = () => isEditing && li.remove();
  
    li.append(iconPicker, urlInput, deleteBtn);
    list.appendChild(li);
  }
  
  function toggleEditState(editMode) {
    document.querySelectorAll("[data-editable]").forEach(el => {
      el.contentEditable = editMode;
      el.style.border = editMode ? "1px dashed gray" : "none";
    });
    document.getElementById("profilePicInput").style.display = editMode ? "block" : "none";
    document.getElementById("videoUpload").style.display = editMode ? "block" : "none";
    document.getElementById("addVideoBtn").style.display = editMode ? "block" : "none";
    document.getElementById("addLinkBtn").style.display = editMode ? "block" : "none";
    document.querySelectorAll(".btn-danger").forEach(btn => btn.style.display = editMode ? "block" : "none");
    document.getElementById("toggleEditMode").textContent = editMode ? "Save Changes" : "Edit Profile";
  }
  
  async function loadUserProfile() {
    try {
      console.log('👉 Checking session...');
      const sessionRes = await fetch('/check-session', { credentials: 'include' });
      console.log('✅ Session response:', sessionRes);
  
      if (!sessionRes.ok) throw new Error('User not logged in');
  
      const user = await sessionRes.json();
      console.log('🧠 Session user:', user);

      const accountId = user.AccountID;
      console.log('🧪 Account ID:', accountId);

      const res = await fetch(`/get-user-profile/${accountId}`);
      console.log('📡 Fetch response:', res);
      
      const data = await res.json();
      console.log('📦 User profile + links:', data);
  
      document.getElementById("firstName").textContent = user.FirstName || "User";
      document.getElementById("lastName").textContent = user.LastName || "";
      document.getElementById("profilePic").src = data.profile?.ProfileImage || "";
      document.getElementById("videoSource").src = data.profile?.ProfileVideo || "";
      document.querySelector("video").load();
  
      const links = data.links || [];
      document.getElementById("usefulLinksList").innerHTML = "";
      links.forEach(link => addNewLink(link.IconClass, link.LinkURL));
    } catch (err) {
      console.error("🚨 Error loading profile:", err);
      alert("Failed to load your profile. Please log in.");
      window.location.href = "/";
    }
  }
  
  async function saveFullProfileToDatabase() {
    try {
      const res = await fetch('/check-session', { credentials: 'include' });
      const user = await res.json();
      const accountId = user.AccountID;
  
      const profileData = {
        description: document.querySelector("#aboutMe p[data-editable='true']")?.innerText || '',
        displayed_location: '',
        profile_picture_url: document.getElementById("profilePic").src || '',
        profile_video_url: document.getElementById("videoSource").src || ''
      };
  
      const links = [];
      document.querySelectorAll("#usefulLinksList li").forEach(linkEl => {
        links.push({
          iconClass: linkEl.querySelector("select").value,
          linkName: '',
          linkUrl: linkEl.querySelector("input").value.trim()
        });
      });
  
      const saveRes = await fetch("/save-full-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ AccountID: accountId, profileData, links })
      });
  
      const result = await saveRes.json();
      alert(result.message || "Saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save profile.");
    }
  }

  async function uploadFile(file, route) {
    const formData = new FormData();
    formData.append(route === "profile-image" ? "profilePic" : "profileVideo", file);
    const res = await fetch(`/upload/${route}`, {
      method: "POST",
      body: formData
    });
    return await res.json();
  }
  // Hook events
  
  document.addEventListener("DOMContentLoaded", loadUserProfile);
  
  document.getElementById("toggleEditMode").addEventListener("click", async () => {
    if (isEditing) await saveFullProfileToDatabase();
    isEditing = !isEditing;
    toggleEditState(isEditing);
  });
  
  document.getElementById("addLinkBtn").addEventListener("click", () => addNewLink());
  
  document.getElementById("profilePic").addEventListener("click", () => {
    if (isEditing) document.getElementById("profilePicInput").click();
  });
  
  document.getElementById("profilePicInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadFile(file, "profile-image");
      document.getElementById("profilePic").src = result.imageUrl;
    }
  });
  
  document.getElementById("videoUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadFile(file, "profile-video");
      document.getElementById("videoSource").src = result.videoUrl;
      document.querySelector("video").load();
    }
  });
  
  document.getElementById("addVideoBtn").addEventListener("click", () => {
    document.getElementById("videoUpload").click();
  });