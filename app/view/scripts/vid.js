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
  document.querySelectorAll("[data-editable]").forEach(el => {
      el.contentEditable = editMode;
      el.style.border = editMode ? "1px dashed gray" : "none";
  });
  document.getElementById("profilePicInput").style.display = editMode ? "block" : "none";
  document.getElementById("videoUpload").style.display = editMode ? "block" : "none";
  document.getElementById("addVideoBtn").style.display = editMode ? "block" : "none";
  document.getElementById("addLinkBtn").style.display = editMode ? "block" : "none";
  document.querySelectorAll(".btn-danger").forEach(btn => btn.style.display = editMode ? "block" : "none");
  document.getElementById("toggleEditMode").textContent = editMode ? "Edit Mode" : "Edit Profile";
}


// adding a new link
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

async function saveUsefulLinks() {
  try {
      const res = await fetch('/check-session', { credentials: 'include' });
      const user = await res.json();
      const accountId = user.AccountID;

      const links = [];
      document.querySelectorAll("#usefulLinksList li").forEach(linkEl => {
          links.push({
              iconClass: linkEl.querySelector("select").value,
              linkName: '',
              linkUrl: linkEl.querySelector("input").value.trim()
          });
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

      const description = document.querySelector("#aboutMe p[data-editable='true']").innerText;

      const saveRes = await fetch("/save-about-me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ AccountID: accountId, description })
      });

      const result = await saveRes.json();
      alert(result.message || "About Me saved successfully!");
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
      console.log('FeedText:', data.profile?.FeedText);
      console.log('BioText:', data.profile?.BioText);

      document.getElementById("firstName").textContent = user.FirstName || "User";
      document.getElementById("lastName").textContent = user.LastName || "";
      document.getElementById("profilePic").src = data.profile?.ProfileImage || "";
      document.getElementById("videoSource").src = data.profile?.ProfileVideo || "";
      document.querySelector("video").load();

      // Load Feed
      const feedTextarea = document.querySelector("#feed textarea");
      feedTextarea.value = data.profile?.FeedText || "";
      console.log('Textarea value after setting:', feedTextarea.value);
      feedTextarea.dispatchEvent(new Event('change'));

      // Load About Me
      const aboutMeContent = document.querySelector("#aboutMe p[data-editable='true']");
      aboutMeContent.innerText = data.profile?.BioText || "Write something about yourself...";

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
document.addEventListener("DOMContentLoaded", loadUserProfile);

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
      const result = await uploadFile(file, "profile-image");
      document.getElementById("profilePic").src = result.imageUrl;

      // Save the profile picture URL to the database
      try {
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
          console.error("Save profile picture error:", err);
          alert("Failed to save profile picture.");
      }
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

// Add event listeners for each Save button
document.querySelector("#feed .btn-primary").addEventListener("click", saveFeed);
document.querySelector("#aboutMe .btn-save-about").addEventListener("click", saveAboutMe);
document.querySelector("#usefulLinks .btn-save-links").addEventListener("click", saveUsefulLinks);