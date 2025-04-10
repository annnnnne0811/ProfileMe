document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
      document.body.classList.add("dark-mode");
    }
  });