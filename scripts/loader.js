<script>
var load;

function loader() {
  load = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("displayer").style.display = "block";
}
