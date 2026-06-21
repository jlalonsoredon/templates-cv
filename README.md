# Curriculum — Editor de CV

![Vista previa de la plantilla](src/assets/img/preview-readme.png)

Un editor visual de currículums construido con Vite + React. Permite editar texto in-place, gestionar secciones y exportar el CV a PDF con una plantilla moderna y profesional.

**Características**

- Edición en línea (haz clic en cualquier texto para editar).
- Secciones y entradas reordenables.
- Exportar a PDF desde el navegador.
- Subida de foto de perfil y manejo de iconos SVG.

**Captura / Instrucciones para la imagen**

La imagen incluida arriba sirve como captura para el README. Para que se muestre correctamente copia la imagen adjunta en la conversación a la ruta:

- `src/assets/img/preview-readme.png`

Si prefieres que incruste la imagen directamente (Data URI) dímelo y lo hago, pero el archivo resultante será mucho más pesado.

**Instalación y ejecución**

```bash
npm install
npm run dev
```

Abre la URL que indique Vite (por ejemplo `http://localhost:5173/`) para ver el editor.

**Exportar a PDF**

- Usa `Imprimir` → `Guardar como PDF` en el navegador.
- Si aparece una página en blanco o el contenido se divide, ajusta la escala/márgenes en el diálogo de impresión. Puedo aplicar más ajustes CSS al `@media print` si quieres que encaje siempre en una sola hoja.

**Archivos clave**

- [src/App-f.jsx](src/App-f.jsx) — Editor principal y lógica UI.
- [src/assets/img](src/assets/img) — Iconos y recursos SVG.

**Contribuir**

1. Haz fork y crea una rama nueva.
2. Asegúrate de que los cambios sean pequeños y explicados en el PR.

---

¿Quieres que añada la imagen por mí al repositorio (la subo como `src/assets/img/preview-readme.png`) o prefieres insertarla manualmente?
