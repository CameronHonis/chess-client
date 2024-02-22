#!/bin/bash

# NOTE: this is meant to be applied to a react app after it has been built.
#       allows for environment variables to be inserted after build time.
#       only injects env vars that are prefixed with REACT_APP_
#       handy in CI/CD workflows that inject configuration into pre-built images

echo "injecting environment variables..."
TARGET_STRING_REGEX='{[^{}]*(NODE_ENV:"production").*?}'

cd "$(dirname "$0")"/../build || exit
FILE_NAME_TO_SUBSTRING_PAIRS=$(grep -roP "$TARGET_STRING_REGEX" | sort | uniq)


while IFS=: read -r file match
do
  printf 'found existing config in %s:\n\t%s\n' "$file" "$match"
  match_contents="${match:1:-1}"
  WRITE_STRING='{'

  IFS=',' read -ra parts <<< "$match_contents"
  for part in "${parts[@]}"; do
    IFS=":" read -r key val <<< "$part"
    if [[ $key == REACT_APP_* && -v $key ]]; then
      echo "overriding $key=${!key}"
      val="\"${!key}\""
    fi
    WRITE_STRING+="$key:$val,"
  done

  IFS=" " read -ra react_config_keys <<< "${!REACT_APP_*}"
  for react_config_key in "${react_config_keys[@]}"; do
    if [[ ! $WRITE_STRING =~ $react_config_key ]]; then
      echo "setting $react_config_key=${!react_config_key}"
      WRITE_STRING+="$react_config_key:\"${!react_config_key}\","
    fi
  done
  WRITE_STRING+='}'
  sed -i "s/$match/$WRITE_STRING/g" "$file"
done < <(echo "$FILE_NAME_TO_SUBSTRING_PAIRS")

printf "injection complete!\n\n"