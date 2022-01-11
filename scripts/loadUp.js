var myVar;

function loadUp() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("displayer").style.display = "block";
}
