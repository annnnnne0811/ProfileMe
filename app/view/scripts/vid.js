// vars
let isEditing = false;

// icons
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

// edit profile buttons
function toggleEditState(editMode) {
  // Toggle readonly for Feed textarea
  const feedTextarea = document.querySelector("#feed textarea");
  feedTextarea.readOnly = !editMode;

  // Toggle readonly for About Me textarea
  const aboutMeTextarea = document.querySelector("#aboutMeContent");
  aboutMeTextarea.readOnly = !editMode;

  // Toggle visibility of edit-only buttons (Cancel and Save) for all sections
  document.querySelectorAll(".edit-only-buttons").forEach(container => {
    container.style.display = editMode ? "flex" : "none";
  });

  // Toggle visibility of elements with the edit-only class (like Add Another Link)
  document.querySelectorAll(".edit-only").forEach(element => {
    element.style.display = editMode ? "block" : "none";
  });

  // Keep other edit-mode toggles
  document.getElementById("profilePicInput").style.display = editMode ? "block" : "none";
  document.getElementById("videoUpload").style.display = editMode ? "block" : "none";
  document.getElementById("addVideoBtn").style.display = editMode ? "block" : "none";
  document.querySelectorAll(".btn-danger").forEach(btn => btn.style.display = editMode ? "block" : "none");
  document.getElementById("toggleEditMode").textContent = editMode ? "Save" : "Edit Profile";

  // Update the display of links based on edit mode
  updateLinksDisplay();
}

// Function to update the display of links based on edit mode
function updateLinksDisplay() {
  const list = document.getElementById("usefulLinksList");
  const noLinksMessage = document.getElementById("noLinksMessage");
  const links = list.querySelectorAll("li");

  // Show/hide the "No links added yet" message
  if (links.length === 0) {
    noLinksMessage.style.display = "block";
  } else {
    noLinksMessage.style.display = "none";
  }

  // Update each link's display based on edit mode
  links.forEach(li => {
    const iconClass = li.dataset.iconClass;
    const url = li.dataset.url;

    // Clear the current content of the li
    li.innerHTML = "";

    if (isEditing) {
      // Edit mode: Show select and input
      const iconPicker = document.createElement("select");
      iconPicker.className = "form-select me-2";
      Object.entries(socialIcons).forEach(([name, cls]) => {
        const option = document.createElement("option");
        option.value = cls;
        option.textContent = name;
        if (cls === iconClass) option.selected = true;
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
      deleteBtn.onclick = () => li.remove();

      li.append(iconPicker, urlInput, deleteBtn);
    } else {
      // View mode: Show clickable link
      const linkContainer = document.createElement("div");
      linkContainer.className = "mb-2";

      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.className = "text-decoration-none";
      link.innerHTML = `<i class="${iconClass} me-2"></i>${url}`;

      linkContainer.appendChild(link);
      li.appendChild(linkContainer);
    }
  });
}

// adding a new link
function addNewLink(icon = "bi bi-link-45deg", url = "") {
  const list = document.getElementById("usefulLinksList");
  const li = document.createElement("li");
  li.className = "mb-2 p-2 border rounded bg-light shadow-sm d-flex align-items-center justify-content-between";
  li.dataset.iconClass = icon;
  li.dataset.url = url;

  // Update the display based on the current edit mode
  list.appendChild(li);
  updateLinksDisplay();
}

async function saveUsefulLinks() {
  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    const links = [];
    document.querySelectorAll("#usefulLinksList li").forEach(li => {
      const iconClass = isEditing ? li.querySelector("select").value : li.dataset.iconClass;
      const linkUrl = isEditing ? li.querySelector("input").value.trim() : li.dataset.url;
      links.push({
        iconClass,
        linkName: '',
        linkUrl
      });

      // Update the dataset for consistency
      li.dataset.iconClass = iconClass;
      li.dataset.url = linkUrl;
    });

    const saveRes = await fetch("/save-useful-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, links })
    });

    const result = await saveRes.json();
    alert(result.message || "Useful links saved successfully!");
  } catch (err) {
    console.error("Save useful links error:", err);
    alert("Failed to save useful links.");
  }
}

// saves feed data
async function saveFeed() {
  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    const feedText = document.querySelector("#feed textarea").value;
    console.log('Saving feedText:', feedText);

    const saveRes = await fetch("/save-feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, feedText })
    });

    const result = await saveRes.json();
    alert(result.message || "Feed saved successfully!");
  } catch (err) {
    console.error("Save feed error:", err);
    alert("Failed to save feed.");
  }
}

