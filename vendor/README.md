# Librerías incluidas

Tinta funciona sin red. Por eso estas tres librerías van en el repositorio,
ya construidas. No las edites a mano: si hay que actualizarlas, sustituye el
archivo por la misma versión publicada y conserva su aviso de licencia.

| Archivo | Proyecto | Versión | Licencia |
| --- | --- | --- | --- |
| `pdf.min.js` | [PDF.js](https://github.com/mozilla/pdf.js) | 3.11.174 | Apache-2.0 |
| `pdf.worker.min.js` | PDF.js | 3.11.174 | Apache-2.0 |
| `pdf-lib.min.js` | [pdf-lib](https://github.com/Hopding/pdf-lib) | 1.17.1 | MIT |

Los textos están en `LICENSES/`. El aviso de Apache-2.0 de Microsoft, que
pdf-lib arrastra en el paquete minimizado, está al principio de
`pdf-lib.min.js`.

El resto de Tinta se publica bajo la GNU GPL versión 3 o posterior. Esa
licencia es compatible con Apache-2.0 y con MIT: se pueden distribuir juntas,
pero no se puede quitar el aviso de la librería ni relicenciarla como si fuera
GPL. El programa combinado se ofrece bajo la GPL.
