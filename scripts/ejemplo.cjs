#!/usr/bin/env node
// Impreso de ejemplo. No es un documento real.
// SPDX-License-Identifier: GPL-3.0-or-later

const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("../vendor/pdf-lib.min.js");

const ink = rgb(0.110, 0.098, 0.082);
const soft = rgb(0.361, 0.325, 0.282);
const wax = rgb(0.624, 0.176, 0.176);
const line = rgb(0.72, 0.67, 0.60);
const hair = rgb(0.82, 0.78, 0.72);

async function main() {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Autorización (ejemplo de Tinta)");
  pdf.setAuthor("Tinta");
  pdf.setSubject("Impreso de ejemplo, sin valor");
  pdf.setCreator("Tinta");
  pdf.setProducer("Tinta ejemplos");

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const page = pdf.addPage([780, 520]);
  page.drawRectangle({ x: 0, y: 0, width: 780, height: 520, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: 500, width: 780, height: 20, color: ink });
  page.drawText("TINTA", {
    x: 40, y: 506, size: 9, font: sansBold, color: rgb(0.965, 0.945, 0.910),
  });
  page.drawText("EJEMPLO", {
    x: 688, y: 506, size: 9, font: sans, color: rgb(0.78, 0.72, 0.66),
  });

  page.drawText("Autorización", {
    x: 40, y: 452, size: 32, font: serifBold, color: ink,
  });
  page.drawLine({
    start: { x: 40, y: 442 }, end: { x: 214, y: 442 }, thickness: 1.6, color: wax,
  });
  page.drawText("Impreso de ejemplo. No autoriza a nadie y no tiene valor.", {
    x: 40, y: 422, size: 10, font: sans, color: soft,
  });

  const body = [
    "El documento se entrega solo a la persona autorizada.",
    "Quien lo presenta tiene que coincidir con el nombre y el",
    "documento escritos a la derecha. La oficina puede pedir",
    "otro comprobante si los datos no cuadran.",
  ];
  body.forEach((lineText, i) => {
    page.drawText(lineText, {
      x: 40,
      y: 384 - i * 20,
      size: 13,
      font: i === 0 ? serifItalic : serif,
      color: ink,
    });
  });

  page.drawText("Datos", {
    x: 430, y: 418, size: 13, font: sansBold, color: ink,
  });

  const form = pdf.getForm();
  const fields = [
    ["Nombre", "Nombre", 376],
    ["Documento", "Documento", 326],
    ["Fecha", "Fecha", 276],
  ];
  for (const [name, label, y] of fields) {
    page.drawText(label, { x: 430, y: y + 24, size: 9, font: sans, color: soft });
    const field = form.createTextField(name);
    field.addToPage(page, { x: 430, y, width: 300, height: 20 });
    field.setFontSize(11);
  }

  page.drawText("Medio", { x: 430, y: 250, size: 9, font: sans, color: soft });
  const medio = form.createDropdown("Medio");
  medio.addOptions(["En mano", "Correo", "Oficina"]);
  medio.addToPage(page, { x: 430, y: 222, width: 300, height: 20 });
  medio.setFontSize(11);

  const acepto = form.createCheckBox("Acepto");
  acepto.addToPage(page, { x: 430, y: 176, width: 16, height: 16 });
  page.drawText("He leído el texto y los datos son ciertos.", {
    x: 454, y: 180, size: 10, font: sans, color: ink,
  });

  page.drawText("Firma", { x: 40, y: 168, size: 11, font: sansBold, color: ink });
  page.drawText("Dibuja encima con el lápiz, o usa Nueva firma.", {
    x: 40, y: 152, size: 9, font: sans, color: soft,
  });
  page.drawRectangle({
    x: 40, y: 48, width: 340, height: 92,
    borderColor: hair, borderWidth: 0.8, color: rgb(1, 1, 1),
  });
  page.drawLine({
    start: { x: 58, y: 78 }, end: { x: 300, y: 78 }, thickness: 0.7, color: line,
  });

  page.drawText("Página 1 de 2", {
    x: 40, y: 22, size: 8, font: sans, color: soft,
  });

  const notes = pdf.addPage([780, 520]);
  notes.drawRectangle({ x: 0, y: 500, width: 780, height: 20, color: ink });
  notes.drawText("TINTA", {
    x: 40, y: 506, size: 9, font: sansBold, color: rgb(0.965, 0.945, 0.910),
  });
  notes.drawText("Notas", {
    x: 40, y: 450, size: 28, font: serifBold, color: ink,
  });
  notes.drawLine({
    start: { x: 40, y: 440 }, end: { x: 110, y: 440 }, thickness: 1.6, color: wax,
  });
  const noteLines = [
    "Este PDF se incluye con Tinta para probar el editor.",
    "No es una autorización, no identifica a nadie y no debe presentarse",
    "en una oficina, un banco o un juzgado.",
    "",
    "Sirve para ver cómo quedan el lápiz, el resaltado, el texto y los campos",
    "cuando se guarda una copia. El original de este ejemplo no cambia",
    "hasta que tú guardes el resultado con otro nombre.",
  ];
  noteLines.forEach((lineText, i) => {
    if (!lineText) return;
    notes.drawText(lineText, {
      x: 40, y: 400 - i * 22, size: 13, font: serif, color: ink,
    });
  });
  notes.drawText("Página 2 de 2", {
    x: 40, y: 22, size: 8, font: sans, color: soft,
  });

  const out = path.join(__dirname, "..", "examples", "autorizacion.pdf");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, await pdf.save());
  console.log(out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
