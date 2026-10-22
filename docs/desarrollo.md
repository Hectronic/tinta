# Desarrollo

[Volver a la documentación](README.md)

Tinta es una ventana pequeña alrededor de una página. No hay backend. Quien clone el repositorio tiene el programa entero.

## Piezas

`tinta.py` crea una `Gtk.ApplicationWindow`, mete un `WebKit2.WebView` y carga `index.html` con una URL `file://`. El directorio de la aplicación es el del script, así que da igual desde dónde se lance.

WebKit tiene permiso para leer archivos locales y el portapapeles. La consola de JavaScript sale por la salida estándar, útil cuando algo no se dibuja. Las herramientas de desarrollo del visor están apagadas.

El zoom del WebView se bloquea en 1. El zoom del documento es el de la página, no el del motor, para que un gesto del touchpad no encoja la interfaz.

Al cerrar, Python pregunta a `window.tinta.isDirty()`. Si hay tinta o campos cambiados, un diálogo nativo deja seguir o descartar. En el navegador el aviso lo pone `beforeunload`.

## El editor

Todo está en `index.html`: estilo, marcado y script. Está junto a propósito. Partirlo en módulos obligaría a un empaquetador y rompería el `file://` del escritorio.

Tres lienzos, del fondo a la superficie:

1. `pdf-canvas`, lo que pinta PDF.js.
2. `ink-canvas`, la tinta ya confirmada de esa página.
3. `live-canvas`, el trazo que todavía no se ha soltado.

Encima, `fields` coloca los controles del formulario, y `text-editor` es el área de texto mientras se escribe.

El estado vive en el objeto `state`. La tinta es `state.ink[númeroDePágina]`, una lista de trazos, sellos, textos y rectángulos. Las posiciones son fracciones de la página visual. Por eso un zoom no las desplaza.

El historial guarda, para cada paso, el antes y el después de la página, o el antes y el después de un campo. No es un diff. Cien pasos y se olvida el más viejo.

## Exportar

`download` elige el camino:

1. Si no hay cambios, copia los bytes originales.
2. Si `needsFlatten` (el PDF pidió contraseña), rasteriza con `exportFlattened`.
3. Si no, `exportOverlay`. Si esa llamada falla, avisa y cae en la copia visual.

`exportOverlay` abre el PDF con pdf-lib, dibuja un PNG de la tinta con `overlayPlacement` y aplica los campos. `useObjectStreams: false` evita un formato que algunos visores viejos leen mal.

La rotación es el punto frágil. PDF.js enseña la página ya girada. pdf-lib dibuja en el sistema de la página sin girar y rota la imagen alrededor de la esquina inferior izquierda. Las cuatro ramas de `overlayPlacement` hacen coincidir las esquinas. Un cambio ahí se prueba con páginas a 0, 90, 180 y 270 grados, no solo con un A4 de pie.

## Puente

En el escritorio, abrir y guardar no pueden ser el `<input type="file">` del navegador: el usuario espera el diálogo de GTK y una ruta de verdad.

La página hace `postMessage` con un JSON. Python lo recibe en el handler `tinta`, abre el diálogo y, al guardar, escribe los bytes y llama a `tintaDesktopDone`. El identificador numérico empareja la respuesta con la promesa que está esperando.

Soltar un archivo sobre la ventana lo resuelve GTK (`drag-data-received`), no el evento `drop` de la página, porque WebKit no siempre entrega la ruta. El velo de «Suelta el PDF» sí es de la página, y en el escritorio el archivo llega por el otro camino. Los dos tienen que seguir aceptando un `.pdf`.

## Librerías

PDF.js 3.11.174 pinta y lee anotaciones. pdf-lib 1.17.1 modifica y crea. Van en `vendor/` para que el programa no descargue nada al abrirse. El worker se apunta con una URL relativa a la página, que vale igual en `file://` y en `http://127.0.0.1`.

Para regenerar el ejemplo:

```bash
node scripts/ejemplo.cjs
```

Para rehacer las capturas hace falta Chrome y `puppeteer-core`, fuera del proyecto:

```bash
npm install --prefix /tmp/tinta-shot puppeteer-core
node scripts/capturas.mjs
```

El script busca `puppeteer-core` en `/tmp/tinta-shot`. Si está en otro sitio, exporta `PUPPETEER_CORE` con la ruta de su `package.json`.

Los iconos PNG salen de `tinta.svg`:

```bash
python3 scripts/render-icons.py
```

## Instalación

`install.sh` copia el editor a `$PREFIX/share/tinta`, escribe un lanzador en `$PREFIX/bin/tinta` y rellena la plantilla `data/tinta.desktop.in`. No usa rutas del repositorio de quien desarrolla. Por eso un `.desktop` con `/home/...` no debe volver al git.

`make install-desktop` es lo mismo y, además, deja el lanzador en el Escritorio.

## Prueba automática

`.github/workflows/self-test.yml` instala GTK y WebKit en Ubuntu 24.04 y ejecuta `--self-test` bajo Xvfb. Esa prueba solo comprueba que la página carga y que `pdfjsLib`, `PDFLib` y `window.tinta` existen. No sustituye abrir el ejemplo y guardar.

## Estilo

Python con cuatro espacios. El resto, dos, según `.editorconfig`. Comentarios en español, solo donde el motivo no se ve en el código. La rotación y el puente sí lo necesitan; un getter, no.
