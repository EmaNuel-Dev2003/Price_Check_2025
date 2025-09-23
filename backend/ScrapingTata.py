from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from decimal import Decimal
from datetime import date
import re
import psycopg
import requests
import sys
import json


def obtener_productos(browser, response,cantProductos):
    """
    Función para extraer productos desde una página con scroll infinito.
    """
    # print("Iniciando extracción de productos..." , file=sys.stderr)
    
    subcategoria = asignar_subcategorias(browser)
    # Esperar a que se cargue la primera tanda de productos
    WebDriverWait(browser, 16).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".product-card-module--fs-product-card--143c3")))

    # Configuración inicial
    SCROLL_PAUSE_TIME = 2
    previous_count = 0
        
    # Bucle para cargar productos con scroll infinito
    while True:
        # Encuentra todos los productos visibles actualmente
        product_cards = browser.find_elements(By.CSS_SELECTOR, ".product-card-module--fs-product-card--143c3",)
        
      
        # Si no se encontraron nuevos productos, salimos del bucle
        if len(product_cards) == previous_count:
            # print("No se encontraron nuevos productos. Finalizando extracción.", file=sys.stderr)
            break
        
        
        # Procesar los nuevos productos
        for card in product_cards[previous_count:]:  # Solo procesamos nuevos productos
            try:
                ActionChains(browser).move_to_element(card).perform()  # Desplazarse al producto
                time.sleep(0.5)  # Pausa breve para cargar dinámicamente

                result = {}
                result["nombre"] = card.find_element(By.CSS_SELECTOR, "section > div > h3 > a").text.strip()

                # Procesar precio
                precio_text = card.find_element(By.CSS_SELECTOR, '.price-module--fs-price--9b997.text__body').text.strip()
                precio_limpio = precio_text.replace("$", "").replace(".", "").replace(",", ".").strip()
                result["precio"] = float(precio_limpio)

                # Procesar oferta (si existe)
                off_elements = card.find_elements(By.XPATH, './/div[@data-testid="store-badge"]//span')
                result["off"] = off_elements[0].text.strip() if off_elements else ""

                # Procesar imagen y URL
                result["img"] = card.find_element(By.CSS_SELECTOR, 'article > div > div > a > img').get_attribute('src')
                result["url"] = card.find_element(By.CSS_SELECTOR, 'article > div > div > a').get_attribute('href')

                # Agregar fecha actual
                result["fecha"] = date.today()
                
                result["subcategoria"] = subcategoria
                result['IdSupermercado'] = "22"
                
                if len(response) == cantProductos:
                   break

                # Añadir a la respuesta
                response.append(result)
                
            except Exception as e:
                print(f"Error procesando un elemento: {e}",file=sys.stderr)

        # Actualizar el número de productos procesados
        previous_count = len(product_cards)

        # Desplazar hacia abajo para cargar más productos
        browser.execute_script("window.scrollBy(0, 500);")  # Desplazar 500 píxeles
        time.sleep(SCROLL_PAUSE_TIME)  # Pausa para permitir la carga de nuevos productos

    # Imprimir resultados finales
    # print(f"Cantidad total de productos extraídos: {len(response)}" , file=sys.stderr)
    return response


