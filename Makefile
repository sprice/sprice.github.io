build:
	npm run build:css
	bundle exec jekyll clean
	bundle exec jekyll build

serve:
	npm run build:css
	bundle exec jekyll clean
	bundle exec jekyll serve

drafts:
	npm run build:css
	bundle exec jekyll clean
	bundle exec jekyll serve --drafts

deploy:
	npm run build:css
	bundle exec jekyll clean
	bundle exec jekyll build
	s3_website push