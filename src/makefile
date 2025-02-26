header_dir = styles/header
feed_dir = styles/feed
menu_dir = styles/menu

output_file = styles/style.css

css_files = styles/root.css \
			$(header_dir)/burgerMenu.css \
			$(header_dir)/importBar.css \
			$(header_dir)/navbar.css \
			$(header_dir)/searchBar.css \
			$(feed_dir)/card.css \
			$(feed_dir)/mainHeader.css \
			$(feed_dir)/qrcode.css \
			$(feed_dir)/sideBar.css \
			$(menu_dir)/optMenu.css \
			$(menu_dir)/sideMenu.css

$(output_file): $(css_files)
	cat $(css_files) > $(output_file)
	@echo "Fichiers css regroupés dans $(output_file)"

clean:
	rm -f $(output_file)
	@echo "Fichier $(output_file) supprimé"
