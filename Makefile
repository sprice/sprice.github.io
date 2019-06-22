build:
	bundle exec jekyll build

serve:
	bundle exec jekyll serve

drafts:
	bundle exec jekyll serve --drafts

deploy:
	bundle exec jekyll build
	s3_website push