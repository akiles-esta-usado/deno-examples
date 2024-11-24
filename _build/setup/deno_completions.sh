#!/bin/bash

set -eux

mkdir -p /usr/local/etc/bash_completion.d
deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
