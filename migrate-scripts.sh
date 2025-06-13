#!/bin/bash

# Crear carpeta de destino si no existe
mkdir -p src/migrations

# Mover los archivos de migración desde la carpeta migrations/ a src/migrations/
for file in migrations/*.ts; do
  if [ -f "$file" ]; then
    echo "Moviendo $file a src/migrations/"
    mv "$file" src/migrations/
  fi
done

echo "Migración de archivos completada."
echo "Verifica que todos los archivos estén en src/migrations/ y actualiza los imports si es necesario."
echo "Después de verificar, puedes eliminar la carpeta migrations/ si está vacía." 