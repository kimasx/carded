/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Card = require('../api/card/card.model');

Card.find({}).remove(function() {
  Card.create({
    question : 'Development Tools',
    answer : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    question : 'Server and Client integration',
    answer : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    question : 'Smart Build System',
    answer : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    question : 'Modular Structure',
    answer : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    question : 'Optimized Build',
    answer : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset questions for caching.'
  },{
    question : 'Deployment Ready',
    answer : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});



User.find({}).remove(function() {
  User.create({
    provider: 'local',
    question: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    question: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});