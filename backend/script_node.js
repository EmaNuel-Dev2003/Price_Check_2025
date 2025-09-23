const spawn = require("child_process").spawn

console.log("Ejecutando script_node.js")
const cantidad = process.argv[2]; // Obtén el argumento "cantidad"
const subcategoria = process.argv[3]; // Obtén el argumento "ruta_sub"
const supermercado = process.argv[4]; // Obtén el argumento "supermercado"

console.log(`Cantidad recibida: ${cantidad}`);
console.log(`Subcategoria recibida: ${subcategoria}`);
console.log(`Supermercado recibido: ${supermercado}`);


if (!cantidad) {
  console.error("Error: No se proporcionó la cantidad.");
  // process.exit(1); // Salida con error si no se recibe la cantidad
}

var ruta_sub = "nada";
var ScriptSupermercado="";

if (supermercado === "tienda_inglesa"){
  ScriptSupermercado="ScrapingTE.py" 

  if (subcategoria === "opcion1") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/aceites-vinagres/78/79";
  }
  if (subcategoria === "opcion2") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/aderezos-y-salsas/78/96";
  }
  if (subcategoria === "opcion3") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/alimentos-en-polvo/78/125";
  }
  if (subcategoria === "opcion4") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/arroz-legumbres/78/84";
  }
  if (subcategoria === "opcion5") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/azucar-edulcorante/78/87";
  }
  if (subcategoria === "opcion6") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/cafe-cebada-cocoa/78/88";
  }
  if (subcategoria === "opcion7") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/caldos-sopas/78/163";
  }
  if (subcategoria === "opcion8") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/conservas/78/106";
  }
  if (subcategoria === "opcion9") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/copetin/78/118";
  }
  if (subcategoria === "opcion10") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/galletas/78/140";
  }
  if (subcategoria === "opcion11") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/golosinas-chocolates/78/199";
  }
  if (subcategoria === "opcion12") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/harina-levaduras-pure/78/146";
  }
  if (subcategoria === "opcion13") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/huevos/78/150";
  }
  if (subcategoria === "opcion14") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/pastas-pizzas-tapas/78/151";
  }
  if (subcategoria === "opcion15") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/preparaciones-de-postres-coberturas/78/156";
  }
  if (subcategoria === "opcion16") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/te-infusiones/78/166";
  }
  if (subcategoria === "opcion17") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/yerba/78/172";
  }
  if (subcategoria === "opcion18") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/cereales-avenas-semillas/78/95";
  }
  if (subcategoria === "opcion19") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/dulces-mermeladas-miel/78/134";
  }
  if (subcategoria === "opcion20") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/especias-sal-sazonadores/78/1242";
  }
  if (subcategoria === "opcion21") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/carnes/1894/173";
  }
  if (subcategoria === "opcion22") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/pescados-mariscos/1894/179";
  }
  if (subcategoria === "opcion23") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/fiambres/1894/231";
  }
  if (subcategoria === "opcion24") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/quesos/1894/237";
  }
  if (subcategoria === "opcion25") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/frutas/1894/195";
  }
  if (subcategoria === "opcion26") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/verduras/1894/196";
  }
  if (subcategoria === "opcion27") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/lacteos/1894/209";
  }
  if (subcategoria === "opcion28") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/panaderia/1894/217";
  }
  if (subcategoria === "opcion29") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/rotiseria/1894/245";
  }
  if (subcategoria === "opcion30") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/frescos/pastas-frescas/1894/152";
  }
  if (subcategoria === "opcion31") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/bebidas/bebidas-con-alcohol/1001/1";
  }
  if (subcategoria === "opcion32") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/bebidas/bebidas-sin-alcohol/1001/64";
  }
  if (subcategoria === "opcion33") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/carnes-aves/181/182";
  }
  if (subcategoria === "opcion34") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/comidas-preparadas-congeladas/181/183";
  }
  if (subcategoria === "opcion35") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/frutas-verduras-congeladas/181/184";
  }
  if (subcategoria === "opcion36") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/hamburguesas/181/185";
  }
  if (subcategoria === "opcion37") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/panificados-congelados/181/187";
  }
  if (subcategoria === "opcion38") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/papas-congeladas/181/6080";
  }
  if (subcategoria === "opcion39") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/pescados-mariscos-congelados/181/188";
  }
  if (subcategoria === "opcion40") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/pizzas-congeladas/181/189";
  }
  if (subcategoria === "opcion41") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/congelados/postres-helados/181/190";
  }
  if (subcategoria === "opcion42") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/limpieza/limpieza-de-banos/1895/8421";
  }
  if (subcategoria === "opcion43") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/limpieza/limpieza-de-cocina/1895/8422";
  }
  if (subcategoria === "opcion44") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/limpieza/limpieza-de-hogar/1895/543";
  }
  if (subcategoria === "opcion45") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/limpieza/limpieza-de-pisos-y-muebles/1895/8420";
  }
  if (subcategoria === "opcion46") {
    ruta_sub = "https://www.tiendainglesa.com.uy/supermercado/categoria/limpieza/limpieza-de-ropa/1895/566";
  }
  
  
  
}else{
  ScriptSupermercado="ScrapingTata.py" 
  
  if (subcategoria === "opcion1") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/cafe";
  }
  if (subcategoria === "opcion2") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/cereales";
  }
  if (subcategoria === "opcion3") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/cocoa";
  }
  if (subcategoria === "opcion4") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/dulce-de-leche";
  }
  if (subcategoria === "opcion5") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/mermeladas-y-dulces";
  }
  if (subcategoria === "opcion6") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/te";
  }
  if (subcategoria === "opcion7") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/yerbas";
  }
  if (subcategoria === "opcion8") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/galletitas-dulces";
  }
  if (subcategoria === "opcion9") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/galletitas-saladas";
  }
  if (subcategoria === "opcion10") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/reposteria";
  }
  if (subcategoria === "opcion11") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/azucar-y-edulcorantes";
  }
  if (subcategoria === "opcion12") {
    ruta_sub = "https://www.tata.com.uy/almacen/desayuno/leche-en-polvo";
  }
  if (subcategoria === "opcion13") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/aceites";
  }
  if (subcategoria === "opcion14") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/vinagres";
  }
  if (subcategoria === "opcion15") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/mayonesa";
  }
  if (subcategoria === "opcion16") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/mostaza";
  }
  if (subcategoria === "opcion17") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/ketchup";
  }
  if (subcategoria === "opcion18") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/salsas-especiales";
  }
  if (subcategoria === "opcion19") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/sal";
  }
  if (subcategoria === "opcion20") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/saborizadores";
  }
  if (subcategoria === "opcion21") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceites-y-aderezos/otros-condimentos";
  }
  if (subcategoria === "opcion22") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/alfajores";
  }
  if (subcategoria === "opcion23") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/barritas";
  }
  if (subcategoria === "opcion24") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/bocaditos-y-bombones";
  }
  if (subcategoria === "opcion25") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/caramelos-chupetines-y-gomitas";
  }
  if (subcategoria === "opcion26") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/chicles";
  }
  if (subcategoria === "opcion27") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/pastillas";
  }
  if (subcategoria === "opcion28") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/tabletas-de-chocolate";
  }
  if (subcategoria === "opcion29") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/turrones";
  }
  if (subcategoria === "opcion30") {
    ruta_sub = "https://www.tata.com.uy/almacen/golosinas-y-chocolates/popcorn";
  }
  if (subcategoria === "opcion31") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/otros-panificados";
  }
  if (subcategoria === "opcion32") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/pan-de-molde";
  }
  if (subcategoria === "opcion33") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/pan-tortuga-y-viena";
  }
  if (subcategoria === "opcion34") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/budines-y-pan-dulce";
  }
  if (subcategoria === "opcion35") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/tostadas";
  }
  if (subcategoria === "opcion36") {
    ruta_sub = "https://www.tata.com.uy/almacen/panificados/pan-rallado";
  }
  if (subcategoria === "opcion37") {
    ruta_sub = "https://www.tata.com.uy/almacen/snacks/frutos-secos";
  }
  if (subcategoria === "opcion38") {
    ruta_sub = "https://www.tata.com.uy/almacen/snacks/papas-fritas";
  }
  if (subcategoria === "opcion39") {
    ruta_sub = "https://www.tata.com.uy/almacen/snacks/mani";
  }
  if (subcategoria === "opcion40") {
    ruta_sub = "https://www.tata.com.uy/almacen/snacks/palitos";
  }
  if (subcategoria === "opcion41") {
    ruta_sub = "https://www.tata.com.uy/almacen/snacks/otros-snacks";
  }
  if (subcategoria === "opcion42") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceitunas-y-encurtidos/aceitunas";
  }
  if (subcategoria === "opcion43") {
    ruta_sub = "https://www.tata.com.uy/almacen/aceitunas-y-encurtidos/encurtidos";
  }
  if (subcategoria === "opcion44") {
    ruta_sub = "https://www.tata.com.uy/almacen/conservas/conservas-de-verdura-y-legumbres";
  }
  if (subcategoria === "opcion45") {
    ruta_sub = "https://www.tata.com.uy/almacen/conservas/conserva-de-pescado";
  }
  if (subcategoria === "opcion46") {
    ruta_sub = "https://www.tata.com.uy/almacen/conservas/conserva-de-carne";
  }
  if (subcategoria === "opcion47") {
    ruta_sub = "https://www.tata.com.uy/almacen/conservas/conserva-de-frutas";
  }
  if (subcategoria === "opcion48") {
    ruta_sub = "https://www.tata.com.uy/almacen/arroz-harina-y-legumbres/arroz";
  }
  if (subcategoria === "opcion49") {
    ruta_sub = "https://www.tata.com.uy/almacen/arroz-harina-y-legumbres/harina-y-polenta";
  }
  if (subcategoria === "opcion50") {
    ruta_sub = "https://www.tata.com.uy/almacen/arroz-harina-y-legumbres/legumbres";
  }
  if (subcategoria === "opcion51") {
    ruta_sub = "https://www.tata.com.uy/almacen/sopas-caldos-y-pure/sopas";
  }
  if (subcategoria === "opcion52") {
    ruta_sub = "https://www.tata.com.uy/almacen/sopas-caldos-y-pure/caldos";
  }
  if (subcategoria === "opcion53") {
    ruta_sub = "https://www.tata.com.uy/almacen/sopas-caldos-y-pure/pure";
  }
  if (subcategoria === "opcion54") {
    ruta_sub = "https://www.tata.com.uy/almacen/pastas-y-salsas/pastas";
  }
  if (subcategoria === "opcion55") {
    ruta_sub = "https://www.tata.com.uy/almacen/pastas-y-salsas/salsas";
  }
  if (subcategoria === "opcion56") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/huevos";
  }
  if (subcategoria === "opcion57") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/leches";
  }
  if (subcategoria === "opcion58") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/mantecas-y-margarinas";
  }
  if (subcategoria === "opcion59") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/crema-de-leche";
  }
  if (subcategoria === "opcion60") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/levaduras-y-grasas";
  }
  if (subcategoria === "opcion61") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/postres";
  }
  if (subcategoria === "opcion62") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/quesos-untables";
  }
  if (subcategoria === "opcion63") {
    ruta_sub = "https://www.tata.com.uy/frescos/lacteos/yogures";
  }
  if (subcategoria === "opcion64") {
    ruta_sub = "https://www.tata.com.uy/frescos/pastas-y-masas/masas-de-tarta";
  }
  if (subcategoria === "opcion65") {
    ruta_sub = "https://www.tata.com.uy/frescos/pastas-y-masas/masas-de-empanada";
  }
  if (subcategoria === "opcion66") {
    ruta_sub = "https://www.tata.com.uy/frescos/pastas-y-masas/pastas-rellenas";
  }
  if (subcategoria === "opcion67") {
    ruta_sub = "https://www.tata.com.uy/frescos/pastas-y-masas/pastas-simples";
  }
  if (subcategoria === "opcion68") {
    ruta_sub = "https://www.tata.com.uy/frescos/carniceria/atados-y-carbon";
  }
  if (subcategoria === "opcion69") {
    ruta_sub = "https://www.tata.com.uy/frescos/carniceria/carne-vacuna";
  }
  if (subcategoria === "opcion70") {
    ruta_sub = "https://www.tata.com.uy/frescos/carniceria/carne-de-cerdo";
  }
  if (subcategoria === "opcion71") {
    ruta_sub = "https://www.tata.com.uy/frescos/carniceria/pollo";
  }
  if (subcategoria === "opcion72") {
    ruta_sub = "https://www.tata.com.uy/frescos/carniceria/embutidos-y-achuras";
  }
  if (subcategoria === "opcion73") {
    ruta_sub = "https://www.tata.com.uy/frescos/fiambreria/fiambres-y-embutidos";
  }
  if (subcategoria === "opcion74") {
    ruta_sub = "https://www.tata.com.uy/frescos/fiambreria/frankfurters";
  }
  if (subcategoria === "opcion75") {
    ruta_sub = "https://www.tata.com.uy/frescos/fiambreria/quesos-especiales";
  }
  if (subcategoria === "opcion76") {
    ruta_sub = "https://www.tata.com.uy/frescos/fiambreria/quesos";
  }
  if (subcategoria === "opcion77") {
    ruta_sub = "https://www.tata.com.uy/frescos/fiambreria/queso-rallado";
  }
  if (subcategoria === "opcion78") {
    ruta_sub = "https://www.tata.com.uy/frescos/frutas-y-verduras/frutas";
  }
  if (subcategoria === "opcion79") {
    ruta_sub = "https://www.tata.com.uy/frescos/frutas-y-verduras/verduras";
  }
  if (subcategoria === "opcion80") {
    ruta_sub = "https://www.tata.com.uy/frescos/rotiseria/otros";
  }
  if (subcategoria === "opcion81") {
    ruta_sub = "https://www.tata.com.uy/frescos/panaderia";
  }
  if (subcategoria === "opcion82") {
    ruta_sub = "https://www.tata.com.uy/congelados/pasta";
  }
  if (subcategoria === "opcion83") {
    ruta_sub = "https://www.tata.com.uy/congelados/vegetales";
  }
  if (subcategoria === "opcion84") {
    ruta_sub = "https://www.tata.com.uy/congelados/helados-y-postres/helados";
  }
  if (subcategoria === "opcion85") {
    ruta_sub = "https://www.tata.com.uy/congelados/helados-y-postres/postres";
  }
  if (subcategoria === "opcion86") {
    ruta_sub = "https://www.tata.com.uy/congelados/hamburguesas-y-milanesas/hamburguesas";
  }
  if (subcategoria === "opcion87") {
    ruta_sub = "https://www.tata.com.uy/congelados/hamburguesas-y-milanesas/milanesas";
  }
  if (subcategoria === "opcion88") {
    ruta_sub = "https://www.tata.com.uy/congelados/pescados";
  }
  if (subcategoria === "opcion89") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/guarniciones";
  }
  if (subcategoria === "opcion90") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/pizza";
  }
  if (subcategoria === "opcion91") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/pollo";
  }
  if (subcategoria === "opcion92") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/otras-comidas-congeladas";
  }
  if (subcategoria === "opcion93") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/empanadas-y-tartas";
  }
  if (subcategoria === "opcion94") {
    ruta_sub = "https://www.tata.com.uy/congelados/comidas-congeladas/papas";
  }
  if (subcategoria === "opcion95") {
    ruta_sub = "https://www.tata.com.uy/congelados/frutas";
  }
  if (subcategoria === "opcion96") {
    ruta_sub = "https://www.tata.com.uy/limpieza/desodorante-de-ambiente";
  }
  if (subcategoria === "opcion97") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/detergentes";
  }
  if (subcategoria === "opcion98") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/lavavajillas";
  }
  if (subcategoria === "opcion99") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/limpiadores-de-cocina";
  }
  if (subcategoria === "opcion100") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/limpiadores-de-bano";
  }
  if (subcategoria === "opcion101") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/limpiadores-cremosos";
  }
  if (subcategoria === "opcion102") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/limpiadores-especificos";
  }
  if (subcategoria === "opcion103") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-banos-y-cocina/lavandina";
  }
  if (subcategoria === "opcion104") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-pisos-y-muebles/limpiadores-de-piso";
  }
  if (subcategoria === "opcion105") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-pisos-y-muebles/limpia-muebles";
  }
  if (subcategoria === "opcion106") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-pisos-y-muebles/ceras-y-autobrillos";
  }
  if (subcategoria === "opcion107") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/jabon-liquido";
  }
  if (subcategoria === "opcion108") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/jabon-en-polvo";
  }
  if (subcategoria === "opcion109") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/jabon-en-barra";
  }
  if (subcategoria === "opcion110") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/suavizantes";
  }
  if (subcategoria === "opcion111") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/prelavados-y-quitamanchas";
  }
  if (subcategoria === "opcion112") {
    ruta_sub = "https://www.tata.com.uy/limpieza/limpieza-de-ropa/perfume-para-tela";
  }
  if (subcategoria === "opcion113") {
    ruta_sub = "https://www.tata.com.uy/limpieza/papeles/papel-higienico";
  }
  if (subcategoria === "opcion114") {
    ruta_sub = "https://www.tata.com.uy/limpieza/papeles/rollos-de-cocina";
  }
  if (subcategoria === "opcion115") {
    ruta_sub = "https://www.tata.com.uy/limpieza/papeles/servilletas";
  }
  if (subcategoria === "opcion116") {
    ruta_sub = "https://www.tata.com.uy/limpieza/papeles/panuelos";
  }
  if (subcategoria === "opcion117") {
    ruta_sub = "https://www.tata.com.uy/limpieza/insecticidas-plaguicidas-y-repelentes/insecticidas";
  }
  if (subcategoria === "opcion118") {
    ruta_sub = "https://www.tata.com.uy/limpieza/insecticidas-plaguicidas-y-repelentes/repelentes";
  }
  if (subcategoria === "opcion119") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/guantes-esponjas-y-panos";
  }
  if (subcategoria === "opcion120") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/escobas-mopas-y-cepillos";
  }
  if (subcategoria === "opcion121") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/baldes-y-palanganas";
  }
  if (subcategoria === "opcion122") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/fosforos-y-encendedores";
  }
  if (subcategoria === "opcion123") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/bolsa-residuos";
  }
  if (subcategoria === "opcion124") {
    ruta_sub = "https://www.tata.com.uy/limpieza/accesorios-de-limpieza/otros-accesorios";
  }
  if (subcategoria === "opcion125") {
    ruta_sub = "https://www.tata.com.uy/limpieza/otros-limpiadores/autos";
  }
  if (subcategoria === "opcion126") {
    ruta_sub = "https://www.tata.com.uy/limpieza/otros-limpiadores/calzado";
  }
  
  
 

} 

// Parámetros a enviar
const cant_prod = cantidad;
const url = ruta_sub;
const parametros = `${url}|${cant_prod}`; // Delimitador claro "|"

const pythonProcess = spawn("python",[ScriptSupermercado])

let pythonResponse = ""

pythonProcess.stdout.on("data",function(data){
   pythonResponse += data.toString()
})

// Capturar el evento "end" para procesar la respuesta completa
/*
pythonProcess.stdout.on("end", function () {
  try {
    const productos = JSON.parse(pythonResponse); // Parsear JSON recibido
    console.log("Productos recibidos desde Python:", productos);
    // Aquí puedes procesar los productos o guardarlos en una base de datos
  } catch (error) {
    console.error("Error al parsear JSON:", error.message);
  }
}); */

// pythonProcess.stdout.on("end",function(){
//   console.log(pythonResponse)
// })
// Manejar errores en el proceso Python

/*
pythonProcess.stderr.on("data", (data) => {
  console.error("Error en Python:", data.toString());
});
*/

// Enviar los parámetros al script de Python
pythonProcess.stdin.write(parametros + "\n"); // Asegúrate de incluir un salto de línea
pythonProcess.stdin.end();



