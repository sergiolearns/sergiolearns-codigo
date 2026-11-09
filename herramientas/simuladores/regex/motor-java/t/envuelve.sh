#!/bin/bash
o=/tmp/w_$(basename $1)
{ grep '^import ' $1 | grep -v '^import java\.util\.regex\.'; cat "$(dirname "$0")/../SlRegex.java"; grep -v '^import ' $1 | sed 's/java\.util\.regex\.//g'; } > $o; echo $o
