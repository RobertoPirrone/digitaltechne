sphinx-build -M html docs docs/_build
rm -rf ../frontend/public/html
cp -a docs/_build/html ../frontend/public/

sphinx-build -b rinoh docs docs/_build/rinoh
cp -a docs/_build/rinoh/UserManual.pdf ../frontend/public/
