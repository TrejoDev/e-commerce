# Next.js TesloShop App
Para correr localmente, se necesita la db
```
docker-compose up -d
```
* El -d, significa __detached__

* Mongo DB URL local:
```
mongodb://localhost:27017/productsdb
```

## Renombrar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

# Reconstruir los módulos de node
```
 yarn
 yarn dev
```

# Llenar la base de datos con informacion de pruebas.

LLamar el url:
```
mongodb://localhost:27017/productsdb
```