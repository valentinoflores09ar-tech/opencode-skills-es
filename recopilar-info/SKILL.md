---
name: recopilar-info
description: Recopila información sobre un tema desde varias fuentes, la compila y devuelve exactamente los mejores 10 resultados por búsqueda, con link verificado, resumen y takeaway. Usar cuando pidan "recopilá información de X", "buscá las mejores 10 de X", "juntá info", "dame las mejores opciones", "comparativa", "investigá X", "pasame fuentes", "referencias de".
---

# Recopilar información (top N por búsqueda)

Para **cada búsqueda** que pidas: junta candidatos, verificá los links, puntualos y
quedate con los mejores N. Después compilá todo en un solo documento.

No es un listado de lo que salió: es una selección argumentada y consolidada.

## Contrato

| Entrada | Default | Notas |
| --- | --- | --- |
| `tema` | — | Sobre qué se investiga |
| `búsquedas` | 1 | Cada una produce **su propio** top N |
| `N` | 10 | Igual para todas |
| `salida` | chat | Ruta opcional del `.md` a escribir |

**Ejemplo (caso real):** `recopilar-info "mascotas en juegos retro"` con dos búsquedas —
"mejores 10 referencias de Pokémon" y "10 referencias de pixel art de gatos" —
→ dos tablas de 10, fuentes, paleta consolidada y descartados.

## Reglas duras

1. **Exactamente N por búsqueda.** Ni uno más ni uno menos.
2. **Cero links inventados.** Toda URL pasa el verificador del Paso 3 o no entra.
3. **Cero duplicados entre búsquedas.** Si dos búsquedas dan la misma fuente, cuenta una.
4. **Nunca completar con relleno.** Si no llegás a N con fuentes verificadas, lo
   decís explícitamente en vez de inventar o de bajar la calidad.
5. **Un takeaway es una acción o un dato concreto**, no "está bueno".
6. **No descargar material ajeno** sin que lo pidan.

## Paso 1 — Partir el pedido en búsquedas

- **1 búsqueda = 1 top N.**
- Si el pedido ya trae las búsquedas ("las mejores 10 de Pokémon" + "10 de pixel
  art de gatos"), son esas mismas, una por una. No las-mescle.
- Si no, deducilas del tema (2–4 típico) y **decí cuáles son antes de arrancar**.
- Cada búsqueda persigue un objetivo distinto, no variaciones de la misma query.

## Paso 2 — Candidatos crudos

- **3 a 5 queries por búsqueda**: sinónimos, término técnico, sitios conocidos
  del nicho,.gallery/collection.
- Objetivo: **al menos 5×N candidatos** antes de puntuar.
- Anotá candidato + URL **antes** de filtrar nada. Filtrar sin lista previa es
  exactamente cómo se cuelan los links inventados.

## Paso 3 — Verificar URLs

```bash
node "$HOME/.config/opencode/skills/recopilar-info/scripts/check-urls.mjs" <url1> <url2> ...
node "$HOME/.config/opencode/skills/recopilar-info/scripts/check-urls.mjs" --file refs.txt
node "$HOME/.config/opencode/skills/recopilar-info/scripts/check-urls.mjs"    # URLs por stdin
```

Salida: `ok 200 <url>` / `BAD 404 <url>`, exit code 1 si alguna falla.
Todo lo que no dé 2xx/3xx se busca de nuevo o se descarta. **Un `BAD` nunca pasa
a la tabla final.**

> **403 en ráfaga ≠ página inexistente.** Cloudflare (Bulbapedia, PokéWiki) corta
> con 15+ requests seguidos. Si varios 403 vienen del mismo host, esperá ~10 s y
> re-verificá solo esos: bajan a 206/200. Un 404 sostenido sí es página muerta.

## Paso 4 — Puntuar candidatos

| Criterio | Peso | Qué mira |
| --- | --- | --- |
| Relevancia para la búsqueda | 30% | ¿Responde exactamente lo que se buscó? |
| Calidad como ancla | 25% | ¿Sirve para nivelar el estándar o para sostener el dato? |
| Utilidad práctica | 20% | ¿Se puede derivar una regla o un dato concreto? |
| Autoría / fuente | 15% | Autor o sitio con nombre propio. |
| Accesibilidad | 10% | Se puede ver sin login ni muro. |

Puntaje 1–5 por criterio, total sobre 5. Desempate: gana la más citada o la más
reciente. Si el #1 y el #4 quedan pegados, algo se puntuyó mal.

## Paso 5 — Extraer datos de cada ganador

- **Título**
- **Fuente / autor**
- **Link** (verificado)
- **Por qué entra** — una frase
- **Takeaway** — qué copiar, qué medir o qué decidir a partir de esto
- Si el material es visual: **paleta en hex**, o `n/a` con la razón

## Paso 6 — Compilar

Un `.md` con:

1. **Una tabla por búsqueda** — `# | Título | Fuente | Link | Por qué | Takeaway`
2. **Consolidado** — paleta, o las ideas/datos que se repiten entre búsquedas
3. **Descartados** — una línea por candidato que quedó fuera, con el motivo
4. **Cobertura** — qué se buscó y qué quedó flojo (para la próxima vuelta)

Si viene `salida`, escribir el archivo ahí y decir la ruta.

## Checklist antes de entregar

- [ ] Exactamente N por búsqueda
- [ ] Todas las URLs verificadas con `check-urls.mjs`
- [ ] Cero duplicados entre búsquedas
- [ ] Cada takeaway es una acción o un dato
- [ ] Descartados listados con motivo
- [ ] Nada de relleno para llegar a N

## Ejemplo real

`mascotas en juegos retro`, 2 búsquedas, N=10 → 20 URLs verificadas (4 de Bulbapedia
dieron 403 por rate limit y pasaron al reintento), 12 colorways consolidados,
descartes justificados. Quedó en `arte-fuente/referencias/mascotas-retro.md`.

## Estándares relacionados

- Contexto largo con muchas citas → `research-ops` o `deep-research`.
- Después renderizar sprites → `pixel-art`; generar imágenes → `image`.
- Esta skill es para cuando importa el **conteo exacto**, el **ranking** y el
  **documento consolidado**.