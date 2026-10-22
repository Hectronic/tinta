# AGENTS.md

Instrucciones para un agente que vaya a modificar Tinta. El mapa humano está en `docs/desarrollo.md`. Léelo si vas a tocar coordenadas, rotación o el guardado.

## Qué es esto

Editor visual de PDF para Linux. Una ventana GTK 3 + WebKitGTK 4.1 (`tinta.py`) carga `index.html`. El editor es una sola página: PDF.js pinta el documento, un canvas guarda la tinta y pdf-lib escribe la copia.

La interfaz y los comentarios están en español. Los manuales están en español, inglés y asturiano. No hace falta traducir la interfaz salvo que te lo pidan.

Licencia del programa: GPL-3.0-or-later. Copyright (C) 2026 Hector Alvarez. Los archivos nuevos de código llevan el aviso SPDX. `vendor/` no es GPL: no lo relicencies ni le quites el aviso.

## Promesas que no se rompen

- El PDF no se envía a ningún sitio. No añadas red, telemetría ni una subida «opcional» del documento.
- La firma es un dibujo. No la llames firma electrónica, certificado ni PAdES, ni en la interfaz ni en la documentación.
- **Tapar** no borra el texto de debajo. No lo presentes como redacción.
- Guardar escribe una copia. No sobrescribas el original sin que el diálogo de guardar lo pida.
- La contraseña de un PDF protegido no se escribe en disco ni en el título de la ventana.

## Cómo probar

```bash
python3 tinta.py --help
python3 tinta.py --version
python3 tinta.py --self-test
./tinta examples/autorizacion.pdf
```

`--self-test` necesita un display. Sin él: `xvfb-run -a python3 tinta.py --self-test`.

Si cambias el dibujo, los campos o la exportación, abre el ejemplo, edita, guarda y abre el resultado en otro visor. Comprueba una página girada (90, 180, 270) si tocas `overlayPlacement`.

## Mapa

| Ruta | Papel |
| --- | --- |
| `tinta.py` | Ventana, diálogos nativos, arrastrar y soltar, puente con la página |
| `tinta` | Lanzador del árbol de código. Resuelve enlaces simbólicos |
| `install.sh` | Copia a `PREFIX` (por defecto `~/.local`) y escribe el `.desktop` |
| `index.html` | Interfaz, herramientas, campos y exportación. Un solo archivo, a propósito |
| `vendor/` | PDF.js 3.11.174 y pdf-lib 1.17.1, minimizados. No se editan a mano |
| `examples/autorizacion.pdf` | Impreso de prueba. Se regenera con `node scripts/ejemplo.cjs` |
| `screenshots/` | Capturas de la documentación. `scripts/capturas.mjs` las rehace |
| `docs/manual.*.md` | Instrucciones de uso. Si cambias un atajo o un botón, actualiza las tres |

## Puente de escritorio

La página detecta el escritorio con `window.webkit.messageHandlers.tinta`.

De la página al proceso, por `postMessage` de un JSON:

- `{type:"open"}` abre el diálogo nativo
- `{type:"save", id, name, data}` guarda los bytes en base64. La página espera `window.tintaDesktopDone(id, ok, message)`
- `{type:"quit"}` cierra, pasando por la pregunta de cambios sin guardar

Del proceso a la página: `window.tinta.receiveFile({name, data})` con el PDF en base64. `window.tinta.isDirty()` decide el diálogo de cierre.

En el navegador no hay puente: abrir usa `<input type="file">` y guardar descarga un blob. El botón dice Guardar o Descargar según el caso. No unifiques esos dos caminos a ciegas.

## Coordenadas

La tinta se guarda en coordenadas normalizadas de la página visual, de 0 a 1, con origen arriba a la izquierda, como la ve PDF.js. No son puntos PDF.

Al exportar, `overlayPlacement` coloca esa imagen teniendo en cuenta la rotación de la página (0, 90, 180, 270). pdf-lib gira alrededor de la esquina inferior izquierda. Si «arreglas» esa función sin un PDF girado, vas a descolocar las firmas.

`exportOverlay` es el camino normal: incrusta un PNG transparente encima y escribe los campos en el AcroForm. `exportFlattened` rasteriza cada página. Se usa si el PDF está cifrado (`needsFlatten`) o si la modificación falla. En la copia visual el texto deja de ser seleccionable; el aviso tiene que seguir diciéndolo.

## Campos

`loadAllFields` lee anotaciones Widget con PDF.js. `applyForm` escribe en pdf-lib y llama a `updateFieldAppearances` con Helvetica. Los tipos previstos son texto, casilla, radio, lista y firma. Un botón de acción (`pushButton`) se ignora.

La firma de un widget Sig no rellena un campo criptográfico: coloca un sello de imagen. No intentes convertir eso en una firma PAdES.

## Estilo

- Python 3, solo biblioteca estándar más PyGObject. No añadas dependencias de pip para algo que el sistema ya da.
- El editor no tiene empaquetador. Un cambio de interfaz va en `index.html`, no en un framework nuevo.
- Textos de la interfaz en español de España, de tú, cortos.
- No reformatees `vendor/`. Si sustituyes una librería, comprueba la versión, conserva la licencia y actualiza `NOTICE` y `vendor/README.md`.
- Los `.desktop` con rutas absolutas no se commitean. La plantilla es `data/tinta.desktop.in`; `install.sh` rellena `@BIN@` y `@DATA@`.

## Qué no hacer

- No subas el PDF de ejemplo generado a partir de un documento real.
- No añadas una cuenta, un servidor o una clave de API.
- No ocultes el aviso de la copia visual ni el de que Tapar no redacta.
- No cambies la licencia de un archivo de `vendor/` para que «todo sea GPL».
