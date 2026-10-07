---
name: pedido-a-prompt
description: Convierte un pedido o tarea que el usuario describe en un prompt estructurado, claro y listo para pegar en otra IA (chat de texto o generador de imágenes). Usar cuando el usuario pida "armame un prompt", "haceme un prompt para", "decile a la IA que", "preparame la instrucción para otra IA" o describa una tarea que quiere encargarle a otra herramienta de IA. También cuando pida mejorar, ordenar o estructurar un prompt que ya tiene.
---

# Pedido a Prompt

## Overview

Transforma la idea o pedido del usuario (a menudo desordenado o incompleto) en un prompt profesional, estructurado y listo para copiar y pegar en otra IA. Trabaja para prompts de texto (ChatGPT, Claude, Gemini) y de generación de imágenes (Midjourney, DALL-E, Flux).

## Workflow de Prompt

Seguir este flujo en orden. No saltar pasos; cada uno aporta información que mejora el resultado.

### Paso 1: Capturar el pedido

Leer lo que el usuario quiere y reunir los datos mínimos. Si falta alguno, pedirlo en una sola ronda de preguntas cortas (máximo 2 o 3 preguntas por mensaje):

1. **Tarea** — ¿Qué debe hacer la otra IA? (redactar, diseñar, resumir, generar una imagen...)
2. **Tema o materia** — ¿Sobre qué? (producto, pieza, texto, concepto...). Si el usuario no lo aclara y es ambiguo, preguntar brevemente.
3. **Rol de la IA** — ¿Con qué perfil debe responder? (diseñador, vendedor, redactor, artista...). Si el usuario no especifica, proponer un rol coherente con la tarea.
4. **Formato de salida** — ¿Cómo debe entregar el resultado? (lista, párrafo, tabla, imagen con tal resolución...).

Detectar el tipo de prompt en este punto para aplicar la plantilla correcta (ver Paso 2).

### Paso 2: Determinar el tipo de prompt

Elegir la plantilla según el destino de la instrucción:

| Tipo | Plantilla | Ejemplo de destino |
|------|-----------|--------------------|
| Texto | Rol + Contexto + Tarea + Detalles + Restricciones + Formato de salida | ChatGPT, Claude, Gemini |
| Imagen | Sujeto + Estilo + Composición + Detalles + Parámetros | Midjourney, DALL-E, Flux |

Ir a `references/plantillas.md` y usar la plantilla que corresponde. La plantilla indica qué preguntas hacer si faltan datos.

### Paso 3: Armar el prompt estructurado

Construir el prompt usando la plantilla elegida con la información capturada. Reglas:

- Escribir la instrucción en **voz clara y directa**, como si se la diera a un asistente que no conoce el contexto previo. Incluir todo el contexto necesario dentro del prompt.
- Ser **específico**: reemplazar generalidades por detalles concretos que aporte el usuario.
- Marcar cada sección con su encabezado en el prompt final para que la otra IA la procese ordenadamente.
- Para prompts de imagen, integrar los detalles en una sola oración descriptiva (el estilo de la plantilla) en lugar de secciones numeradas.

### Paso 4: Entregar el resultado

- Mostrar el prompt final en un **bloque de código** para que el usuario lo copie directo.
- Al entregarlo, indicar en una línea qué secciones incluye (o qué ajustes se pueden hacer).
- Ofrecer 1 o 2 **variantes** breves cuando haya cambios evidentes que el usuario pueda querer (tono, estilo, énfasis, resolución) y 1 **detalle que conviene ajustar** según el destino real (ej.: "si es para Midjourney conviene agregar `--ar 3:2`").
- Si el usuario entrega un prompt ya existente para mejorar: preservar su intención, ordenarlo con la plantilla y marcar qué se agregó o cambió.

## Reglas de calidad

- No inventar datos del pedido: si el usuario no dio un detalle y no puede deducirse, pedirlo en Paso 1 antes de armar el prompt.
- El prompt final debe ser autosuficiente: la otra IA no tiene conversación previa, todo el contexto va dentro del texto.
- Preferir instrucciones en español salvo que el usuario pida otro idioma o la IA de destino responda mejor en otro (indicar en ese caso).

## Resources

### references/
- `references/plantillas.md` — Plantillas detalladas para prompts de texto e imagen, con secciones, parámetros y ejemplos listos.