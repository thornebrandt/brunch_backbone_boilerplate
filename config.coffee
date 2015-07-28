exports.config =

  framework: 'backbone'

  paths:
    public: 'public'

  server:
    port: 19379
    run: yes

  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^(vendor|bower_components|node_modules)/
        'test/javascripts/test.js': /^test[\\/](?!vendor)/
        'test/javascripts/test-vendor.js': /^test[\\/](?=vendor)/
      order:
        before: [
          'bower_components/commonjs-require-definition',
          'bower_components/jquery/dist/jquery.js',
          'vendor/scripts/jquery.plugin.js',
          'vendor/scripts/jquery.ui.js',
          'vendor/scripts/jquery.ui.widget.js',
          'vendor/scripts/jquery.iframe-transport.js'
          'vendor/scripts/jquery.fileupload.js',
        ],
        after: [
            'vendor/scripts/jquery.ui.datepicker.js'
            'test/vendor/scripts/test-helper.js',
            'vendor/scripts/jsquery.fileupload-image.js'
        ]

    stylesheets:
      defaultExtension: 'sass'
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
