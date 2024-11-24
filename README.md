# Deno testing and evaluation environment

Objectives of this repo:

1. Provides a Devcontainer designed for making examples and tutorials with `deno`
2. Define a minimum vscode configuration that allows using most of `deno` capabilities, like linting and formatting


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