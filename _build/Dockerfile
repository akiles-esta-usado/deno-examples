ARG BASE_IMAGE=denoland/deno:ubuntu-2.1.1

FROM ${BASE_IMAGE} as common
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=America/Santiago \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8

EXPOSE 8000

WORKDIR /app
ADD . /app

RUN --mount=type=bind,source=.,target=/_build/ \
    bash /_build/base/install.sh
RUN --mount=type=bind,source=.,target=/_build/ \
    bash -c 'cat /_build/setup/bashrc_concat.sh' >> /root/.bashrc \
    && bash /_build/setup/deno_completions.sh