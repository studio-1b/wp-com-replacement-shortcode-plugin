# wp-com-replacement-shortcode-plugin.
Plugin to install, if you want easy way to (mostly) restore [googlemap] shortcode embed, and responsive [gallery] that is in wordpress.com.

 [googlemap] shortcode embed, and responsive [gallery] is not not in wordpress software.  In case you exported wordpress.com, and imported it into wordpress software, expecting it to work as before.

 [googlemap] embeds isn't implemented at all

 [gallery] and galleryblocks, work differently in wordpress software.  While they work mostly the same, in wordpress.com.  Clicking will both bring up carousel, with image enlargement.

 So this will make both work more or less the same way in wordpress software.  Though some differences exist.  This was a project to migrate Wordpress.com to my own server and I didn't expect so much to not implemented in wordpress software.  Hope this helps a little.  None of the code is production quality, and was barely tested by me (since it is so simple).  Just enough, so it works.

## To install into wordpress

Copy onto wordpress server, another repository with the .zip file
```
git clone https://github.com/studio-1b/containerize_wordpress_com.git
```
This should have a file: bob-shortcode-plugin.zip

Installing using WP-CLI (https://developer.wordpress.org/cli/commands/plugin/install/)
```
wp plugin install bob-shortcode-plugin.zip
```

Or **Install the zip file using the Wordpress admin**:
https://www.godaddy.com/en-ca/help/install-a-wordpress-plugin-from-a-zip-file-40849

The bob-shortcode-plugin.zip file should contain exactly what is in the source code here in this repository.  Clone this repository, if you want to make modifications of your own.

## To repack as your own plugin, read:
https://make.wordpress.org/cli/handbook/how-to/how-to-create-custom-plugins/
https://www.tbare.com/2018/10/create-a-simple-wordpress-plugin/
https://wpengine.com/resources/create-custom-shortcode-in-wordpress/
