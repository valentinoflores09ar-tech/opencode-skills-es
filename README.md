# opencode-skills-es

Skills para [opencode](https://opencode.ai) escritas en español. Pensadas para
gente que trabaja en español y quiere que el agente piense en su idioma.

Cada skill es una carpeta con un `SKILL.md`: un `SKILL.md` con frontmatter
YAML (campo `name` y `description`) y, si hace falta, `scripts/` y
`references/`.

## Instalación

Copiá la carpeta de la skill que quieras a tu directorio de skills:

```powershell
# global (todas las sesiones)
Copy-Item -Recurse .\skills\NOMBRE "$HOME\.config\opencode\skills\"

# o por proyecto
Copy-Item -Recurse .\skills\NOMBRE .\.opencode\skills\
```

No hay dependencias que instalar. Los scripts usan solo `node` (sin librerías
externas) o la librería estándar de Python.

## Skills

### `recopilar-info`

Para cada búsqueda: junta candidatos, verifica los links y devuelve
**exactamente los N mejores** de esa búsqueda, con resumen y takeaway.

Lo que aporta sobre "buscá en Google":

- Un **conteo exacto** por búsqueda, ni uno más ni uno menos.
- **Cero links inventados**: todo URL pasa por un verificador (`scripts/check-urls.mjs`)
  o no entra al resultado.
- Un **documento consolidado** con tablas, fuentes y los descartados con su motivo.

```powershell
node scripts/check-urls.mjs --file refs.txt
```

Ejemplo de salida: dos tablas de 10, paleta de colores consolidada y una lista
de descartes con motivo.

### `pedido-a-prompt`

Convierte un pedido en prosa en un prompt estructurado, listo para pegar en otra
IA: chat de texto o generador de imágenes (Midjourney, DALL-E, Flux, Gemini).

Trae plantillas para texto e imagen en `references/plantillas.md`, con campos
obligatorios y opcionales según el destino.

```powershell
# no hace nada por sí sola: la cargás como skill y el agente la aplica
```

### `github-inspiration`

Busca repos abiertos de GitHub con **más de 1.000 estrellas** sobre el tema en el
que estás trabajando y extrae ideas concretas antes de que escribas código.

```powershell
node scripts/gh-stars.mjs "react admin dashboard" --limit 10
node scripts/gh-stars.mjs --tree refinedev/refine
node scripts/gh-stars.mjs --readme refinedev/refine --lines 120
```

Filtra solo (archivados, sin push reciente, sin licencia clara) y devuelve ideas
en el formato **"Idea → Cómo la aplicamos acá"**.

**No es obligatoria y no frena el trabajo**: es una referencia inspiracional.
Para autorizar la API con más margen de consultas, definí `GITHUB_TOKEN`.

## Principio común

Las tres hacen lo mismo en su capa: **no inventar**. Links verificados antes de
citarlos, ideas con el repo de origen pegado, y si no hay resultados, decirlo
claro en vez de rellenar.

## Licencia

MIT. Ver [LICENSE](LICENSE).
