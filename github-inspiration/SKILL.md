---
name: github-inspiration
description: Busca en GitHub repositorios de código abierto populares (más de 1.000 estrellas) relacionados con el tema actual de trabajo y extrae ideas concretas —patrones de arquitectura, nombres de módulos, enfoques de UI, convenciones, features típicas y READMEs bien estructurados— para presentarlas en español con el formato "Idea → Cómo la aplicamos acá" antes de implementar nada. Es una referencia inspiracional y no obligatoria: sugiere, no interrumpe el flujo de trabajo, no pide permiso para buscar y jamás frena la implementación. Usar siempre que se esté trabajando en algo: proyecto, feature, código, implementación, diseño, diseñar, UI/UX, refactor, arquitectura, librería, script, panel, landing o juego. También usar cuando el usuario pida inspiración, referencias, ejemplos, iguales, "buscá en GitHub", "mirá cómo lo hacen otros", "ideas", "inspirate en repositorios" o "no me inventes, buscá primero". No usar para tareas triviales.
metadata:
  origin: local
---

# github-inspiration — buscar inspiración real antes de implementar

Buscá repos abiertos y populares del tema en el que estás trabajando, leé cómo lo
resolvieron ellos, y devolvé **máximo 5 ideas accionables** con el link del repo de
origen. Todo en español. Antes de implementar, no después.

## Carácter de esta skill

| Sí | No |
| --- | --- |
| Es **inspiracional**, no un gate | No bloquea la implementación |
| Se ejecuta **proactivamente**, sin pedir permiso | No pregunta "¿querés que busque?" |
| Propone 2-3 repos como referencia | No copia código ni estructura ajena literal |
| Dice "no encontré nada útil" y sigue | No inventa repos, links ni estrellas |
| Arranca igual con o sin ideas | No frena ni repregunta al usuario |

Si el usuario sigue con su pedido sin retomar las ideas, **seguí adelante**. Tu
trabajo es sumar opciones, no establecer una barrera.

## Cuándo NO activarse

No busques si se cumple cualquiera de estos:

1. **Tarea trivial** — cambiar un texto, corregir un tilde, renombrar una variable,
   una línea, un color, un título, un import. Nada estructural que inspire.
2. **Ya se buscó en esta conversación por el mismo tema** — si en los últimos
   turnos ya presentaste ideas de GitHub para el mismo stack o la misma feature,
   no repitas la búsqueda. Si el usuario avanza con una idea y pide otra cosa,
   seguí con lo nuevo.
3. **El proyecto ya tiene la respuesta** — el repo propio, la librería instalada o
   la documentación oficial ya resuelven el punto. Buscá en el código local primero.
4. **Sin acceso a red** — si la búsqueda falla, decilo una línea y seguí trabajando.

## Paso 1 — Detectar el tema

Derivá el tema del contexto, sin preguntar. Mirá:

- **Lenguaje y framework**: `package.json`, `pyproject.toml`, `requirements.txt`,
  `go.mod`, `Cargo.toml`, `project.godot`.
- **Tipo de proyecto**: bot, panel admin, landing, juego, API, ETL, plugin, theme.
- **Feature puntual**: qué se está por hacer ahora mismo, en una frase.
- **Idioma/región o dominio**: si aplica como filtro de búsqueda.

Escribí el tema en 3-8 palabras, como lo escribiría un dev en inglés. Ejemplos:

| Situación | Tema de búsqueda |
| --- | --- |
| Panel admin con Firebase en vanilla JS | `vanilla javascript firebase admin dashboard` |
| Bot de visión por computador para juego | `computer vision game bot automation` |
| Landing de restaurante con SEO local | `restaurant website landing page seo` |
| Theme pack de sprites pixel art | `pixel art sprite sheet tileset` |

## Paso 2 — Buscar repos populares

Usá el script incluido (Node, sin dependencias, ya verificado):

```bash
node "$HOME/.config/opencode/skills/github-inspiration/scripts/gh-stars.mjs" "<tema>" --limit 10
```

El script aplica solo los filtros `stars:>1000`, `archived:false` y
`pushed:>(hace 3 años)`, ordena por estrellas y devuelve una tabla con
`STARS · REPO · LANG · PULSADO · LIC · URL · descripción`.

Flags útiles:

```bash
--min-stars 5000        # subir el piso de popularidad
--max-age-years 1       # solo lo que se movió el año pasado
--max-age-years 0       # desactivar el filtro de fecha (solo si no hay resultados)
--language TypeScript   # filtrar por lenguaje
--json                  # salida cruda para procesarla
```

**Si la primera query da 0 resultados**, relajá en este orden: menos palabras →
sacá `--language` → `--max-age-years 0`. Hasta **3 queries** por tema, y listo.

Alternativas y fallbacks:

- `gh search repos "<tema>" --sort stars --limit 10` si `gh` está instalado
  (`gh` **no** está instalado en esta máquina por defecto).
- La herramienta `websearch` para cubrir角度 o casos que la API no rankea bien.
- `webfetch` sobre el repo para leer el README si el script falla.

**Rate limit**: sin token son 10 búsquedas/min. Si el script devuelve
`rate limit`, esperá y seguí con `websearch`; no reintentes en bucle. Si tenés
`GITHUB_TOKEN` o `GH_TOKEN` en el entorno, el script lo usa automáticamente.

## Paso 3 — Elegir 2-3 y extraer ideas

Elegí los **2-3 más relevantes**, no los de más estrellas. Un repo de 60k estrellas
que no se parece al caso no sirve; uno de 3k que resuelve exactamente lo mismo, sí.

Descarte (decime el motivo en una línea, no lo escondas):