def asignar_subcategorias(browser):
    subcategoria="ninguna"

    if  re.search(r"\b(aceites|vinagres)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 19
    elif re.search(r"\b(mayonesa|ketchup|mostaza|salsa|salsas|)\b",  browser.current_url): #Si se filtra como 'aderezos'produce errores de enumeración 
        subcategoria = 20
    if  re.search(r"\b(alimentos-en-polvo|alimento-en-polvo)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 21
    if  re.search(r"\b(arroz|legumbres)\b", browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 22
    if  re.search(r"\b(edulcorante|edulcorantes|azucar|azucares)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 23
    if  re.search(r"\b(cafe|cebada|cebadas|cocoa|cocoas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 24
    if  re.search(r"\b(caldo|caldos|sopa|sopas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 25
    if  re.search(r"\b(conserva|conservas)\b",  browser.current_url):
         subcategoria = 26
    if  re.search(r"\b(copetin|snacks)\b",  browser.current_url):
        subcategoria = 27
    if  re.search(r"\b(galletitas)\b",  browser.current_url):
        subcategoria = 28
    if  re.search(r"\b(golosinas-y-chocolates)\b",  browser.current_url):
        subcategoria = 29
    if  re.search(r"\b(harina-y-polenta|levadura|pure)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 30
    if  re.search(r"\b(huevos)\b",  browser.current_url):
        subcategoria = 31
    if  re.search(r"\b(pastas|pasta|pizzas|pizza|tapas|tapa)\b", browser.current_url):
        subcategoria = 32
    if  re.search(r"\b(preparaciones|postres|coberturas)\b", browser.current_url):
        subcategoria = 33
    if  re.search(r"\b(te|infusiones)\b",  browser.current_url):
        subcategoria = 34
    if  re.search(r"\b(yerbas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 35
    if  re.search(r"\b(cereal|cereales|avena|avenas|semilla|semillas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
         subcategoria = 36
    if  re.search(r"\b(mermeladas-y-dulces|dulce)\b",  browser.current_url):
        subcategoria = 37
    if  re.search(r"\b(especias|sal|sazonadores|saborizadores|otros-condimentos)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 38
    if  re.search(r"\b(carniceria)\b",  browser.current_url):
        subcategoria = 39
    if  re.search(r"\b(pescados|pescado|mariscos)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 40
    if  re.search(r"\b(fiambres-y-embutidos|frankfurters)\b",  browser.current_url):
        subcategoria = 41
    if  re.search(r"\b(quesos|queso)\b",  browser.current_url.rstrip('/')):
        subcategoria = 42
    if  re.search(r"\b(frutas|fruta)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 43
    if  re.search(r"\b(verduras)\b", browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 44
    if  re.search(r"\b(lacteos/leches|lacteos/mantecas-y-margarinas|lacteos/crema-de-leche|lacteos/levaduras-y-grasas|lacteos/postres|lacteos/quesos-untables|lacteos/yogures)\b", browser.current_url):
        subcategoria = 45
    if  re.search(r"\b(panaderia|panificados)\b",  browser.current_url):
        subcategoria = 46
    if  re.search(r"\b(rotiseria)\b",  browser.current_url):
        subcategoria = 47
    if  re.search(r"\b(pastas-y-masas)\b",  browser.current_url):
        subcategoria = 48  
    if  re.search(r"\b(cervezas|vinos-y-espumantes|whiskys-bebidas-blancas-y-aperitivos)\b",  browser.current_url):
        subcategoria = 49  
    if  re.search(r"\b(aguas|jugos|gaseosas|energizantes-e-isotonicas)\b",  browser.current_url):
        subcategoria = 50   
    if  re.search(r"\b(milanesas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 51
    if  re.search(r"\b(comidas-congeladas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 52
    if  re.search(r"\b(congelados/vegetales|congelados/frutas)\b",  browser.current_url):
        subcategoria = 53
    if re.search(r"\b(hamburguesas)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 54
    if  re.search(r"\b(panificados-congelados)\b",  browser.current_url.rstrip('/').split('/')[-1]):
        subcategoria = 55
    if  re.search(r"\b(comidas-congeladas/papas)\b",  browser.current_url):
        subcategoria = 56
    if  re.search(r"\b(congelados/pescados)\b",  browser.current_url):
        subcategoria = 57
    if  re.search(r"\b(comidas-congeladas/pizza)\b",  browser.current_url):
        subcategoria = 58
    if  re.search(r"\b(helados-y-postres)\b",  browser.current_url):
        subcategoria = 59
    if  re.search(r"\b(limpiadores-de-bano|lavandina|limpiadores-cremosos)\b",  browser.current_url):
        subcategoria = 60
    if  re.search(r"\b(limpiadores-de-cocina|detergentes|lavavajillas)\b",  browser.current_url):
        subcategoria = 61
    if  re.search(r"\b(limpieza-de-hogar|desodorante-de-ambiente|accesorios-de-limpieza|otros-limpiadores|papeles|insecticidas-plaguicidas-y-repelentes|limpiadores-especificos)\b",  browser.current_url):
        subcategoria = 62
    if  re.search(r"\b(limpieza-pisos-y-muebles)\b",  browser.current_url):
        subcategoria = 63
    if  re.search(r"\b(limpieza-de-ropa)\b",  browser.current_url):
        subcategoria = 64
        
    return subcategoria

def guardar_productos_bd(response):
    
    #Conexión a la BD
   conexion = psycopg.connect(user='postgres',
                           password='Programador321',
                           host='localhost',
                           port='5432',
                           dbname='bd_prueba_productos')

   #Utilizar cursor 
   cursor =conexion.cursor()
   
   sql_productos = 'INSERT INTO public.productos("Nombre", "FechaIngreso", "idSubcategoria", "Precio", "OFF", "URL", img, "idSupermercado") VALUES (%s,%s,%s,%s,%s,%s,%s,%s);'
   
    
   for producto in response:
       nombre = producto['nombre']
       fecha = producto['fecha']
       subcategoria =producto['subcategoria']
       precio = producto['precio'] 
       off = producto['off']
       url = producto['url']
       img = producto['img']
       idSupermercado = producto['IdSupermercado']
   
       datos = (nombre,fecha,subcategoria,precio,off,url,img,idSupermercado)
   
       cursor.execute(sql_productos,datos)
       conexion.commit()
       registro = cursor.rowcount
    #    print(f"Registro insertado exitosamente: {registro}",file=sys.stderr)
    
   cursor.close()
   conexion.close()


def es_url_valida(url):
    try:
        respuesta = requests.head(url, timeout=5)
        return respuesta.status_code == 200
    except requests.RequestException:
        return False

def custom_serializer(obj):
    if isinstance(obj, date):
        return obj.isoformat()  # Convierte a una cadena en formato ISO 8601
    raise TypeError(f"Tipo no serializable: {type(obj)}",file=sys.stderr)


def main():
  # Configuración del driver
  ruta = ChromeDriverManager().install()
  options = Options()
  user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
  options.add_argument(f"user-agent={user_agent}")
  options.add_argument("--headless")
  options.add_argument("--incognito")
  
  # options.add_argument("--incognito")
  s = Service(ruta)
  browser = webdriver.Chrome(service=s, options=options)
  response = []
  
  
  
 #   elementos = {'almacen': {'desayuno': ['cafe','cereales','cocoa'],'aceites-y-aderezos':['aceites','vinagres','mayonesa']},
 #                 'frescos':{'lacteos': ['huevos','leches']} 
      
 #     }

  elementos = {
    'almacen': {
        'desayuno': [
            'cafe', 'cereales', 'cocoa', 'dulce-de-leche', 
            'mermeladas-y-dulces', 'te', 'yerbas', 
            'galletitas-dulces', 'galletitas-saladas', 'reposteria', 
            'azucar-y-edulcorantes', 'leche-en-polvo'
        ],
        'aceites-y-aderezos': [
            'aceites', 'vinagres', 'mayonesa', 'mostaza', 
            'ketchup', 'salsas-especiales', 'sal', 
            'saborizadores', 'otros-condimentos'
        ],
        'snacks': [
            'frutos-secos', 'papas-fritas', 'mani', 
            'palitos', 'otros-snacks'
        ],
        'aceitunas-y-encurtidos': [
            'aceitunas', 'encurtidos'
        ],
        'conservas': [
            'conservas-de-verdura-y-legumbres', 
            'conserva-de-pescado', 'conserva-de-carne'
        ],
        'arroz-harina-y-legumbres': [
            'arroz', 'harina-y-polenta', 'legumbres'
        ],
        'sopas-caldos-y-pure': [
            'sopas', 'caldos', 'pure'
        ],
        'pastas-y-salsas': [
            'pastas', 'salsas'
        ],
        'golosinas-y-chocolates': [
            'alfajores', 'barritas', 'bocaditos-y-bombones', 
            'caramelos-chupetines-y-gomitas', 'chicles', 
            'pastillas', 'tabletas-de-chocolate', 
            'turrones', 'popcorn'
        ],
        'panificados': [
            'pan-de-molde', 
            'pan-tortuga-y-viena', 'budines-y-pan-dulce', 
            'tostadas', 'pan-rallado'
        ]
    },
    'frescos': {
        'lacteos': [
            'huevos', 'leches', 'mantecas-y-margarinas', 
            'crema-de-leche', 'levaduras-y-grasas', 
            'postres', 'quesos-untables', 'yogures'
        ],
        'pastas-y-masas': [
            'masas-de-tarta', 'masas-de-empanada', 
            'pastas-rellenas', 'pastas-simples'
        ],
        'carniceria': [
            'atados-y-carbon', 'carne-vacuna', 'carne-de-cerdo', 
            'pollo', 'embutidos-y-achuras'
        ],
        'fiambreria': [
            'fiambres-y-embutidos', 'frankfurters', 
            'quesos-especiales', 'quesos', 'queso-rallado'
        ],
        'frutas-y-verduras': [
            'frutas', 'verduras'
        ],
        'rotiseria': [
             'otros'
        ],
        'panaderia': [
            ''  # Sin productos especificados
        ]
    },
    'congelados': {
        'pasta': [''],
        'vegetales': [''],
        'helados-y-postres': [
            'helados', 'postres'
        ],
        'hamburguesas-y-milanesas': [
            'hamburguesas', 'milanesas'
        ],
        'pescados': [''],
        'comidas-congeladas': [
            'guarniciones', 'pizza', 'pollo', 'otras-comidas-congeladas',
            'empanadas-y-tartas', 'papas'
        ],
        'frutas': ['']
    },
    'bebidas': {
        'aguas': [''],
        'cerveza': [''],
        'jugos': [''],
        'gaseosas': [''],
        'vinos-y-espumantes': [''],
        'energizantes-e-isotonicas': [''],
        'whiskys-bebidas-blancas-y-aperitivos': ['']
    },
    'limpieza': {
        'desodorante-de-ambiente': [''],
        'limpieza-de-banos-y-cocina': [''],
        'limpieza-pisos-y-muebles': [''],
        'limpieza-de-ropa': [''],
        'papeles': [''],
        'insecticidas-plaguicidas-y-repelentes': [''],
        'accesorios-de-limpieza': [''],
        'otros-limpiadores':['']
        
    }
}
  
  elementosPrueba = {
      'almacen': {
       'aceites-y-aderezos': [
            'aceites', 'vinagres', 'mayonesa', 'mostaza', 
            'ketchup', 'salsas-especiales' 
            ]
        },
       'frescos': {
       'lacteos': [
            'huevos', 'leches', 'mantecas-y-margarinas', 
            'crema-de-leche', 'levaduras-y-grasas', 
            'postres', 'quesos-untables', 'yogures'
        ]
        },
       'congelados': {
            'vegetales': [''],
            'frutas': [''],
            'pescados': ['']
       },
        'limpieza': {
            'limpieza-de-banos-y-cocina': ['']
        }
       
    }
      

  datos = sys.stdin.readline().strip()
  
  try:
       url, cantProductos = datos.split("|")
       cantProductos=int(cantProductos)
    #    print("URL recibida al script Python:", url ,  file=sys.stderr)
    #    print("Cantidad de productos al script Python:", cantProductos,  file=sys.stderr)
     
     
       browser.get(url)
       time.sleep(10)
       obtener_productos(browser,response,cantProductos)
       # Serializar a JSON
       sys.stdout.flush() 

  except Exception as e:
       # Manejo de errores y salida a stderr
      print(f"Error: {str(e)}", file=sys.stderr)
      sys.exit(1)
    
  
   
             
             
 #   browser.close()        
        
  
 #   print(response)
  guardar_productos_bd(response)
 #   print(f"Cantidad total de productos: {len(response)}")
  
 
 
  
 

# Punto de entrada del programa'
if __name__ == "__main__":
   main()
