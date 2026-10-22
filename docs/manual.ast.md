# Manual d'usu

[Español](manual.es.md) · [English](manual.en.md)

Tinta ye un editor visual de PDF. Esti manual esplica cómo usalu nel escritoriu y, al final, nel navegador. La interfaz ta n'español.

La robla que dibuxes nun ye una firma electrónica cualificada. Ye un trazu, como un bolígrafu. **Tapar** nun borra'l testu d'embaxo.

## Abrir

Depués d'[instalar](../README.ast.md#instalación):

- menú d'aplicaciones → Tinta
- llanzador del Escritoriu, si lu creasti con `./install.sh --desktop`
- terminal: `tinta` o `tinta documentu.pdf`
- clic derechu sobre un PDF → Abrir con Tinta, en cuanto l'escritoriu tenga rexistrada l'aplicación

Tamién pues soltar un PDF sobre la ventana. Si ya hai cambios ensin guardar, pregunta enantes d'abrir otru.

Si'l ficheru pide contraseña, escríbila nel diálogu. Namái s'usa pa amosalu. Nun se guarda en discu.

Hai un impresu de prueba en `examples/autorizacion.pdf`. Nun tien valor y nun autoriza a naide. Si instalasti'l programa, la entrada del menú tien l'aición **Abrir l'exemplu**.

## La ventana

Enriba, el nome del ficheru. Si hai cambios, apaez **sin guardar** y un puntu nel títulu.

La barra de ferramientes tien, d'izquierda a drecha:

| Ferramienta | Tecla | Pa qué |
| --- | --- | --- |
| Lápiz | `P` | Dibuxar col color y el grosor esbillaos |
| Goma | `E` | Borrar tinta que punxeras. Nun borra'l PDF orixinal |
| Resaltar | `H` | Un trazu mariellu tresllúcidu |
| Texto | `T` | Escribir. Clic na páxina, escribe, y sal con Escape o Ctrl+Intro |
| Tapar | `C` | Un rectángulu blancu pa cubrir lo que se ve |
| Mover | `V` | Arrastrar una robla, un testu o un tapáu |

Al llau tán los colores (prietu, azul, verde, bermeyu y otru) y el grosor. Con Testu, el grosor cámbiase pol tipu de lletra y los puntos: Sans, Serifa o Manuscrita, d'8 a 72.

**Deshacer** (`Ctrl+Z`) y **Rehacer** (`Ctrl+Shift+Z` o `Ctrl+Y`) cubren el dibuxu y tamién los campos. Hai memoria pa unos cien pasos.

**Limpiar página** quita la tinta de la páxina visible, non los campos.

**Nueva firma** abre'l recuadru. **Fecha** asitia la fecha de güei. **✓** asitia una marca. **Campos** llista los campos del formulariu. Si ya dibuxasti una robla, apaez **Colocar firma** con una miniatura.

Abaxo, el dock: páxina anterior y siguiente, númberu de páxina, zoom, **Ancho** y **Página**.

## Roblar

Hai tres maneres.

1. Esbilla **Lápiz** y dibuxa au diría la robla. Sirve pa un garabatu rápidu sobre la llinia.
2. Calca **Nueva firma**. Dibuxa dientro del recuadru. La llinia bermeya ye una guía y nun se guarda. **Colocar en la página** recorta'l trazu y déxalu sobre'l documentu. Pues arrastralu y cambiar el tamañu peles esquines.
3. Si'l PDF trai un recuadru de robla, verás un botón **Firmar**. Usa la robla que ya tengas o pídete dibuxala.

La robla alcuérdase nesa sesión. **Colocar firma** ponla otra vez, na páxina que tas viendo. Nun se guarda una biblioteca de robles ente sesiones: al zarrar, escaezse. Ye aposta.

Con **Mover** esbilláu, l'equis bermeya borra l'elementu. `Supr` o `Retrocesu` tamién. `Ctrl+D` duplícalu.

## Escribir

Con **Texto**, un clic crea una caxa. Esbilla la lletra y el tamañu enantes o demientres la edición. Un doble clic vuelve a abrir un testu ya puestu. Si sales dexando la caxa vacía, nun se guarda.

La lletra manuscrita depende de les fontes del sistema. Si nun hai una fonte de mano, verás una cursiva xenérica.

**Fecha** inxerta la fecha n'español, por exemplu «22 de octubre de 2026», y dexa l'elementu esbilláu pa movelu.

## Campos

Si'l PDF tien un formulariu AcroForm, Tinta alcuéntralu y dibuxa los campos enriba de la páxina. Un avisu diz cuántos hai. Puen enllenase ehí mesmu o nel diálogu **Campos**.