- Archivado o sin actividad en 2+ años.
- Sin licencia clara o licencia incompatible con el proyecto.
- Multilingüe sin relación, forks, mirrors, listas de enlaces, "awesome-*" sueltos.
- stars infladas por viralidad sin relación con el tema.

De cada elegido extraé con el script:

```bash
node "$HOME/.config/opencode/skills/github-inspiration/scripts/gh-stars.mjs" --tree owner/repo
node "$HOME/.config/opencode/skills/github-inspiration/scripts/gh-stars.mjs" --readme owner/repo --lines 120
node "$HOME/.config/opencode/skills/github-inspiration/scripts/gh-stars.mjs" --readme owner/repo/packages/core/README.md --lines 120
```

(es el tercer comando el que sirve en monorepos, donde el README raíz suele ser un puntero)

Extraé **ideas**, no código. Fuentes de ideas:

- **Patrones de arquitectura**: capas, event bus, cola, state machine, plugin loader.
- **Nombres de módulos**: cómo nombran carpetas y archivos; copiá la *idea* del
  nombre adaptado a tu contexto.
- **Enfoques de UI**: layout, jerarquía, navegación, estados vacíos, responsive.
- **Convenciones**: estructura de commits, lint, tests, CI, carpetas, nombres de env.
- **Features típicas**: qué trae casi siempre y que a vos te falta.
- **README bien estructurado**: orden de secciones, qué explica primero, badge de
  demo, tabla de features. Reutilizás la *estructura*, nunca el texto.

## Paso 4 — Presentar en español

Formato obligatorio, **máximo 5 ideas**, cada una con su link:

```
Idea 1 — <nombre corto de la idea>  ·  <owner/repo> (⭐ <estrellas>)
Qué hacen: <1-2 líneas concretas>
→ Cómo la aplicamos acá: <acción concreta y adaptada al proyecto propio, en 1-2 líneas>

Idea 2 — ...
```

Reglas de la presentación:

- Arrancá con las 2 más fuertes; el resto solo si aporta.
- "Cómo la aplicamos acá" habla de **tu** proyecto: archivos, carpetas y nombres
  reales del repo en el que estás trabajando. Si no los conocés, decilo explícito.
- Cerrá con una sola línea de recomendación priorizada, sin preguntar permiso:
  "Si fuera a arrancar por una: la idea 2." Y seguí trabajando.
- Si no salió nada útil: decilo en una línea ("no encontré repos abiertos
  relevantes para este tema, sigo con el diseño propio") y **no inventes nada**.

## Ejemplo real

Tarea: agregar panel de pedidos al sitio de restaurante (vanilla JS + Firebase).

```
node .../gh-stars.mjs "vanilla javascript firebase admin dashboard" --limit 10
-> 23 resultados; elige refinedev/refine (38k), ant-design/ant-design-pro (38k), appsmith (41k)

Idea 1 — Estados de carga por colección, no por pantalla  ·  refinedev/refine (⭐ 38.8k)
Qué hacen: cada recurso remoto se suscribe por separado (pedidos, productos,
clientes) y cada uno tiene su propio estado; la UI nunca queda en "cargando todo".
→ Cómo la aplicamos acá: separar `data/pedidos.js`, `data/productos.js` y
`data/clientes.js` con su propio `renderEstado()`, en vez de un `cargarTodo()` único.

Idea 2 — Confirmación explícita antes de acciones destructivas  ·  appsmithorg/appsmith (⭐ 41k)
Qué hacen: borrar o cambiar estado pide confirmación con el nombre exacto del
elemento afectado.
→ Cómo la aplicamos acá: en `cancelarPedido()` mostrar "Cancelar el pedido #4821 de
Mesa 4" antes de escribir en Firebase.

Idea 3 — README como demo  ·  ant-design/ant-design-pro (⭐ 38.8k)
Qué hacen: el README abre con badges + screenshots antes que texto.
→ Cómo la aplicamos acá: dejar el `README.md` del repo con captura del panel y
comando de arranque, no con historia del proyecto.

Si fuera a arrancar por una: la idea 1, que también destraba el error de "todo
carga junto" que ya había aparecido en las pruebas.
```

## Checklist antes de entregar

- [ ] La búsqueda tuvo ≥ 1.000 estrellas, sin archivados, con push reciente.
- [ ] Elegí 2-3 repos y descarté el resto con motivo.
- [ ] Cada idea tiene link real al repo y el número de estrellas que devolvió la búsqueda.
- [ ] Máximo 5 ideas, en español, formato "Idea → Cómo la aplicamos acá".
- [ ] Cero código copiado literal; solo enfoques y convenciones.
- [ ] Nada implementado todavía: las ideas se presentan **antes**.
- [ ] Si la búsqueda no dio nada, lo dije y seguí.

## Anti-patrones

- Presentar un muro de 15 repos sin elegir.
- Copiar un archivo entero de otro repo como "inspiración".
- Chusmear el código fuente para reescribirlo en vez de mirar README y estructura.
- Dejar las ideas para el final, cuando ya implementaste todo.
- Reintentar la búsqueda en bucle porque la primera dio 0 resultados.
- Pedirle permiso al usuario para buscar.
- Bloquear el trabajo esperando que elija una idea.

## Skills relacionadas

- `search-first` — buscar librería o paquete listo para adoptar (esto es inspiring,
  no adoptar).
- `recopilar-info` — cuando el resultado tiene que ser un documento consolidado
  con N fuentes verificadas por búsqueda.
- `skill-scout` — el mismo criterio de "no reinventes", aplicado a skills.
- `design-review` / `frontend-design-review` — después de aplicar una idea de UI.