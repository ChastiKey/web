#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn run build

# navigate into the build output directory
cd dist

# create the CNAME file
cat > CNAME << EOF
kiera.chastikey.com
EOF


git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:ChastiKey/web.git master:gh-pages

cd -