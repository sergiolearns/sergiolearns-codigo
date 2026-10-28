# Solución del nivel 1 · Lo que cabe en un pendrive
# Del artículo «Informática básica — ejercicios con un pendrive, rutas de carpetas y bytes con tildes (y el notas.txt que «no existía» en el aula)»
# https://sergiolearns.com/informatica-basica-ejercicios/

# Nivel 1: ¿cuánto cabe en el pendrive? (unidades: 1 GB = 1024 MB, como cuenta el sistema operativo)
pendrive_gb = 16                       # lo que pone en la caja
capacidad_mb = pendrive_gb * 1024      # pasamos a MB: 16 × 1024
foto_mb = 3.5                          # una foto del móvil
video_mb = 850                         # un vídeo de 5 minutos
videos = 5                             # vídeos que quieres guardar primero

fotos_max = capacidad_mb // foto_mb    # // = cuántas caben enteras (no media foto)
libre_mb = capacidad_mb - videos * video_mb
fotos_libres = libre_mb // foto_mb

print("Capacidad:", capacidad_mb, "MB")
print("Fotos que caben solas:", int(fotos_max))
print("Espacio tras", videos, "vídeos:", libre_mb, "MB")
print("Fotos que caben después:", int(fotos_libres))
print("Una foto en bytes:", int(foto_mb * 1024 * 1024))
