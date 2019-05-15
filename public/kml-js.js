const btn = document.getElementById('kml-btn');
const code = document.getElementById('kml-code');
const description = document.getElementById('description-text');


btn.addEventListener('click', function() {
  code.classList.toggle("hidden");
  const kml = code.innerText.replace('DESCRIPTION', description.value);
  code.innerText = kml;
})