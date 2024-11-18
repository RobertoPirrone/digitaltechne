# rimozione di un file dal repository e dalla history
# cfr. https://nicolaiarocci.com/how-to-remove-a-file-from-git-history/
PATH_TO_FILE=src/frontend/prepare_i18n/translate/google_key.json
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch $PATH_TO_FILE" \
  --prune-empty --tag-name-filter cat -- --all

# push
git push origin --force --all

