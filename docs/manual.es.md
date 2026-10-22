# Manual de uso

[English](manual.en.md) · [Asturianu](manual.ast.md)

Tinta es un editor visual de PDF. Este manual explica cómo usarlo en el escritorio y, al final, en el navegador. La interfaz está en español.

La firma que dibujas no es una firma electrónica cualificada. Es un trazo, como un bolígrafo. **Tapar** no borra el texto de debajo.

## Abrir

Después de [instalar](../README.md#instalación):

- menú de aplicaciones → Tinta
- lanzador del Escritorio, si lo creaste con `./install.sh --desktop`
- terminal: `tinta` o `tinta documento.pdf`
- clic derecho sobre un PDF → Abrir con Tinta, cuando el escritorio haya registrado la aplicación

También puedes soltar un PDF sobre la ventana. Si ya hay cambios sin guardar, pregunta antes de abrir otro.

Si el archivo pide contraseña, escríbela en el diálogo. Solo se usa para mostrarlo. No se guarda en disco.

Hay un impreso de prueba en `examples/autorizacion.pdf`. No tiene valor y no autoriza a nadie. Si instalaste el programa, la entrada del menú tiene la acción **Abrir el ejemplo**.

## La ventana

Arriba, el nombre del archivo. Si hay cambios, aparece **sin guardar** y un punto en el título.

La barra de herramientas tiene, de izquierda a derecha:

| Herramienta | Tecla | Para qué |
| --- | --- | --- |
| Lápiz | `P` | Dibujar con el color y el grosor elegidos |
| Goma | `E` | Borrar tinta que hayas puesto. No borra el PDF original |
| Resaltar | `H` | Un trazo amarillo translúcido |
| Texto | `T` | Escribir. Clic en la página, escribe, y sal con Escape o Ctrl+Intro |
| Tapar | `C` | Un rectángulo blanco para cubrir lo que se ve |
| Mover | `V` | Arrastrar una firma, un texto o un tapado |

Al lado están los colores (negro, azul, verde, rojo y otro) y el grosor. Con Texto, el grosor se cambia por el tipo de letra y los puntos: Sans, Serifa o Manuscrita, de 8 a 72.

**Deshacer** (`Ctrl+Z`) y **Rehacer** (`Ctrl+Shift+Z` o `Ctrl+Y`) cubren el dibujo y también los campos. Hay memoria para unos cien pasos.

**Limpiar página** quita la tinta de la página visible, no los campos.

**Nueva firma** abre el recuadro. **Fecha** coloca la fecha de hoy. **✓** coloca una marca. **Campos** lista los campos del formulario. Si ya dibujaste una firma, aparece **Colocar firma** con una miniatura.

Abajo, el dock: página anterior y siguiente, número de página, zoom, **Ancho** y **Página**.

## Firmar

Hay tres maneras.

1. Elige **Lápiz** y dibuja donde iría la firma. Sirve para un garabato rápido sobre la línea.
2. Pulsa **Nueva firma**. Dibuja dentro del recuadro. La línea roja es una guía y no se guarda. **Colocar en la página** recorta el trazo y lo deja sobre el documento. Puedes arrastrarlo y cambiar el tamaño por las esquinas.
3. Si el PDF trae un recuadro de firma, verás un botón **Firmar**. Usa la firma que ya tengas o te pide dibujarla.

La firma se recuerda en esa sesión. **Colocar firma** la pone otra vez, en la página que estás viendo. No se guarda una biblioteca de firmas entre sesiones: al cerrar, se olvida. Eso es a propósito.

Con **Mover** seleccionado, la equis roja borra el elemento. `Supr` o `Retroceso` también. `Ctrl+D` lo duplica.

## Escribir

Con **Texto**, un clic crea una caja. Elige la letra y el tamaño antes o durante la edición. Un doble clic vuelve a abrir un texto ya puesto. Si sales dejando la caja vacía, no se guarda.

La letra manuscrita depende de las fuentes del sistema. Si no hay una fuente de mano, verás una cursiva genérica.

**Fecha** inserta la fecha en español, por ejemplo «22 de octubre de 2026», y deja el elemento seleccionado para moverlo.

## Campos

Si el PDF tiene un formulario AcroForm, Tinta lo detecta y dibuja los campos encima de la página. Un aviso dice cuántos hay. Se pueden rellenar ahí mismo o en el diálogo **Campos**.

![Campos rellenos sobre el impreso](../screenshots/04-campos.png)

Acepta texto, casilla, botón de opción, lista desplegable y recuadro de firma. Los botones de acción del PDF no se pulsan. Un campo de solo lectura se muestra desactivado.

Al guardar, los valores se escriben en el formulario y se actualiza su apariencia. El borde verde marca un campo que cambió respecto al original.

Si el PDF no tiene campos, el diálogo lo dice. En ese caso escribe encima con **Texto**, o cubre una línea con **Tapar** y escribe sobre el blanco. Recuerda que el texto cubierto sigue en el archivo.

## Guardar

`Ctrl+S` o el botón **Guardar**. El nombre que propone es el del archivo más `-firmado`, por ejemplo `contrato-firmado.pdf`. Puedes cambiarlo. Pide confirmación si vas a sobrescribir.

Qué se escribe:

- Sin cambios: una copia del original.
- Con cambios, en un PDF normal: el documento original, más una capa con la tinta, más los campos rellenados. El texto de origen sigue pudiendo seleccionarse.
- PDF cifrado, o un archivo que no se deja modificar: una copia visual, página a página. El aviso lo dice. En esa copia el texto ya no se selecciona, porque cada página es una imagen.

Cerrar la ventana con cambios sin guardar pregunta si sigues editando o cierras y pierdes esos cambios. `Ctrl+Q` también cierra.

## Páginas y zoom

Flecha izquierda o `RePág` va a la página anterior. Flecha derecha o `AvPág`, a la siguiente. También vale el número del dock.

`+` y `-` cambian el zoom, igual que `Ctrl` y la rueda. `[` y `]` cambian el grosor del lápiz. `0` ajusta al ancho. **Página** mete la hoja entera en la ventana.

## Atajos

| Tecla | Acción |
| --- | --- |
| `P` `E` `H` `T` `C` `V` | Lápiz, goma, resaltar, texto, tapar, mover |
| `Ctrl+O` | Abrir |
| `Ctrl+S` | Guardar |
| `Ctrl+Q` | Cerrar, en el escritorio |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Shift+Z` o `Ctrl+Y` | Rehacer |
| `Ctrl+D` | Duplicar lo seleccionado |
| `Supr` o `Retroceso` | Borrar lo seleccionado |
| `←` `RePág` / `→` `AvPág` | Página anterior / siguiente |
| `+` `-` | Acercar / alejar |
| `Ctrl` + rueda | Zoom |
| `[` `]` | Menos / más grosor |
| `0` | Ajustar al ancho |
| `Escape` o `Ctrl+Intro` | Terminar de escribir |

Los atajos de una letra no actúan mientras escribes en un campo o en un diálogo.

## En el navegador

```bash
python3 -m http.server 8765
```

Abre <http://127.0.0.1:8765/>. No abras `index.html` como archivo local: muchos navegadores bloquean el worker de PDF.js y la página se queda en blanco.

En el navegador el botón dice **Descargar** y el archivo va a la carpeta de descargas. No hay diálogo nativo. Al cerrar la pestaña, el navegador puede avisar si hay cambios. Soltar un PDF sobre la página también abre.

## Problemas frecuentes

**No arranca y habla de GTK o WebKit.** Faltan las dependencias. En Ubuntu o Debian:

```bash
sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1
```

**La ventana sale en blanco.** Casi siempre es el modo navegador abierto como `file://`. Usa el servidor local de arriba, o la aplicación de escritorio.

**El PDF no se abre.** Puede estar dañado, o no ser un PDF aunque el nombre acabe en `.pdf`. Tinta solo abre PDF.

**Guardé y el texto ya no se selecciona.** El archivo estaba cifrado o no se pudo modificar, y se guardó la copia visual. El mensaje del aviso lo dice. Vuelve al original si necesitas el texto seleccionable y no tenías que conservar esa copia.

**Tapé un número y sigue saliendo al copiar.** Es lo esperado. Tapar no elimina contenido. No lo uses para redactar datos.

**La firma sale girada en un PDF apaisado o escaneado de lado.** Es un fallo de colocación. Abre un aviso con un PDF de ejemplo que se pueda compartir, y di la versión (`tinta --version`).

**La letra manuscrita se ve como una cursiva normal.** El sistema no tiene una fuente de mano. Elige Serifa o Sans, o instala una fuente script.

## Quitar el programa

Desde el código:

```bash
./install.sh --uninstall
```

Si lo instalaste en otro prefijo, repite ese `--prefix` o usa `--system`.
