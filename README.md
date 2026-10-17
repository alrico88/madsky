# MADSKY

Este proyecto está inspirado en [NSKYC](https://nskyc.com/), y guarda un historial del color del cielo de Madrid a lo largo del tiempo.

Para ello, un CRON guarda cada 10 minutos la medición de colores de una foto del skyline de Madrid, tomada de [madridskyline.net](https://www.madridskyline.net) hasta que cerró, y ahora [meteosierra.com](https://meteosierra.com), así como información meteorológica de [open-meteo](https://open-meteo.com/).

Está disponible en [madsky.alrico.es](https://madsky.alrico.es).

## Tecnologías utilizadas:

- [Nuxt](https://nuxt.com)
- [Sharp](https://sharp.pixelplumbing.com)
- [Drizzle](https://orm.drizzle.team/)
- [WebDAV](https://en.wikipedia.org/wiki/WebDAV)

## Configuración

Las imágenes se leen desde el mismo endpoint WebDAV en modo público (sin credenciales) y se escriben con usuario/contraseña. Variables relevantes:

- `NUXT_WEBDAV_ENDPOINT`: base para escribir (`https://.../webdav/`)
- `NUXT_WEBDAV_USERNAME`: usuario WebDAV (solo escritura)
- `NUXT_WEBDAV_PASSWORD`: contraseña WebDAV (solo escritura)

## Licencia

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
