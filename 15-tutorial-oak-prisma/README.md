# Tutorial Oak + Prisma

## 1. Setup del entorno

Creación del archivo `docker-compose.yaml` que especifica como montar un contenedor postgresql

Además, se intancia deno con `deno init`. Se eliminan los archivos `*.ts` y se mueve el .json a .jsonc.

## 2. Inicializar prisma

~~~bash
deno run -A npm:prisma init
~~~

Esto genera una estructura pequeña

- Un archivo `prisma/schema.prisma`. Se modifica para configurar el generador a deno y agregar un modelo Dinosaur
- Un archivo .env, que ocupa las mismas credenciales del archivo `docker-compose.yml`

## 3. Cargar la base de datos

~~~bash
deno run -A npm:prisma db push
~~~

Se crea el schema en postgres.
Esto va a crear

- generated/        código de cliente específico para deno, aunque aún no se genera el cliente
- package.json      con dependencias de prisma y cliente
