#!/usr/bin/env python3
"""Render tinta.svg to the hicolor PNG sizes. SPDX-License-Identifier: GPL-3.0-or-later"""

import sys
from pathlib import Path

import gi

gi.require_version("Rsvg", "2.0")
import cairo
from gi.repository import Rsvg

ROOT = Path(__file__).resolve().parents[1]
SVG = ROOT / "tinta.svg"
OUT = ROOT / "share" / "icons" / "hicolor"
SIZES = (16, 22, 24, 32, 48, 64, 128, 256, 512)


def main():
    handle = Rsvg.Handle.new_from_file(str(SVG))
    scalable = OUT / "scalable" / "apps"
    scalable.mkdir(parents=True, exist_ok=True)
    (scalable / "tinta.svg").write_bytes(SVG.read_bytes())
    for size in SIZES:
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, size, size)
        ctx = cairo.Context(surface)
        viewport = Rsvg.Rectangle()
        viewport.x = 0
        viewport.y = 0
        viewport.width = size
        viewport.height = size
        handle.render_document(ctx, viewport)
        dest = OUT / f"{size}x{size}" / "apps"
        dest.mkdir(parents=True, exist_ok=True)
        surface.write_to_png(str(dest / "tinta.png"))
        print(dest / "tinta.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
