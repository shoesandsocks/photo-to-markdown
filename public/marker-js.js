const btn = document.getElementById('marker-btn');
const code = document.getElementById('marker-code');

btn.addEventListener('click', function() {
  code.classList.toggle("hidden");
  const markerData = code.innerText;
  code.innerText = markerData;
})