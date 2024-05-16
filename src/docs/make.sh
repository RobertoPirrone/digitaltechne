sphinx-build -D html_theme=alabaster -D html_theme_options.nosidebar=True docs docs/_build/html
rm -rf ../frontend/public/html
cp -a docs/_build/html ../frontend/public/

sphinx-build -M html docs docs/rtd_build
rm -rf ../frontend/public/rtd_html
cp -a docs/rtd_build/html ../frontend/public/rtd_html

sphinx-build -b rinoh docs docs/_build/rinoh
cp -a docs/_build/rinoh/UserManual.pdf ../frontend/public/
