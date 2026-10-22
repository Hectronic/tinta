# User manual

[Español](manual.es.md) · [Asturianu](manual.ast.md)

Tinta is a visual PDF editor. This manual is how to use it on the desktop and, at the end, in a browser. The buttons are in Spanish; the names below are the ones you will see.

A signature you draw is not a qualified electronic signature. It is a stroke, like a pen. **Tapar** (cover) does not delete the text underneath.

## Open

After [installing](../README.en.md#install):

- application menu → Tinta
- the Desktop launcher, if you created it with `./install.sh --desktop`
- a terminal: `tinta`, or `tinta document.pdf`
- right-click a PDF → Open with Tinta, once the desktop has registered the app

You can also drop a PDF on the window. If there are unsaved changes, it asks before opening another file.

If the file wants a password, type it in the dialog. It is used only to display the file. It is not written to disk.

There is a sample form at `examples/autorizacion.pdf`. It has no legal value and authorizes nobody. After installation, the menu entry has an **Abrir el ejemplo** (open the example) action.

## The window

The file name is at the top. If there are changes, you see **sin guardar** (unsaved) and a dot in the title.

The toolbar, left to right:

| Tool | Key | What it does |
| --- | --- | --- |
| Lápiz | `P` | Draw with the chosen colour and width |
| Goma | `E` | Erase ink you added. It does not erase the original PDF |
| Resaltar | `H` | A translucent yellow stroke |
| Texto | `T` | Write. Click the page, type, then leave with Escape or Ctrl+Enter |
| Tapar | `C` | A white rectangle over what you see |
| Mover | `V` | Drag a signature, a text box or a cover |

Next to those are the colours (black, blue, green, red, and a custom one) and the stroke width. In text mode, width is replaced by the typeface and the point size: Sans, Serifa (serif) or Manuscrita (script), from 8 to 72.

**Deshacer** (`Ctrl+Z`) and **Rehacer** (`Ctrl+Shift+Z` or `Ctrl+Y`) cover both drawing and form fields. About a hundred steps are kept.

**Limpiar página** clears the ink on the visible page, not the fields.

**Nueva firma** opens the pad. **Fecha** places today's date. **✓** places a check mark. **Campos** lists the form fields. Once you have drawn a signature, **Colocar firma** appears, with a thumbnail.

The dock at the bottom has previous and next page, the page number, zoom, **Ancho** (width) and **Página** (page).

## Sign

Three ways.

1. Choose **Lápiz** and draw where the signature should go. Good for a quick mark on a line.
2. Press **Nueva firma**. Draw inside the pad. The red line is a guide and is not saved. **Colocar en la página** trims the stroke and drops it on the document. Drag it, and resize it from the corners.
3. If the PDF already has a signature box, you will see a **Firmar** button. It uses the signature you already have, or asks you to draw one.

The signature is remembered for that session. **Colocar firma** puts it down again, on the page you are looking at. There is no signature library between sessions: closing forgets it. That is intentional.

With **Mover** active, the red × deletes the item. `Delete` or `Backspace` does the same. `Ctrl+D` duplicates it.

## Write

With **Texto**, a click creates a box. Pick the typeface and size before or during editing. Double-click reopens text you already placed. If you leave the box empty, it is not saved.

The script face depends on fonts installed on the system. Without a handwriting font, you get a generic italic.

**Fecha** inserts the date in Spanish, for example “22 de octubre de 2026”, and leaves the item selected so you can move it.

## Fields

If the PDF has an AcroForm, Tinta finds it and draws the fields on the page. A notice says how many there are. Fill them in place, or in the **Campos** dialog.

![Filled fields on the sample form](../screenshots/04-campos.png)

Text, checkbox, radio button, dropdown and signature box are supported. Push buttons in the PDF are not clicked. A read-only field is shown disabled.

On save, the values are written into the form and its appearance is updated. A green border marks a field that differs from the original.

If the PDF has no fields, the dialog says so. Write on top with **Texto**, or cover a line with **Tapar** and write on the white. The covered text is still in the file.

## Save

`Ctrl+S`, or the **Guardar** button. The suggested name is the file name plus `-firmado`, for example `contrato-firmado.pdf`. You can change it. Overwriting asks for confirmation.

What gets written:

- No changes: a copy of the original.
- Changes, on a normal PDF: the original document, plus a layer of ink, plus the filled fields. The source text stays selectable.
- An encrypted PDF, or a file that cannot be modified: a visual copy, page by page. The notice says so. In that copy the text can no longer be selected, because each page is an image.

Closing the window with unsaved changes asks whether to keep editing or to close and lose those changes. `Ctrl+Q` closes as well.

## Pages and zoom

Left arrow or `Page Up` goes to the previous page. Right arrow or `Page Down` goes to the next. The number in the dock works too.

`+` and `-` change the zoom, as do `Ctrl` and the wheel. `[` and `]` change the pen width. `0` fits the width. **Página** fits the whole sheet in the window.

## Shortcuts

| Key | Action |
| --- | --- |
| `P` `E` `H` `T` `C` `V` | Pen, eraser, highlight, text, cover, move |
| `Ctrl+O` | Open |
| `Ctrl+S` | Save |
| `Ctrl+Q` | Quit, on the desktop |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` or `Ctrl+Y` | Redo |
| `Ctrl+D` | Duplicate the selection |
| `Delete` or `Backspace` | Delete the selection |
| `←` `Page Up` / `→` `Page Down` | Previous / next page |
| `+` `-` | Zoom in / out |
| `Ctrl` + wheel | Zoom |
| `[` `]` | Thinner / thicker stroke |
| `0` | Fit width |
| `Escape` or `Ctrl+Enter` | Finish writing |

Single-letter shortcuts do nothing while you are typing in a field or a dialog.

## In a browser

```bash
python3 -m http.server 8765
```

Open <http://127.0.0.1:8765/>. Do not open `index.html` as a local file: many browsers block the PDF.js worker and the page stays blank.

In the browser the button says **Descargar** and the file goes to the downloads folder. There is no native dialog. The browser may warn on closing the tab if there are changes. Dropping a PDF on the page opens it too.

## Common problems

**It will not start, and the message mentions GTK or WebKit.** The libraries are missing. On Ubuntu or Debian:

```bash
sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1
```

**The window is blank.** This is almost always the browser build opened as `file://`. Use the local server above, or the desktop app.

**The PDF will not open.** It may be damaged, or not a PDF even if the name ends in `.pdf`. Tinta only opens PDFs.

**I saved, and the text can no longer be selected.** The file was encrypted or could not be modified, so the visual copy was saved. The notice says so. Go back to the original if you need selectable text and did not need to keep that copy.

**I covered a number and it still appears when I copy.** That is expected. Cover does not remove content. Do not use it to redact data.

**The signature is rotated on a landscape PDF or a sideways scan.** That is a placement bug. Open an issue with a sample PDF you are allowed to share, and include the version (`tinta --version`).

**The script face looks like ordinary italic.** The system has no handwriting font. Choose Serifa or Sans, or install a script font.

## Remove it

From the source tree:

```bash
./install.sh --uninstall
```

If you installed to another prefix, repeat that `--prefix`, or use `--system`.
