# Build a React App

- React is a frontend library
- Vite is a build tool and dev server. Allows scaffolding of react projects


~~~bash
deno run -A npm:create-vite@latest --template react-ts
~~~


## Add packages

Until now, there's no differenciation between dependencies and Dev Dependencies on deno.
To separate those, there's should be one `package.json` file

- see https://github.com/denoland/deno/issues/26865

~~~bash
$ deno add npm:react-dom@^18.3.1 npm:react@^18.3.1
$ deno add jsr:@oak/oak jsr:@tajpouria/cors
~~~


## Oak Middleware

https://jsr.io/@oak/oak

Framework for HTTP handling inspired by koa

## CORS Middleware

https://jsr.io/@tajpouria/cors

