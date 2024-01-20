# MADSKY

Este proyecto está inspirado en [NSKYC](https://nskyc.com/), y guarda un historial del color del cielo de Madrid a lo largo del tiempo.

Para ello, un CRON guarda cada 10 minutos la medición de colores de una foto del skyline de Madrid, tomada de [madridskyline.net](https://www.madridskyline.net), así como información meteorológica de [open-meteo](https://open-meteo.com/).

Está disponible en [madsky.alrico.es](https://madsky.alrico.es).

## Tecnologías utilizadas:

- [Astro](https://astro.build)
- [fast-average-color-node](https://www.npmjs.com/package/fast-average-color-node)
- [Deno Deploy / Deno CRON](https://deno.com/deploy)
- [Prisma](https://www.prisma.io)

## Licencia

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
