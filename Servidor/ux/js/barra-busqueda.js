function barraBusqueda() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('barraSensores');
    console.log("okkkk" + document)
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      divContenedor = li[i].getElementsByTagName("div")[0];
      console.log("okkkk" + divContenedor)
      txtValue = divContenedor.textContent || divContenedor.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }