sphinx-build -M html docs docs/_build
rm -rf ../frontend/public/html
cp -a docs/_build/html ../frontend/public/
