# Plantillas de Prompt

Dos plantillas según el destino de la instrucción: **texto** o **imagen**.

## Plantilla para prompts de texto (ChatGPT, Claude, Gemini y similares)

### Estructura

```
Rol: <perfil con el que debe responder la IA>

Contexto: <situación, proyecto, producto o antecedentes que la IA necesita saber>

Tarea: <qué debe hacer exactamente, en una acción clara>

Detalles:
- <detalle 1>
- <detalle 2>
- <detalle 3>

Restricciones:
- <qué NO debe hacer o límites>
- <longitud, tono, idioma si aplica>

Formato de salida: <lista, párrafo, tabla, pasos, extensión>
```

### Datos a completar

| Sección | Pregunta al usuario si falta | Se puede omitir si... |
|---------|------------------------------|-----------------------|
| Rol | ¿Con qué perfil debería responder? | La tarea no necesita rol |
| Contexto | ¿Qué necesita saber la IA? | Ya viene en la tarea |
| Tarea | ¿Qué tiene que hacer exactamente? | Nunca se omite |
| Detalles | ¿Qué características concretas? | La tarea es simple |
| Restricciones | ¿Límites, tono, longitud? | No aplican límites |
| Formato de salida | ¿Cómo entrega el resultado? | Da igual el formato |

### Ejemplo listo

```
Rol: Asistente de ventas especializado en productos artesanales.

Contexto: Vendo tallados personalizados en madera. Cada pedido incluye
nombre, frase y material.

Tarea: Redactar un mensaje de WhatsApp de confirmación para el cliente
al recibir su pedido de tallado.

Detalles:
- Pedido: placa de 30x20 cm en roble con el nombre "Ana" y la frase "Hecho a mano".
- Tiempo estimado de producción: 5 días hábiles.
- Envío gratis dentro de la ciudad.

Restricciones:
- Tono cercano y profesional.
- Máximo 150 palabras.
- Preguntar al final si desea coordinar el día de entrega.

Formato de salida: Mensaje listo para copiar, sin saludos extras.
```

## Plantilla para prompts de imagen (Midjourney, DALL-E, Flux y similares)

### Estructura

```
<Sujeto principal> + <acción o escena> + <material/textura> + <estilo
artístico> + <composición/encuadre> + <iluminación> + <detalles de
acabado> + <parámetros de la IA>
```

Los prompts de imagen se escriben en **una sola oración descriptiva**, con
comas y frases cortas. Ordenar de lo general a lo particular:
sujeto, acción, entorno, estilo, composición, luz, calidad.

### Detalles útiles por tipo de imagen

| Elemento | Pregunta al usuario si falta |
|----------|------------------------------|
| Sujeto | ¿Qué es lo que se ve en la imagen? |
| Material/textura | ¿De qué material es? (madera, vidrio, metal, piedra...) |
| Estilo | ¿Fotográfico, ilustración, 3D, realista, minimalista...? |
| Composición | ¿Plano cercano, picado, centrado, de costado...? |
| Iluminación | ¿Luz natural, de taller, cálida, lateral, en penumbra...? |
| Texto visible | ¿Lleva letras grabadas? ¿Qué dice exactamente? (las IAs de imagen suelen errar texto; advertir este riesgo) |

### Parámetros comunes según la IA de destino

- **Midjourney**: `--ar 3:2`, `--v 6`, `--style raw`, `--q 2`
- **Flux / DALL-E**: estilo dentro del texto descriptivo, sin parámetros en consola (se pueden agregar variaciones por separado).
- **Stable Diffusion / Leonardo**: agregar `negative prompt` con lo que se quiere evitar.

### Ejemplo listo (Midjourney)

```
Tallado en madera de roble de una placa rectangular 30x20 centímetros,
con el nombre "Ana" tallado a mano en letras caligráficas centro de la
pieza, frase "Hecho a mano" debajo en letra pequeña, textura de veta de
madera visible, estilo fotografía de producto sobre fondo neutro beige,
iluminación lateral cálida que realza el relieve de las letras, plano
ligeramente frontal, detalle nítido de la talla, --ar 3:2 --style raw
```

## Consejos transversales

- Los prompts de imagen generan **texto con errores**: advertir que las letras pueden salir mal y que conviene pedir revisión o usar estilo que minimice el texto.
- Un mismo pedido puede necesitar ambas plantillas (ej.: una imagen del diseño + un texto de venta). Si el usuario lo pide, entregar las dos versiones.
- Mantener la coherencia de datos entre variantes: mismo nombre, medidas, material y frase.