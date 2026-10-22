#!/bin/sh
# Instala Tinta en el menú de aplicaciones y deja el ejecutable en el PATH.
# Copyright (C) 2026 Hector Alvarez
# SPDX-License-Identifier: GPL-3.0-or-later

set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
VERSION=$(sed -n 's/^__version__ = "\(.*\)"/\1/p' "$ROOT/tinta.py")
PREFIX=${PREFIX:-"$HOME/.local"}
UNINSTALL=0
DESKTOP_LAUNCHER=0

usage() {
  cat <<EOF
Uso: ./install.sh [opciones]

Instala Tinta $VERSION: el ejecutable, el icono y la entrada de escritorio.

Opciones:
  --prefix DIR     destino (por defecto: \$HOME/.local)
  --system         instala en /usr/local (hace falta permiso de escritura)
  --desktop        también crea un lanzador en el Escritorio, si existe
  --uninstall      quita la instalación de ese prefijo
  -h, --help       muestra esta ayuda

Después de instalar, abre Tinta desde el menú o ejecuta: tinta
EOF
}

while [ $# -gt 0 ]; do
  case $1 in
    --prefix)
      PREFIX=$2
      shift 2
      ;;
    --prefix=*)
      PREFIX=${1#--prefix=}
      shift
      ;;
    --system)
      PREFIX=/usr/local
      shift
      ;;
    --desktop)
      DESKTOP_LAUNCHER=1
      shift
      ;;
    --uninstall)
      UNINSTALL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

mkdir -p "$PREFIX"
PREFIX=$(CDPATH= cd -- "$PREFIX" && pwd)
BIN="$PREFIX/bin/tinta"
DATA="$PREFIX/share/tinta"
APPS="$PREFIX/share/applications"
ICONS="$PREFIX/share/icons/hicolor"
META="$PREFIX/share/metainfo"
MAN="$PREFIX/share/man/man1"

remove_path() {
  if [ -e "$1" ] || [ -L "$1" ]; then
    rm -rf "$1"
  fi
}

uninstall() {
  remove_path "$BIN"
  remove_path "$DATA"
  remove_path "$APPS/tinta.desktop"
  remove_path "$META/io.github.Hectronic.tinta.metainfo.xml"
  remove_path "$MAN/tinta.1"
  if [ -d "$ICONS" ]; then
    find "$ICONS" -type f \( -name 'tinta.png' -o -name 'tinta.svg' \) -delete
  fi
  if [ -n "${XDG_DESKTOP_DIR:-}" ] && [ -f "$XDG_DESKTOP_DIR/tinta.desktop" ]; then
    remove_path "$XDG_DESKTOP_DIR/tinta.desktop"
  fi
  for desk in "$HOME/Desktop" "$HOME/Escritorio"; do
    if [ -f "$desk/tinta.desktop" ]; then
      remove_path "$desk/tinta.desktop"
    fi
  done
  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$APPS" >/dev/null 2>&1 || true
  fi
  echo "Tinta desinstalada de $PREFIX"
}

if [ "$UNINSTALL" -eq 1 ]; then
  uninstall
  exit 0
fi

if [ ! -w "$(dirname "$PREFIX")" ] && [ ! -w "$PREFIX" ] && [ ! -d "$PREFIX" ]; then
  echo "No puedo escribir en $PREFIX. Prueba sin --system, o con sudo." >&2
  exit 1
fi

mkdir -p "$DATA/vendor" "$DATA/examples" "$(dirname "$BIN")" "$APPS" "$META" "$MAN" "$ICONS"

cp "$ROOT/index.html" "$ROOT/tinta.py" "$ROOT/tinta.svg" "$DATA/"
cp "$ROOT/vendor/"*.js "$DATA/vendor/"
if [ -d "$ROOT/examples" ]; then
  cp "$ROOT/examples/"*.pdf "$DATA/examples/" 2>/dev/null || true
fi
cp "$ROOT/data/io.github.Hectronic.tinta.metainfo.xml" "$META/"
cp "$ROOT/docs/tinta.1" "$MAN/"

if [ -d "$ROOT/share/icons/hicolor" ]; then
  cp -a "$ROOT/share/icons/hicolor/." "$ICONS/"
else
  mkdir -p "$ICONS/scalable/apps"
  cp "$ROOT/tinta.svg" "$ICONS/scalable/apps/tinta.svg"
fi

cat > "$BIN" <<EOF
#!/bin/sh
set -eu
exec python3 "$DATA/tinta.py" "\$@"
EOF
chmod 755 "$BIN"

sed \
  -e "s|@BIN@|$BIN|g" \
  -e "s|@DATA@|$DATA|g" \
  "$ROOT/data/tinta.desktop.in" > "$APPS/tinta.desktop"
chmod 644 "$APPS/tinta.desktop"

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APPS" >/dev/null 2>&1 || true
fi
if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -f -t "$ICONS" >/dev/null 2>&1 || true
fi

desktop_dir=""
if [ -n "${XDG_DESKTOP_DIR:-}" ] && [ -d "$XDG_DESKTOP_DIR" ]; then
  desktop_dir=$XDG_DESKTOP_DIR
elif [ -d "$HOME/Desktop" ]; then
  desktop_dir=$HOME/Desktop
elif [ -d "$HOME/Escritorio" ]; then
  desktop_dir=$HOME/Escritorio
fi

if [ "$DESKTOP_LAUNCHER" -eq 1 ] && [ -n "$desktop_dir" ]; then
  cp "$APPS/tinta.desktop" "$desktop_dir/tinta.desktop"
  chmod 755 "$desktop_dir/tinta.desktop"
  if command -v gio >/dev/null 2>&1; then
    gio set "$desktop_dir/tinta.desktop" metadata::trusted true >/dev/null 2>&1 || true
  fi
fi

echo "Tinta $VERSION instalada."
echo "  Ejecutable: $BIN"
echo "  Menú:       $APPS/tinta.desktop"
if [ "$DESKTOP_LAUNCHER" -eq 1 ] && [ -n "$desktop_dir" ]; then
  echo "  Escritorio: $desktop_dir/tinta.desktop"
fi
echo
echo "Ábrela desde el menú de aplicaciones o ejecuta: tinta"
case ":$PATH:" in
  *":$PREFIX/bin:"*) ;;
  *) echo "Añade $PREFIX/bin al PATH si el comando tinta no se encuentra." ;;
esac
