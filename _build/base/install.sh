#!/bin/bash

set -eux

apt -y update

apt install -y  --no-install-recommends locales apt-utils
sed -i -e "s/# $LC_ALL UTF-8/$LC_ALL UTF-8/" /etc/locale.gen
dpkg-reconfigure --frontend=noninteractive locales
update-locale LANG=$LANG

MINIMUM_DEPS=(
	# Build
    # binutils
	# build-essential
	patch
	make
	gawk

	# Libraries
	librsvg2-2
	librsvg2-common
	libpython3-dev
	openssl

	# Usability
	git
	curl
	wget
	sudo
	xterm
	parallel
	bzip2
	zip
	unzip
	unrar
	python3-pip
	python3-tk
)

UTILITY_DEPS=(
	# EDITORS
	neovim
	# nano
	# gedit

	# MISC
	tree
	less
	htop
)

DEPS=(
	"${MINIMUM_DEPS[@]}"
	"${UTILITY_DEPS[@]}"
)

apt install -y --no-install-recommends "${DEPS[@]}"

rm -rf /var/lib/apt/lists/*
rm -rf /tmp/*
apt -y autoremove --purge
apt -y clean

update-alternatives --install /usr/bin/python python /usr/bin/python3 0