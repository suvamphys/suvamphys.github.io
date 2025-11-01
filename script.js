// Update the time dynamically every second
function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Toggle between light and dark mode
document.getElementById("themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
