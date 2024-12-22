#include <stdio.h>
#include <ctype.h>

void toUpperCase(char *str) {
    for (int i=0; str[i] != '\0'; i++){
        str[i] = toupper(str[i]);
    }
}

// sudo apt update && sudo apt install --no-install-recommends -y gcc