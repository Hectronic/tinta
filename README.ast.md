# Tinta

[Español](README.md) · [English](README.en.md) · **Asturianu**

<p align="center">
  <img src="tinta.svg" width="88" alt="Iconu de Tinta: un trazu de robla sobre tinta escura">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/llicencia-GPL--3.0--or--later-1c1915" alt="Llicencia GPL-3.0 o posterior"></a>
  <img src="https://img.shields.io/badge/plataforma-Linux-9f2d2d" alt="Linux">
</p>

Editor visual de PDF pal escritoriu de Linux. Robla a mano, escribe enriba, resalta y enllena formularios. El ficheru nun sal del to equipu.

<p align="center">
  <img src="screenshots/02-editor.png" width="880" alt="Un impresu con una frase resaltada, una robla a mano y la fecha, dientro de Tinta">
</p>

<p align="center">
  <img src="screenshots/01-inicio.png" width="420" alt="Pantalla d'aniciu, col escritoriu vacíu y el botón Abrir PDF">
  <img src="screenshots/03-firma.png" width="420" alt="Recuadru pa dibuxar una robla nueva">
</p>

La interfaz ta n'español. Estes páxines son les instrucciones.

## Qué ye

Tinta abre un PDF nuna ventana y dexa dibuxar sobre la páxina. Sirve pal impresu que hai que roblar, la fecha que falta o'l campu que l'otru programa nun enllenó. Al guardar, escribe una copia: l'orixinal nun se toca.

Tamién se pue usar nel navegador, col mesmu editor. L'aplicación d'escritoriu ye la forma prevista: tien diálogu d'abrir y guardar, y avisa si zarres con cambios.

## Qué nun ye

Tinta **nun** crea una firma electrónica cualificada, nin un certificáu, nin una firma PAdES. Lo que dibuxes ye'l equivalente a un bolígrafu sobre'l papel. Un bancu, un xulgáu o una alministración pueden nun acetalo como robla llegal.

**Tapar** cubre con blanco lo que se ve. Nun borra'l testu d'embaxo: sigue nel ficheru y pue esbillase. Nun sirve p'ocultar un datu sensible.

## Qué pue facer

- Llápiz, goma, resaltáu, testu, tapar una zona y mover lo que punxisti.
- Una robla dibuxada nun recuadru, que depués se pue asitiar otra vez.
- La fecha de güei y una marca de visto.
- Campos de formulariu: testu, caxella, opción, llista y recuadru de robla.
- Varies páxines, zoom y axuste al anchu o a la páxina.
- Abrir soltando'l ficheru sobre la ventana, o con `tinta documentu.pdf`.
- Desfacer y refacer.

Nun PDF normal el testu sigue pudiendo esbillase: la tinta va enriba. Si'l ficheru ta cifráu, o nun se pue modificar, Tinta guarda una copia visual y el testu dexa de ser esbillable. Avísalo al guardar.

## Privacidá

Nun hai cuenta, nun hai telemetría y el PDF nun se xube a dengún sitiu. PDF.js y pdf-lib van dientro del programa, asina que tampoco fai falta rede pa editar. La contraseña d'un ficheru protexíu namái s'usa na memoria pa poder abrilu.

## Requisitos

Linux con Python 3, GTK 3 y WebKitGTK 4.1.

Ubuntu y Debian:

```bash
sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1
```

Fedora: `python3-gobject`, `gtk3` y `webkit2gtk4.1`.
Arch: `python-gobject`, `gtk3` y `webkit2gtk-4.1`.

## Instalación

Fai falta'l códigu. Dende'l direutoriu del proyeutu:

```bash
git clone https://github.com/Hectronic/tinta.git
cd tinta
./install.sh --desktop
```

Eso instala, pal to usuariu:

- l'executable `tinta` en `~/.local/bin`
- la entrada del menú d'aplicaciones, asociada a los PDF
- l'iconu
- un llanzador nel Escritoriu, si la carpeta esiste

Ábrila dende'l menú, dende l'Escritoriu, o nuna terminal:

```bash
tinta
tinta examples/autorizacion.pdf
```

Pa instalala en `/usr/local`, usa `./install.sh --system` (fai falta permisu d'escritura). Pa quitala: `./install.sh --uninstall`.

Ensin instalar, dende'l códigu:

```bash
./tinta
```

El manual completu, con atayos y problemes frecuentes, ta en [docs/manual.ast.md](docs/manual.ast.md). N'español: [docs/manual.es.md](docs/manual.es.md). N'inglés: [docs/manual.en.md](docs/manual.en.md).

## Usu nel navegador

L'editor ye la páxina `index.html`. Dellos navegadores bloquien el worker de PDF.js si abres el ficheru direutamente. Sirve un sirvidor llocal:

```bash
python3 -m http.server 8765
```

y abre <http://127.0.0.1:8765/>. Nel navegador el botón diz **Descargar** en vez de **Guardar**.

## Exemplu

[`examples/autorizacion.pdf`](examples/autorizacion.pdf) ye un impresu de dos páxines, con campos, pa probar. Nun autoriza a naide y nun tien valor.

<p align="center">
  <img src="screenshots/04-campos.png" width="720" alt="L'impresu d'exemplu col nome, el documentu, la fecha y la caxella enllenaos">
</p>

## Desendolcu

```bash
python3 tinta.py --help
python3 tinta.py --self-test
```

La ventana ta en `tinta.py`. L'editor ta en `index.html`. El mapa pa quien vaya a tocar el códigu ta en [AGENTS.md](AGENTS.md) y en [docs/desarrollo.md](docs/desarrollo.md).

## Llicencia

Tinta ye software llibre: GNU GPL versión 3 o posterior. El testu ta en [LICENSE](LICENSE). Pues usala, estudiala, modificala y redistribuila, tamién nun programa comercial, siempre que'l resultáu siga so la mesma llicencia y entregues el códigu fonte.

PDF.js 3.11.174 (Mozilla) va so la Apache License 2.0. pdf-lib 1.17.1 (Andrew Dillon) va so la MIT. Esos avisos caltiénense. El detalle ta en [NOTICE](NOTICE).

Copyright (C) 2026 [Hector Alvarez](https://github.com/Hectronic).
