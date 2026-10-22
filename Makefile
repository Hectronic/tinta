# Tinta — editor visual de PDF.
# SPDX-License-Identifier: GPL-3.0-or-later

PREFIX ?= $(HOME)/.local

.PHONY: run install install-desktop uninstall self-test help icons

help:
	@echo "make run              abre Tinta desde este directorio"
	@echo "make install          instala el ejecutable y la entrada de escritorio en $(PREFIX)"
	@echo "make install-desktop  igual, y deja un lanzador en el Escritorio"
	@echo "make uninstall        quita esa instalación"
	@echo "make self-test        comprueba que el editor carga"
	@echo "make icons            regenera los PNG del icono"

run:
	./tinta

install:
	./install.sh --prefix "$(PREFIX)"

install-desktop:
	./install.sh --prefix "$(PREFIX)" --desktop

uninstall:
	./install.sh --prefix "$(PREFIX)" --uninstall

self-test:
	python3 tinta.py --self-test

icons:
	python3 scripts/render-icons.py
