exports.config =

  framework: 'backbone'

  paths:
    public: 'public'

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
          'vendor/scripts/jquery.plugin.js'
        ],
        after: [
            'vendor/scripts/jquery.datepick.js'
            'test/vendor/scripts/test-helper.js'
        ]

    stylesheets:
      defaultExtension: 'sass'
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
