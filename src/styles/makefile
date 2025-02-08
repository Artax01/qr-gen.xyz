header_dir = header
feed_dir = feed
menu_dir = menu

output_file = style.css

css_files = root.css \
			$(header_dir)/burgerMenu.css \
			$(header_dir)/importBar.css \
			$(header_dir)/navbar.css \
			$(header_dir)/searchBar.css \
			$(feed_dir)/card.css \
			$(feed_dir)/mainHeader.css \
			$(feed_dir)/qrcode.css \
			$(menu_dir)/creationMenu.css \
			$(menu_dir)/optMenu.css \
			$(menu_dir)/sideMenu.css

$(output_file): $(css_files)
	cat $(css_files) > $(output_file)
	@echo "Fichiers css regroupés dans $(output_file)"

clean:
	rm -f $(output_file)
	@echo "Fichier $(output_file) supprimé"
