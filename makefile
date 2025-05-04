css_dir = web/styles

header_dir = $(css_dir)/header
feed_dir = $(css_dir)/feed
menu_dir = $(css_dir)/menu

output_file = $(css_dir)/style.css

css_files = $(css_dir)/root.css \
			$(wildcard $(header_dir)/*.css) \
			$(wildcard $(feed_dir)/*.css) \
			$(wildcard $(menu_dir)/*.css)

$(output_file): $(css_files)
	@cat $(css_files) > $(output_file)
	@echo "All css files combined in $(output_file)"

clean:
	@rm -f $(output_file)
	@echo "File $(output_file) deleted"
