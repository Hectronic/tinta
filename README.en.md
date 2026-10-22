# Tinta

[Español](README.md) · **English** · [Asturianu](README.ast.md)

<p align="center">
  <img src="tinta.svg" width="88" alt="Tinta icon: a signature stroke on dark ink">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-1c1915" alt="GPL-3.0-or-later"></a>
  <img src="https://img.shields.io/badge/platform-Linux-9f2d2d" alt="Linux">
</p>

A visual PDF editor for the Linux desktop. Sign by hand, write on the page, highlight and fill in forms. The file never leaves your computer.

<p align="center">
  <img src="screenshots/02-editor.png" width="880" alt="A form with a highlighted sentence, a handwritten signature and the date, inside Tinta">
</p>

<p align="center">
  <img src="screenshots/01-inicio.png" width="420" alt="Welcome screen, with an empty desk and an Open PDF button">
  <img src="screenshots/03-firma.png" width="420" alt="Pad for drawing a new signature">
</p>

The interface is in Spanish. These pages are the instructions.

## What it is

Tinta opens a PDF in a window and lets you draw on the page. It is for the form that needs a signature, the missing date, or the field another program left blank. Saving writes a copy. The original file is left alone.

The same editor runs in a browser. The desktop app is the intended way to use it: it has native open and save dialogs, and it asks before closing if there are unsaved changes.

## What it is not

Tinta does **not** create a qualified electronic signature, a certificate, or a PAdES signature. A mark you draw is the digital equivalent of a pen on paper. A bank, a court or an administration may refuse it as a legal signature.

**Cover** paints white over what you see. It does not delete the text underneath. That text is still in the file and can still be selected. Do not use it to hide sensitive data.

## What it can do

- Pen, eraser, highlighter, text, a white cover and a move tool.
- A signature drawn on a pad, which can be placed again later.
- Today's date and a check mark.
- Form fields: text, checkbox, radio, dropdown and a signature box.
- Several pages, zoom, and fit to width or page.
- Open a file by dropping it on the window, or with `tinta document.pdf`.
- Undo and redo.

On a normal PDF the original text stays selectable: the ink is an overlay. If the file is encrypted, or cannot be modified, Tinta saves a visual copy and the text is no longer selectable. It says so when you save.

## Privacy

There is no account, no telemetry, and the PDF is not uploaded. PDF.js and pdf-lib ship inside the program, so editing does not need a network. A password for a protected file is used only in memory, to open it.

## Requirements

Linux, with Python 3, GTK 3 and WebKitGTK 4.1.

Ubuntu and Debian:

```bash
sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1
```

Fedora: `python3-gobject`, `gtk3` and `webkit2gtk4.1`.
Arch: `python-gobject`, `gtk3` and `webkit2gtk-4.1`.

## Install

You need the source. From the project directory:

```bash
git clone https://github.com/Hectronic/tinta.git
cd tinta
./install.sh --desktop
```

For your user, that installs:

- the `tinta` executable in `~/.local/bin`
- an application-menu entry, associated with PDF files
- the icon
- a launcher on the Desktop, if that folder exists

Open it from the menu, from the Desktop, or in a terminal:

```bash
tinta
tinta examples/autorizacion.pdf
```

To install into `/usr/local`, use `./install.sh --system` (you need write permission). To remove it: `./install.sh --uninstall`.

Without installing, from the source tree:

```bash
./tinta
```

The full manual, with shortcuts and common problems, is in [docs/manual.en.md](docs/manual.en.md). Spanish: [docs/manual.es.md](docs/manual.es.md). Asturian: [docs/manual.ast.md](docs/manual.ast.md).

## In a browser

The editor is `index.html`. Some browsers block the PDF.js worker if you open the file directly. Use a local server:

```bash
python3 -m http.server 8765
```

then open <http://127.0.0.1:8765/>. In the browser the button says **Descargar** (download) instead of **Guardar** (save).

## Example

[`examples/autorizacion.pdf`](examples/autorizacion.pdf) is a two-page sample form, with fields. It authorizes nobody and has no legal value.

<p align="center">
  <img src="screenshots/04-campos.png" width="720" alt="The sample form with name, document, date and checkbox filled in">
</p>

## Development

```bash
python3 tinta.py --help
python3 tinta.py --self-test
```

The window is `tinta.py`. The editor is `index.html`. The map for anyone changing the code is [AGENTS.md](AGENTS.md) and [docs/desarrollo.md](docs/desarrollo.md).

## License

Tinta is free software: GNU GPL version 3 or later. The text is in [LICENSE](LICENSE). You may use, study, modify and redistribute it, including in a commercial program, as long as the result stays under the same license and you provide the source.

PDF.js 3.11.174 (Mozilla) is under the Apache License 2.0. pdf-lib 1.17.1 (Andrew Dillon) is under the MIT license. Those notices stay. Details are in [NOTICE](NOTICE).

Copyright (C) 2026 [Hector Alvarez](https://github.com/Hectronic).
