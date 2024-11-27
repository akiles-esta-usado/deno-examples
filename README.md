# Deno testing and evaluation environment

Objectives of this repo:

1. Provides a Devcontainer designed for making examples and tutorials with `deno`
2. Define a minimum vscode configuration that allows using most of `deno` capabilities, like linting and formatting

## Deno Advantages


TODO: Rewrite

Use of deno removes dependencies like nodemon, eslint and prettier for tasks like restarting when file changes, linting and formatting.
nvm for version management and ... for ...
Even has a standard library that reduces greatly the amount of external dependencies commonly used, like lodash
testing and jest and works with TypeScript



## Linting

Process of analyze the code for potential errors, bugs and stylistic issues.
Rules are defined by `ESLint`

## Formatting

Automatically adjust the code layout to adhere a consistent style.
`deno fmt` is based on rust `dprint`.

The code can be checked avoiding formatting with `deno fmt --check`. Useful on CI or pre-commit hooks


## Github Actions

- https://docs.github.com/en/actions/about-github-actions/understanding-github-actions

CICD platform to automate build, test and deployment of an application.


## Pre-commit hooks

This validates


## Bruno Rest Client

Is a REST client that differenciates from Postman and Insomnia in that it has a very good approach to community

https://docs.usebruno.com/bru-cli/overview

~~~bash
deno install --global --allow-env --allow-read --allow-sys --allow-net npm:@usebruno/cli/bru
~~~

## Vite

Vite is a modern frontend build tool

https://vite.dev/guide/why.html
