from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import psycopg
from datetime import date
from decimal import Decimal
import sys
import json

def scroll(browser,):
 lenOfPage = browser.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
 match=False

 while match == False:
    lastCount = lenOfPage
    time.sleep(3)
    lenOfPage = browser.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
    if lastCount==lenOfPage:
        match=True


def obtener_productos(browser,listProductos,cant_prod):
 source_data = browser.page_source
 scroll(browser)
 soup = BeautifulSoup(source_data,"html.parser")
 if soup.findAll(['script','style']):
    [x.extract() for x in soup.findAll(['script','style'])]

 if soup.findAll(['meta']):
    [y.extract() for y in soup.findAll(['meta'])]

 if soup.findAll(['noscript']):
    [z.extract() for z in soup.findAll(['noscript'])]

 if soup.findAll(['link']):
    [a.extract() for a in soup.findAll(['link'])]

 
 
 subcategoria = asignar_categoria(browser)
  
  #Obtiene la info de los productos de la subcategoría
 for item in browser.find_elements(By.CSS_SELECTOR,".card-product-container"):
    result={}
    result['Id']=item.find_element(By.CSS_SELECTOR,".card-product-name-and-price > a").get_attribute("href").split(".")[-1]
    result['Nombre']=item.find_element(By.CSS_SELECTOR,".card-product-body > div > a > span").text.strip()
   # result['Precio anterior'] = item.find_element(By.CSS_SELECTOR,".wTxtProductPriceBefore.wTxtProductPriceBeforeDesc").text.strip()
    precio_texto = item.find_element(By.CLASS_NAME, "ProductPrice").text.strip()
    precio_limpio = precio_texto.replace("$", "").replace(".", "").replace(",", ".").strip()
    result["precio"] = float(precio_limpio)
    result['OFF']=item.find_element(By.CSS_SELECTOR,".card-product-promo").text
    result['Img']=item.find_element(By.CSS_SELECTOR, ".card-product-container-img > a > img").get_attribute("data-src") or item.find_element(By.CSS_SELECTOR, ".card-product-container-img > a > img").get_attribute("src")
    result['Url']=item.find_element(By.CSS_SELECTOR,".card-product-name-and-price > a").get_attribute("href")
    result['Fecha']= date.today()
    result['Subcategoría'] = subcategoria
    result['IdSupermercado'] = "21"
    if cant_prod == len(listProductos):
       break
    listProductos.append(result)


 

def contar_paginas_Productos(browser,url):         
 
 
 browser.get(url)
 paginacion_container = browser.find_element(By.ID,"W0074SECTION1") #Obtiene el contenedor del componente de paginación 
 paginacion_buttons = paginacion_container.find_elements(By.TAG_NAME,"a") #Obtiene los botones o links del componente
 time.sleep(3)
 cant_pages = len(paginacion_buttons) 
 

 return cant_pages


def recorrer_paginacion(browser,url,listProductos,cant_prod_a_extraer):
   cant_pages = contar_paginas_Productos(browser,url)
      
   url_defoult='https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/aceites-vinagres/78/79'
   
   # browser.get(url)
   contador = 0
   # aux=2
   try:
   
     while len(listProductos) < cant_prod_a_extraer:
       print("Categoría: " + url)
       if contador == cant_pages:
         browser.get(url)
         time.sleep(3)
         obtener_productos(browser,listProductos,cant_prod_a_extraer)
       aux = browser.find_element(By.ID, 'W0074TEXTBLOCK15').find_element(By.TAG_NAME, "a").get_attribute("href")
       
       
    
       
       while contador<cant_pages: 
         url_siguiente= aux[:-1] + str(contador)
         browser.get(url_siguiente)
         time.sleep(3)
         obtener_productos(browser,listProductos,cant_prod_a_extraer)
         #  print("Pagina actual: " + "" + str(contador) + "" + url_siguiente)
         contador=contador+1
         if contador==cant_pages:
          break
         if cant_prod_a_extraer == len(listProductos):
          break
       
       if cant_prod_a_extraer > len(listProductos):
         print(f'Cantidad máxima de productos {len(listProductos)}')
         break
        
   except:
      print("Página no encontrada")
       
       
   print("Cantidad de páginas: " + str(cant_pages))
     
   
      

def guardar_productos_bd(listProductos):
   #Conexión a la BD
   conexion = psycopg.connect(user='postgres',
                           password='Programador321',
                           host='localhost',
                           port='5432',
                           dbname='bd_prueba_productos')

   #Utilizar cursor 
   cursor = conexion.cursor()
   
   sql_productos = 'INSERT INTO public.productos("Nombre", "FechaIngreso", "idSubcategoria", "Precio", "OFF", "URL", img, "idSupermercado") VALUES (%s,%s,%s,%s,%s,%s,%s,%s);'
   
   for producto in listProductos:
       nombre = producto['Nombre']
       fecha = producto['Fecha']
       subcategoria =producto['Subcategoría']
       precio = producto['precio']
       off = producto['OFF']
       url = producto['Url']
       img = producto['Img']
       idSupermercado = producto['IdSupermercado']
   
       datos = (nombre,fecha,subcategoria,precio,off,url,img,idSupermercado)
   
       cursor.execute(sql_productos,datos)
       conexion.commit()
       registro = cursor.rowcount
       print(f"Registro insertado exitosamente: {registro}")
       
   cursor.close()
   conexion.close()
   
