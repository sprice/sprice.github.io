build:
	jekyll build

serve:
	jekyll serve

watch:
	jekyll serve --watch

deploy:
	jekyll build
	s3_website push