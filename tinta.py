#!/usr/bin/env python3
# Tinta — editor visual de PDF.
# Copyright (C) 2026 Hector Alvarez
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# SPDX-License-Identifier: GPL-3.0-or-later

"""Tinta: editor visual de PDF en una ventana de escritorio."""

import base64
import json
import sys
from pathlib import Path

__version__ = "1.0.0"

APP_DIR = Path(__file__).resolve().parent
INDEX = APP_DIR / "index.html"

HELP = """\
Tinta {version} — editor visual de PDF

Uso:
  tinta [opción] [archivo.pdf]

Opciones:
  -h, --help     muestra esta ayuda y sale
  --version      muestra la versión y sale
  --self-test    abre el editor, comprueba que carga y sale

Ejemplos:
  tinta
  tinta documento.pdf
  tinta examples/autorizacion.pdf

El archivo no sale del equipo. La firma es manuscrita: no es una
firma electrónica cualificada ni un certificado.

Licencia: GNU GPL versión 3 o posterior.
<https://www.gnu.org/licenses/>
""".format(version=__version__)

MISSING_LIBS = """\
Tinta necesita Python 3, GTK 3 y WebKitGTK 4.1.

Ubuntu y Debian:
  sudo apt install python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-4.1

Fedora:
  sudo dnf install python3-gobject gtk3 webkit2gtk4.1

Arch Linux:
  sudo pacman -S python-gobject gtk3 webkit2gtk-4.1

Detalle: {exc}
"""

Gdk = Gio = GLib = Gtk = WebKit2 = None


def ensure_gtk():
    global Gdk, Gio, GLib, Gtk, WebKit2
    if Gtk is not None:
        return
    try:
        import gi

        gi.require_version("Gdk", "3.0")
        gi.require_version("Gtk", "3.0")
        gi.require_version("WebKit2", "4.1")
        from gi.repository import Gdk as gdk
        from gi.repository import Gio as gio
        from gi.repository import GLib as glib
        from gi.repository import Gtk as gtk
        from gi.repository import WebKit2 as webkit2
    except Exception as exc:
        sys.stderr.write(MISSING_LIBS.format(exc=exc))
        raise SystemExit(1) from exc
    Gdk, Gio, GLib, Gtk, WebKit2 = gdk, gio, glib, gtk, webkit2