// saves about me data
async function saveAboutMe() {
  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    const description = document.querySelector("#aboutMeContent").value;

    const saveRes = await fetch("/save-about-me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, description })
    });

    const result = await saveRes.json();
    alert(result.message || "About Me saved successfully!");

    // Reload the profile to ensure the UI reflects the latest data
    await loadUserProfile();
  } catch (err) {
    console.error("Save About Me error:", err);
    alert("Failed to save About Me.");
  }
}

// saves profile video url
async function saveProfileVideo() {
  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    // Normalize the URL to a relative path
    let profile_video_url = document.getElementById("videoSource").src;
    if (profile_video_url.startsWith(window.location.origin)) {
      profile_video_url = profile_video_url.replace(window.location.origin, '');
    }

    const saveRes = await fetch("/save-profile-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, profile_video_url })
    });

    const result = await saveRes.json();
    alert(result.message || "Profile video saved successfully!");
  } catch (err) {
    console.error("Save profile video error:", err);
    alert("Failed to save profile video.");
  }
}

// loads in user profile
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
    console.log('ProfileID:', data.profile?.ProfileID);
    console.log('FeedText:', data.profile?.FeedText);
    console.log('BioText:', data.profile?.BioText);

    document.getElementById("firstName").textContent = user.FirstName || "User";
    document.getElementById("lastName").textContent = user.LastName || "";
    
    const profilePic = document.getElementById("profilePic");
    const defaultIcon = document.querySelector(".profile-img-container .default-icon");

    // Define reusable handlers for image load and error
    const updateImageVisibility = () => {
      if (profilePic.src && profilePic.src !== window.location.href) { // Ensure src is not empty or the page URL
        defaultIcon.style.display = "none";
        profilePic.style.display = "block";
      } else {
        defaultIcon.style.display = "block";
        profilePic.style.display = "none";
      }
    };

    // Set the handlers
    profilePic.onload = updateImageVisibility;
    profilePic.onerror = () => {
      defaultIcon.style.display = "block";
      profilePic.style.display = "none";
    };

    // Set the initial profile picture
    profilePic.src = data.profile?.ProfileImage || "";
    updateImageVisibility(); // Call immediately to set initial state

    document.getElementById("videoSource").src = data.profile?.ProfileVideo || "";
    document.querySelector("video").load();

    // Load Feed
    const feedTextarea = document.querySelector("#feed textarea");
    feedTextarea.value = data.profile?.FeedText || "";
    console.log('Textarea value after setting:', feedTextarea.value);
    feedTextarea.dispatchEvent(new Event('change'));

    // Load About Me
    const aboutMeTextarea = document.querySelector("#aboutMeContent");
    aboutMeTextarea.value = data.profile?.BioText || "";
    aboutMeTextarea.dispatchEvent(new Event('change'));

    // Load Useful Links
    const links = data.links || [];
    document.getElementById("usefulLinksList").innerHTML = "";
    links.forEach(link => addNewLink(link.IconClass, link.LinkURL));
  } catch (err) {
    console.error("🚨 Error loading profile:", err);
    alert("Failed to load your profile. Please log in.");
    window.location.href = "/";
  }
}

// uploads video and image
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
document.addEventListener("DOMContentLoaded", async () => {
  await loadUserProfile();
  toggleEditState(isEditing);
});

document.getElementById("toggleEditMode").addEventListener("click", () => {
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
    try {
      const result = await uploadFile(file, "profile-image");
      if (!result.imageUrl) throw new Error("No image URL returned");

      const profilePic = document.getElementById("profilePic");
      const defaultIcon = document.querySelector(".profile-img-container .default-icon");

      // Define handlers for the new image
      const updateImageVisibility = () => {
        if (profilePic.src && profilePic.src !== window.location.href) {
          defaultIcon.style.display = "none";
          profilePic.style.display = "block";
        } else {
          defaultIcon.style.display = "block";
          profilePic.style.display = "none";
        }
      };

      // Reapply the handlers
      profilePic.onload = updateImageVisibility;
      profilePic.onerror = () => {
        defaultIcon.style.display = "block";
        profilePic.style.display = "none";
      };

      // Ensure the image is visible before setting the new src
      profilePic.style.display = "block";
      defaultIcon.style.display = "none";

      // Force image reload by resetting the src before setting the new URL
      profilePic.src = ""; // Reset the src to force a reload
      profilePic.src = result.imageUrl; // Set the new image source

      // Save the profile picture URL to the database
      const res = await fetch('/check-session', { credentials: 'include' });
      const user = await res.json();
      const accountId = user.AccountID;

      const profile_picture_url = result.imageUrl;

      const saveRes = await fetch("/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ AccountID: accountId, profile_picture_url })
      });

      const saveResult = await saveRes.json();
      alert(saveResult.message || "Profile picture saved successfully!");
    } catch (err) {
      console.error("Upload profile picture error:", err);
      const defaultIcon = document.querySelector(".profile-img-container .default-icon");
      defaultIcon.style.display = "block";
      const profilePic = document.getElementById("profilePic");
      profilePic.style.display = "none";
      alert("Failed to upload profile picture.");
    }
  }
});

