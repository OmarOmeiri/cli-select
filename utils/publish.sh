node ./utils/bumpVersion.js
read -p "Commit comment: " comment
git add \.
git commit -m "$comment"
git push origin master --no-verify