![Campos enllenaos sobre l'impresu](../screenshots/04-campos.png)

Aceuta testu, caxella, botón d'opción, llista desplegable y recuadru de robla. Los botones d'aición del PDF nun se calquen. Un campu de solo llectura amuésase desactiváu.

Al guardar, los valores escríbense nel formulariu y anóvase la so apariencia. El borde verde marca un campu que cambió respeuto al orixinal.

Si'l PDF nun tien campos, el diálogu dícilo. Nesi casu escribe enriba con **Texto**, o cubre una llinia con **Tapar** y escribe sobre'l blancu. Alcuérdate de que'l testu cubiertu sigue nel ficheru.

## Guardar

`Ctrl+S` o'l botón **Guardar**. El nome que propón ye'l del ficheru más `-firmado`, por exemplu `contrato-firmado.pdf`. Pues cambialu. Pide confirmación si vas a sobrescribir.

Qué s'escribe:

- Ensin cambios: una copia del orixinal.
- Con cambios, nun PDF normal: el documentu orixinal, más una capa cola tinta, más los campos enllenaos. El testu d'orixe sigue pudiendo esbillase.
- PDF cifráu, o un ficheru que nun se dexa modificar: una copia visual, páxina a páxina. L'avisu dícilo. Nesa copia'l testu ya nun s'esbilla, porque cada páxina ye una imaxe.

Zarrar la ventana con cambios ensin guardar pregunta si sigues editando o zarres y pierdes esos cambios. `Ctrl+Q` tamién zarra.

## Páxines y zoom

Flecha esquierda o `RePág` va a la páxina anterior. Flecha drecha o `AvPág`, a la siguiente. Tamién val el númberu del dock.

`+` y `-` cambien el zoom, igual que `Ctrl` y la rueda. `[` y `]` cambien el grosor del llápiz. `0` axusta al anchu. **Página** mete la fueya entera na ventana.

## Atayos

| Tecla | Aición |
| --- | --- |
| `P` `E` `H` `T` `C` `V` | Llápiz, goma, resaltar, testu, tapar, mover |
| `Ctrl+O` | Abrir |
| `Ctrl+S` | Guardar |
| `Ctrl+Q` | Zarrar, nel escritoriu |
| `Ctrl+Z` | Desfacer |
| `Ctrl+Shift+Z` o `Ctrl+Y` | Refacer |
| `Ctrl+D` | Duplicar lo esbilláu |
| `Supr` o `Retrocesu` | Desaniciar lo esbilláu |
| `←` `RePág` / `→` `AvPág` | Páxina anterior / siguiente |
| `+` `-` | Averar / alloñar |
| `Ctrl` + rueda | Zoom |
| `[` `]` | Menos / más grosor |
| `0` | Axustar al anchu |
| `Escape` o `Ctrl+Intro` | Acabar d'escribir |

Los atayos d'una lletra nun actúen mentanto escribes nun campu o nun diálogu.

## Nel navegador

```bash
python3 -m http.server 8765
```

Abre <http://127.0.0.1:8765/>. Nun abras `index.html` como ficheru llocal: munchos navegadores bloquien el worker de PDF.js y la páxina queda en blanco.

Nel navegador el botón diz **Descargar** y el ficheru va a la carpeta de descargues. Nun hai diálogu nativu. Al zarrar la llingüeta, el navegador pue avisar si hai cambios. Soltar un PDF sobre la páxina tamién abre.

## Problemes frecuentes

**Nun arranca y fala de GTK o WebKit.** Falten les dependencies. N'Ubuntu o Debian:

```bash
sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1
```

**La ventana sal en blanco.** Cuasi siempre ye'l mou navegador abiertu como `file://`. Usa'l sirvidor llocal d'arriba, o l'aplicación d'escritoriu.

**El PDF nun s'abre.** Pue tar estropiáu, o nun ser un PDF anque'l nome acabe en `.pdf`. Tinta namái abre PDF.

**Guardé y el testu ya nun s'esbilla.** El ficheru taba cifráu o nun se pudo modificar, y guardóse la copia visual. El mensaxe del avisu dícilo. Vuelve al orixinal si necesites el testu esbillable y nun teníes que conservar esa copia.

**Tapé un númberu y sigue saliendo al copiar.** Ye lo esperao. Tapar nun desanicia conteníu. Nun lu uses pa redautar datos.

**La robla sal xirada nun PDF apaisáu o escaneáu de llau.** Ye un fallu de colocación. Abre un avisu con un PDF d'exemplu que se pueda compartir, y di la versión (`tinta --version`).

**La lletra manuscrita vese como una cursiva normal.** El sistema nun tien una fonte de mano. Esbilla Serifa o Sans, o instala una fonte script.

## Quitar el programa

Dende'l códigu:

```bash
./install.sh --uninstall
```

Si lu instalasti n'otru prefixu, repite esi `--prefix` o usa `--system`.
