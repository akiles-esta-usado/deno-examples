# Deno environment

c_res='\[\033[00m\]'      # Reset
c_bla='\[\033[01;30m\]'   # Black
c_red='\[\033[01;31m\]'   # Red
c_gre='\[\033[01;32m\]'   # Green
c_yel='\[\033[01;33m\]'   # Yellow
c_blu='\[\033[01;34m\]'   # Blue
c_pur='\[\033[01;35m\]'   # Purple
c_cya='\[\033[01;36m\]'   # Cyan
c_whi='\[\033[01;37m\]'   # White

function git_branch {
    branch=$(git symbolic-ref --short HEAD 2>/dev/null)
    if [ "$branch" != "" ]; then
      echo "[$branch]"
    fi
}

# export PS1="${c_pur}\w $(git_branch)\n${c_res}\$ " ## This dont work :(
PS1="${c_cya}\u ${c_pur}\w \n${c_res}\$ " ## This dont work :(

alias ls="ls --color=auto -XF"
alias grep="grep --color=auto"

if [ -f /usr/local/etc/bash_completion.d/deno.bash ]; then
    source /usr/local/etc/bash_completion.d/deno.bash
fi