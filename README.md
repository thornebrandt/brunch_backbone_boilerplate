## Backbone Brunch Handlebars Boilerplate

## Getting started

* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node`
    * [Brunch](http://brunch.io): `sudo npm install -g brunch`
    * [Bower](http://bower.io): `sudo install -g bower`
    * Brunch plugins and Bower dependencies: `npm install & bower install`.
* Run:
    * `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `brunch build --production` — builds minified project for production
* Deploy:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Backbone site](http://backbonejs.org/)