document.getElementById("removeProfilePicBtn").addEventListener("click", async (event) => {
  event.stopPropagation(); // Prevent bubbling to parent container

  const profilePic = document.getElementById("profilePic");
  const defaultIcon = document.querySelector(".profile-img-container .default-icon");
  const originalSrc = profilePic.src; // Store the original src for rollback

  // Reset the image
  profilePic.src = ""; // Clear the profile picture
  defaultIcon.style.display = "block"; // Show the default icon
  profilePic.style.display = "none"; // Hide the image

  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    const saveRes = await fetch("/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, profile_picture_url: "" })
    });

    const saveResult = await saveRes.json();
    if (!saveRes.ok) throw new Error("Failed to save profile picture removal");
    alert(saveResult.message || "Profile picture removed successfully!");
  } catch (err) {
    console.error("Remove profile picture error:", err);
    // Rollback UI changes if the server request fails
    profilePic.src = originalSrc;
    if (originalSrc) {
      profilePic.style.display = "block";
      defaultIcon.style.display = "none";
    }
    alert("Failed to remove profile picture.");
  }
});

document.getElementById("videoUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    const result = await uploadFile(file, "profile-video");
    document.getElementById("videoSource").src = result.videoUrl;
    document.querySelector("video").load();
    await saveProfileVideo(); // Save the video immediately after upload
  }
});

document.getElementById("addVideoBtn").addEventListener("click", () => {
  document.getElementById("videoUpload").click();
});

document.getElementById("removeVideoBtn").addEventListener("click", async () => {
  const videoSource = document.getElementById("videoSource");
  const videoElement = document.querySelector("video");
  const originalSrc = videoSource.src; // Store the original src for rollback

  // Reset the video
  videoSource.src = ""; // Clear the video source
  videoElement.load(); // Reload the video element to reflect the change

  try {
    const res = await fetch('/check-session', { credentials: 'include' });
    const user = await res.json();
    const accountId = user.AccountID;

    const saveRes = await fetch("/save-profile-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ AccountID: accountId, profile_video_url: "" })
    });

    const saveResult = await saveRes.json();
    if (!saveRes.ok) throw new Error("Failed to save profile video removal");
    alert(saveResult.message || "Profile video removed successfully!");
  } catch (err) {
    console.error("Remove profile video error:", err);
    // Rollback UI changes if the server request fails
    videoSource.src = originalSrc;
    videoElement.load();
    alert("Failed to remove profile video.");
  }
});

// Logout handler
async function logoutUser(e) {
  e.preventDefault();
  await fetch('/logout', { method: 'POST', credentials: 'include' });
  window.location.href = '/';
}

document.getElementById('navLogoutBtn').addEventListener('click', logoutUser);
document.getElementById('sidebarLogoutBtn').addEventListener('click', logoutUser);

// Add event listeners for each Save button
document.querySelector("#feed .btn-primary").addEventListener("click", saveFeed);
document.querySelector("#aboutMe .btn-save-about").addEventListener("click", saveAboutMe);
document.querySelector("#usefulLinks .btn-save-links").addEventListener("click", saveUsefulLinks);

//trying to work with darkmode
const toggleBtn = document.getElementById("darkModeToggle");

const updateModeText = (isDark) => {
  toggleBtn.innerHTML = isDark
    ? '<i class="fa-regular fa-sun me-1"></i> Switch to Bright Mode'
    : '<i class="fa-regular fa-moon me-1"></i> Switch to Dark Mode';
};

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (localStorage.getItem("mode") === "dark" || (prefersDark && !localStorage.getItem("mode"))) {
  document.body.classList.add("dark-mode");
  updateModeText(true);
} else {
  updateModeText(false);
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  updateModeText(isDark);
  localStorage.setItem("mode", isDark ? "dark" : "light");
});