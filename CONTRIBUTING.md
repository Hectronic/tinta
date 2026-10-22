# Contribuir

Tinta se publica bajo la GNU GPL versión 3 o posterior. Si envías un cambio,
aceptas que se distribuya con esa licencia. No hace falta ceder el copyright:
conservas el tuyo y concedes la licencia.

## Antes de abrir un cambio

1. Cuenta qué problema resuelve. Un PDF de ejemplo sin datos reales vale más que una descripción larga.
2. Ejecuta `python3 tinta.py --self-test`.
3. Si tocas el dibujo, la exportación o los campos, abre `examples/autorizacion.pdf`, edítalo y guarda una copia. Comprueba que el texto del PDF sigue pudiendo seleccionarse, salvo en el caso de la copia visual.
4. No añadas una llamada de red que envíe el documento. Que el archivo no salga del equipo es parte del programa, no un detalle.
5. No presentes una firma dibujada como firma electrónica, certificado o PAdES.
6. La interfaz está en español. Si añades un texto visible, escríbelo en español, con tú.
7. No edites a mano los archivos minimizados de `vendor/`. Si actualizas una librería, conserva su licencia y actualiza `NOTICE` y `vendor/README.md`.

## Dónde está cada cosa

`AGENTS.md` y `docs/desarrollo.md` describen la ventana, el editor y el puente entre los dos. Léelos antes de mover coordenadas o la exportación: la rotación de página es fácil de romper.

## Avisos

Los fallos y las ideas van en [Issues](https://github.com/Hectronic/tinta/issues). No adjuntes PDF con datos de otras personas.

Sé claro y respetuoso. No hay sitio para insultos ni para insistir cuando alguien pide que pares.
