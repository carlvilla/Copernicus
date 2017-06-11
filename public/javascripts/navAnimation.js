function openNav(nav) {
    document.getElementById(nav).style.width = "15%";
    document.getElementById(nav).style.zIndex = "3";

    document.getElementById("myAsistentesnav").style.marginLeft = "0px";
}

function resetNavContacto() {
    document.getElementById("myAsistentesnav").style.marginLeft = "0px";
}

function closeNav(nav) {
    document.getElementById(nav).style.minWidth = "0px";
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