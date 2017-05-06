function openNav(nav) {
    document.getElementById(nav).style.width = "180px";
    document.getElementById("myAsistentesnav").style.marginLeft = "0px";
  //  document.getElementById("Contactonav").style.width = "0px";
}

function resetNavContacto() {
    document.getElementById("myAsistentesnav").style.marginLeft = "0px";
}

function closeNav(nav) {
    document.getElementById(nav).style.width = "0";
}

function closeNavPrincipal(){
    $( "#navegacion" ).toggle("slide");
    $("#esconder-navegacion").toggleClass("glyphicon-chevron-right glyphicon-chevron-left");

    var contenedorGridStack = document.getElementById("contenedorGridStack");

    //Cuando se oculta el menu, cambiar width de contenedorGridStack a 100%, cuando se muestra establecer valor original
    if(contenedorGridStack.style.width == "100%")
        contenedorGridStack.style.width = "85%";
    else
        contenedorGridStack.style.width = "100%";

}

function informacion() {
   // document.getElementById("Contactonav").style.width = "180px";

}