def asignar_categoria(browser):

   subcategoria="ninguna"

   if "aceites-vinagres" in browser.page_source:
      subcategoria = 19
   elif "aderezos-y-salsas/78/96" in browser.page_source:
       subcategoria = 20
   elif "alimentos-en-polvo" in browser.page_source:
      subcategoria = 21
   elif "arroz-legumbres" in browser.page_source:
      subcategoria = 22
   elif "azucar-edulcorante" in browser.page_source:
      subcategoria = 23
   elif "cafe-cebada-cocoa" in browser.page_source:
      subcategoria = 24
   elif "caldos-sopas" in browser.page_source:
      subcategoria = 25
   elif "conservas" in browser.page_source:
      subcategoria = 26
   elif "copetin" in browser.page_source:
      subcategoria = 27
   elif "galletas" in browser.page_source:
      subcategoria = 28
   elif "golosinas-chocolates" in browser.page_source:
      subcategoria = 29
   elif "harina-levaduras-pure" in browser.page_source:
      subcategoria = 30
   elif "huevos" in browser.page_source:
      subcategoria = 31
   elif "pastas-pizzas-tapas" in browser.page_source:
      subcategoria = 32
   elif "preparaciones-de-postres-coberturas" in browser.page_source:
      subcategoria = 33
   elif "te-infusiones" in browser.page_source:
      subcategoria = 34
   elif "yerba" in browser.page_source:
      subcategoria = 35
   elif "cereales-avenas-semillas" in browser.page_source:
      subcategoria = 36
   elif "dulces-mermeladas-miel" in browser.page_source:
      subcategoria = 37
   elif "especias-sal-sazonadores" in browser.page_source:
      subcategoria = 38
   elif "carnes" in browser.page_source:
      subcategoria = 39
   elif "pescados-mariscos" in browser.page_source:
      subcategoria = 40
   elif "fiambres" in browser.page_source:
      subcategoria = 41
   elif "quesos" in browser.page_source:
      subcategoria = 42
   elif  "frutas" in browser.page_source:
      subcategoria = 43
   elif  "verduras" in browser.page_source:
      subcategoria = 44
   elif  "lacteos" in browser.page_source:
      subcategoria = 45
   elif  "panaderia" in browser.page_source:
      subcategoria = 46
   elif  "rotiseria" in browser.page_source:
      subcategoria = 47
   elif  "pastas-frescas" in browser.page_source:
      subcategoria = 48
   elif  "bebidas-con-alcohol" in browser.page_source:
      subcategoria = 49
   elif  "bebidas-sin-alcohol" in browser.page_source:
      subcategoria = 50
   elif  "carnes-aves" in browser.page_source:
      subcategoria = 51
   elif  "comidas-preparadas-congeladas" in browser.page_source:
      subcategoria = 52
   elif  "frutas-verduras-congeladas" in browser.page_source:
      subcategoria = 53
   elif  "hamburguesas" in browser.page_source:
      subcategoria = 54
   elif  "panificados-congelados" in browser.page_source:
      subcategoria = 55
   elif  "papas-congeladas" in browser.page_source:
      subcategoria = 56
   elif  "pescados-mariscos-congelados" in browser.page_source:
      subcategoria = 57
   elif  "pizzas-congeladas" in browser.page_source:
      subcategoria = 58
   elif  "postres-helados" in browser.page_source:
      subcategoria = 59
   elif  "limpieza-de-banos" in browser.page_source:
      subcategoria = 60
   elif  "limpieza-de-cocina" in browser.page_source:
      subcategoria = 61
   elif  "limpieza-de-hogar" in browser.page_source:
      subcategoria = 62
   elif  "limpieza-de-pisos-y-muebles" in browser.page_source:
      subcategoria = 63
   elif  "limpieza-de-ropa" in browser.page_source:
      subcategoria = 64


   return subcategoria

def custom_serializer(obj):
    if isinstance(obj, date):
        return obj.isoformat()  # Convierte a una cadena en formato ISO 8601
    raise TypeError(f"Tipo no serializable: {type(obj)}")


def main():
   
 options = Options()
 user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
 options.add_argument(f"user-agent={user_agent}")
 options.add_argument("--headless")
 options.add_argument("--incognito")
 ruta = ChromeDriverManager().install()
 s = Service(ruta)
 browser = webdriver.Chrome(service= s , options=options)
 
#  url_Prueba = "https://www.tiendainglesa.com.uy/supermercado/categoria/almacen/aceites-vinagres/78/79"
 
 
 options.add_argument("--incognito")
 # driverPath = "driver/chromedriver.exe"

 listProductos=[]

 
#  while True:
#      aux=0
#      aux = int(input("Ingrese la cantidad de productos a extraer (1-100): "))
     
#      if aux >= 1 and aux <= 100:
#        cant_prod= aux
#        break
 
 datos = sys.stdin.readline().strip()

 # Separar URL y cantidad de productos usando "|" como delimitador
 try:
    url_Prueba, cant_prod = datos.split("|")
    cant_prod = int(cant_prod)
   #  print("URL recibida al script Python:", url_Prueba, file=sys.stderr)  # Mensaje de depuración
   #  print("Cantidad de productos al script Python:", cant_prod, file=sys.stderr)  # Mensaje de depuración
 except ValueError:
    print("Error: Los datos recibidos no están en el formato esperado.")
    sys.stdout.flush()
    sys.exit(1)



 if cant_prod != 0:
    
    
   if cant_prod > 40:
    browser.get(url_Prueba)
    recorrer_paginacion(browser,url_Prueba,listProductos,cant_prod)   
   if cant_prod <= 40:
     browser.get(url_Prueba)
     time.sleep(3)
     obtener_productos(browser,listProductos,cant_prod)
     
   # print(listProductos)
   # print("Cantidad total de productos: " + str(len(listProductos)))
   guardar_productos_bd(listProductos)
   # Convertir la lista a JSON y enviarla por stdout
  
#  productos_json = json.dumps(listProductos, default=custom_serializer)
#  print(productos_json)
 sys.stdout.flush() 


# Punto de entrada del programa
if __name__ == "__main__":
   main()

