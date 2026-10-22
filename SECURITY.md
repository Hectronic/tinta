# Seguridad

Tinta no tiene cuenta, no tiene servidor y no envía el PDF a ningún sitio. El riesgo está en el propio archivo: un PDF mal formado puede hacer que el visor falle o dibuje mal la página.

Si encuentras un fallo que permita a un PDF salirse de eso —leer otros archivos, ejecutar algo o enviar datos—, abre un aviso en [Issues](https://github.com/Hectronic/tinta/issues) y no incluyas el documento si contiene datos reales. Describe la versión (`tinta --version`) y el sistema.

## Esto no es una herramienta de cifrado ni de firma

- Una robla dibujada no es una firma electrónica cualificada y no usa certificado.
- **Tapar** cubre con blanco lo que se ve. No borra el texto de debajo: sigue en el archivo y se puede seleccionar. No sirve para ocultar datos sensibles.
- La contraseña de un PDF protegido solo se usa en memoria para poder mostrarlo. No se guarda.

Para eliminar de verdad un dato de un PDF hace falta otra herramienta, pensada para eso. Tinta no lo hace.
