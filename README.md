# MADSKY

Este proyecto está inspirado en [NSKYC](https://nskyc.com/), y guarda un historial del color del cielo de Madrid a lo largo del tiempo.

Para ello, un CRON guarda cada 10 minutos la medición de colores de una foto del skyline de Madrid, tomada de [madridskyline.net](https://www.madridskyline.net) hasta que cerró, y ahora [meteosierra.com](https://meteosierra.com), así como información meteorológica de [open-meteo](https://open-meteo.com/).

Está disponible en [madsky.alrico.es](https://madsky.alrico.es).

## Tecnologías utilizadas:

- [Nuxt](https://nuxt.com)
- [Sharp](https://sharp.pixelplumbing.com)
- [Drizzle](https://orm.drizzle.team/)
- [S3 / MinIO](https://min.io/)

## Configuración

Las imágenes se almacenan en el bucket S3 `madsky` y se leen desde su URL pública. Variables relevantes:

- `NUXT_S3_ENDPOINT`: endpoint del servicio S3 / MinIO.
- `NUXT_S3_ACCESS_KEY`: clave de acceso para subir imágenes.
- `NUXT_S3_SECRET_KEY`: clave secreta para subir imágenes.
- `NUXT_MEASUREMENT_IMAGE_URL`: URL pública base para leer las imágenes.

## Licencia

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
