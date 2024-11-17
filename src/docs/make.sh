. .venv/bin/activate
cd docs

sphinx-build -D html_theme=alabaster -D html_theme_options.nosidebar=True . ./_build/html
rm -rf ../frontend/public/html_en
cp -a docs/_build/html ../frontend/public/

sphinx-build -D master_doc=index_it -D html_theme=alabaster -D html_theme_options.nosidebar=True . ./_build/html_it
rm -rf ../../frontend/public/html_it
cp -a ./_build/html_it ../../frontend/public/
exit 0

sphinx-build -b html . ./rtd_build_en/html
rm -rf ../../frontend/public/rtd_html_en
cp -a ./rtd_build_en/html ../../frontend/public/rtd_html_en

sphinx-build -b html -D master_doc=index_it .  rtd_html_it
rm -rf ../../frontend/public/rtd_html_it
cp -a ./rtd_html_it ../../frontend/public

sphinx-build -b html -D master_doc=index_de .  rtd_html_de
rm -rf ../../frontend/public/rtd_html_de
cp -a ./rtd_html_de ../../frontend/public

sphinx-build -b rinoh . ./_build/rinoh
cp -a ./_build/rinoh/UserManual.pdf ../../frontend/public/

sphinx-build -D html_theme=alabaster -D html_theme_options.nosidebar=True . ./_build/html
rm -rf ../frontend/public/html
cp -a docs/_build/html ../frontend/public/

deactivate
