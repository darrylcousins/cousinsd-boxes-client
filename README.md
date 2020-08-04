# shopify-boxes-client
Package to look after client side boxes app

To build for the app to use on the site run `npm run component`

To upload it seems easiest to use theme-kit and run

```bash
npm run component
cp dist/boxes.bundle.js ../theme-folder
cd ../theme-folder
theme deploy assets/boxes.bundle.js
```

To build for use as import Box within subscriber pages run `npm run build`

And publish to npm for install.

```bash
npm run build
npm publish --access public
```