class TintaApp:
    def __init__(self, paths, self_test=False):
        self.self_test = self_test
        self.allow_close = self_test
        self.pending = [Path(p) for p in paths if Path(p).is_file()]
        self.last_dir = str(Path.home())

        GLib.set_prgname("tinta")
        GLib.set_application_name("Tinta")
        self.window = Gtk.ApplicationWindow(title="Tinta")
        self.window.set_default_size(1280, 840)
        self.window.set_position(Gtk.WindowPosition.CENTER)
        icon = APP_DIR / "tinta.svg"
        if icon.exists():
            self.window.set_icon_from_file(str(icon))
        self.window.connect("delete-event", self.on_delete)
        self.window.connect("key-press-event", self.on_key)

        manager = WebKit2.UserContentManager()
        manager.register_script_message_handler("tinta")
        manager.connect("script-message-received::tinta", self.on_message)

        self.web = WebKit2.WebView.new_with_user_content_manager(manager)
        settings = self.web.get_settings()
        settings.set_enable_javascript(True)
        settings.set_javascript_can_access_clipboard(True)
        settings.set_allow_file_access_from_file_urls(True)
        settings.set_allow_universal_access_from_file_urls(True)
        settings.set_enable_write_console_messages_to_stdout(True)
        settings.set_enable_developer_extras(False)
        self.web.connect("notify::title", self.on_title)
        self.web.connect("notify::zoom-level", self.lock_zoom)
        self.web.connect("load-changed", self.on_load)
        self.web.connect("load-failed", self.on_load_failed)

        self.web.drag_dest_set(
            Gtk.DestDefaults.DROP | Gtk.DestDefaults.MOTION | Gtk.DestDefaults.HIGHLIGHT,
            [],
            Gdk.DragAction.COPY,
        )
        self.web.drag_dest_add_uri_targets()
        self.web.connect("drag-data-received", self.on_drop)

        self.window.add(self.web)
        self.window.show_all()
        self.web.load_uri(INDEX.as_uri())

    def lock_zoom(self, web, _param):
        if abs(web.get_zoom_level() - 1.0) > 0.001:
            web.set_zoom_level(1.0)

    def on_title(self, web, _param):
        title = web.get_title()
        if title:
            self.window.set_title(title)

    def on_load_failed(self, _web, _event, uri, error):
        print("No se pudo cargar", uri, error, file=sys.stderr)
        if self.self_test:
            sys.exit(1)
        return False

    def on_load(self, _web, event):
        if event != WebKit2.LoadEvent.FINISHED:
            return
        if self.self_test:
            self.web.run_javascript(
                "Boolean(window.pdfjsLib && window.PDFLib && window.tinta)",
                None,
                self.on_self_test,
            )
            return
        if self.pending:
            path = self.pending.pop(0)
            self.push_file(path)

    def on_self_test(self, web, result):
        try:
            value = web.run_javascript_finish(result).get_js_value()
            ok = value.to_boolean()
        except Exception as exc:
            print(exc, file=sys.stderr)
            ok = False
        print("SELF_TEST", "OK" if ok else "FAIL")
        sys.exit(0 if ok else 1)

    def on_key(self, _window, event):
        if event.keyval == Gdk.KEY_q and event.state & Gdk.ModifierType.CONTROL_MASK:
            self.window.close()
            return True
        return False

    def on_delete(self, _window, _event):
        if self.allow_close:
            return False
        self.web.run_javascript(
            "window.tinta ? window.tinta.isDirty() : false",
            None,
            self.on_dirty_before_close,
        )
        return True

    def on_dirty_before_close(self, web, result):
        dirty = False
        try:
            dirty = web.run_javascript_finish(result).get_js_value().to_boolean()
        except Exception:
            dirty = False
        if dirty and not self.confirm_discard():
            return
        self.allow_close = True
        self.window.destroy()

    def confirm_discard(self):
        dialog = Gtk.MessageDialog(
            parent=self.window,
            flags=Gtk.DialogFlags.MODAL,
            type=Gtk.MessageType.QUESTION,
            buttons=Gtk.ButtonsType.NONE,
            text="Hay cambios sin guardar",
        )
        dialog.format_secondary_text("Si cierras ahora, se perderá lo que no hayas guardado.")
        dialog.add_button("Seguir editando", Gtk.ResponseType.CANCEL)
        dialog.add_button("Cerrar sin guardar", Gtk.ResponseType.OK)
        dialog.set_default_response(Gtk.ResponseType.CANCEL)
        response = dialog.run()
        dialog.destroy()
        return response == Gtk.ResponseType.OK

    def on_message(self, _manager, js_result):
        try:
            raw = js_result.get_js_value().to_string()
            message = json.loads(raw)
        except Exception as exc:
            print("Mensaje no válido:", exc, file=sys.stderr)
            return
        kind = message.get("type")
        if kind == "open":
            self.open_dialog()
        elif kind == "save":
            self.save_dialog(message)
        elif kind == "quit":
            self.window.close()

    def open_dialog(self):
        dialog = Gtk.FileChooserNative.new(
            "Abrir PDF",
            self.window,
            Gtk.FileChooserAction.OPEN,
            "_Abrir",
            "_Cancelar",
        )
        dialog.set_current_folder(self.last_dir)
        pdf_filter = Gtk.FileFilter()
        pdf_filter.set_name("Documentos PDF")
        pdf_filter.add_mime_type("application/pdf")
        pdf_filter.add_pattern("*.pdf")
        dialog.add_filter(pdf_filter)
        if dialog.run() == Gtk.ResponseType.ACCEPT:
            self.push_file(Path(dialog.get_filename()))
        dialog.destroy()

    def save_dialog(self, message):
        req_id = int(message.get("id") or 0)
        name = message.get("name") or "documento-firmado.pdf"
        data = message.get("data") or ""
        dialog = Gtk.FileChooserNative.new(
            "Guardar PDF",
            self.window,
            Gtk.FileChooserAction.SAVE,
            "_Guardar",
            "_Cancelar",
        )
        dialog.set_current_folder(self.last_dir)
        dialog.set_current_name(name)
        dialog.set_do_overwrite_confirmation(True)
        pdf_filter = Gtk.FileFilter()
        pdf_filter.set_name("Documentos PDF")
        pdf_filter.add_mime_type("application/pdf")
        pdf_filter.add_pattern("*.pdf")
        dialog.add_filter(pdf_filter)
        response = dialog.run()
        path = dialog.get_filename() if response == Gtk.ResponseType.ACCEPT else None
        dialog.destroy()
        if not path:
            self.finish_save(req_id, False, "cancel")
            return
        if not path.lower().endswith(".pdf"):
            path += ".pdf"
        try:
            Path(path).write_bytes(base64.b64decode(data))
        except Exception as exc:
            self.finish_save(req_id, False, str(exc))
            self.error("No se pudo guardar", str(exc))
            return
        self.last_dir = str(Path(path).parent)
        self.finish_save(req_id, True, path)

    def finish_save(self, req_id, ok, message):
        script = "window.tintaDesktopDone(%d, %s, %s)" % (
            req_id,
            "true" if ok else "false",
            json.dumps(message),
        )
        self.web.run_javascript(script, None, None)

    def push_file(self, path):
        path = Path(path)
        if not path.is_file():
            return
        self.last_dir = str(path.parent)
        payload = {
            "name": path.name,
            "data": base64.b64encode(path.read_bytes()).decode("ascii"),
        }
        script = "window.tinta.receiveFile(%s)" % json.dumps(payload)
        self.web.run_javascript(script, None, None)

    def on_drop(self, _widget, _context, x, y, data, _info, time):
        uris = data.get_uris() or []
        for uri in uris:
            path = Path(Gio.File.new_for_uri(uri).get_path() or "")
            if path.suffix.lower() == ".pdf" and path.is_file():
                self.push_file(path)
                Gtk.drag_finish(_context, True, False, time)
                return
        Gtk.drag_finish(_context, False, False, time)

    def error(self, title, detail):
        dialog = Gtk.MessageDialog(
            parent=self.window,
            flags=Gtk.DialogFlags.MODAL,
            type=Gtk.MessageType.ERROR,
            buttons=Gtk.ButtonsType.OK,
            text=title,
        )
        dialog.format_secondary_text(detail)
        dialog.run()
        dialog.destroy()


def main():
    argv = sys.argv[1:]
    if any(arg in ("-h", "--help") for arg in argv):
        print(HELP, end="")
        return
    if "--version" in argv:
        print("tinta", __version__)
        return
    if not INDEX.is_file():
        print("No encuentro el editor:", INDEX, file=sys.stderr)
        raise SystemExit(1)
    ensure_gtk()
    args = [arg for arg in argv if not arg.startswith("-")]
    self_test = "--self-test" in argv
    missing = [arg for arg in args if not Path(arg).is_file()]
    if missing and not self_test:
        print("No encuentro:", ", ".join(missing), file=sys.stderr)
    TintaApp(args, self_test=self_test)
    Gtk.main()


if __name__ == "__main__":
    main()
