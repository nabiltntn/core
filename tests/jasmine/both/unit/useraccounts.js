/* eslint func-names: 0 */
/* global
  afterAll: false,
  afterEach: false,
  beforeAll: false,
  beforeEach: false,
  describe: false,
  expect: false,
  it: false,
  Logger: false,
  spyOn: false,
  UAModule: false,
  UAPlugin: false,
  UserAccounts: false,
  xit: false
*/
'use strict';

describe('UserAccounts', function() {
  var fakeModule = {};
  var fakePlugin = {};
  var mA = new UAModule({
    moduleId: 'mA',
    position: 0,
    template: 'template',
    templateClass: 'mA',
  });
  var mB = new UAModule({
    moduleId: 'mB',
    position: 0,
    template: 'template',
    templateClass: 'mB',
  });
  var pA = new UAPlugin('pA');
  var pB = new UAPlugin('pB');

  function removeModules() {
    _.each(UserAccounts._modules, function(module) {
      var name = module._id;
      delete UserAccounts._modules[name];
      delete UserAccounts[name];
    });
  }

  function removePlugins() {
    _.each(UserAccounts._plugins, function(plugin) {
      var name = plugin._id;
      delete UserAccounts._plugins[name];
      delete UserAccounts[name];
    });
  }

  mA.configure = function() {};
  mA.init = function() {};
  mA.uninit = function() {};

  pA.init = function() {};
  pA.uninit = function() {};

  describe('configure', function() {
    beforeEach(function() {
      removeModules();
    });

    afterEach(function() {
      removeModules();
    });
    it('should pass sub-options to modules and plugins', function() {
      // NOTE: this is probably more an integration test than a unit test...
      var moduleOptions = {
        thisIsTheOption: true,
      };
      var globalOptions = {
        mA: moduleOptions,
        mB: null,
      };

      spyOn(mA, 'configure');
      UserAccounts.registerModule(mA);
      UserAccounts.configure(globalOptions);
      expect(mA.configure).toHaveBeenCalled();
      expect(mA.configure).toHaveBeenCalledWith(moduleOptions);
    });
  });

  describe('modules', function() {
    xit('should return modules sorted by their position', function() {
      expect(false).toBe(true);
    });
  });

  describe('registerModule', function() {
    beforeEach(function() {
      removeModules();
    });

    it('should check the object is an instance of UAModule', function() {
      expect(function() { UserAccounts.registerModule(fakeModule); }).toThrow();
    });

    it('should check there are no modules with the same name', function() {
      UserAccounts.registerModule(mA);
      expect(function() { UserAccounts.registerModule(mA); }).toThrow();
    });

    it('should add it to UserAccounts._modules', function() {
      UserAccounts.registerModule(mA);
      expect(UserAccounts._modules.mA).toBeDefined();
      expect(UserAccounts._modules.mA).toEqual(mA);
    });

    it('should create a new field named after the module _id', function() {
      UserAccounts.registerModule(mA);
      expect(UserAccounts.mA).toBeDefined();
      expect(UserAccounts.mA).toEqual(mA);
    });

    it('should call the init method of the module', function() {
      spyOn(mA, 'init');
      UserAccounts.registerModule(mA);
      expect(mA.init).toHaveBeenCalled();
    });

    it('should not complain if module has no init method', function() {
      expect(function() { UserAccounts.registerModule(mB); }).not.toThrow();
    });
  });

  describe('registerPlugin', function() {
    beforeEach(function() {
      removePlugins();
    });

    it('should check the object is an instance of UAPlugin', function() {
      expect(function() { UserAccounts.registerPlugin(fakePlugin); }).toThrow();
    });

    it('should check there are no plugins with the same name', function() {
      UserAccounts.registerPlugin(pA);
      expect(function() { UserAccounts.registerPlugin(pA); }).toThrow();
    });

    it('should add it to UserAccounts._plugins', function() {
      UserAccounts.registerPlugin(pA);
      expect(UserAccounts._plugins.pA).toBeDefined();
      expect(UserAccounts._plugins.pA).toEqual(pA);
    });

    it('should create a new field named after the plugin _id', function() {
      UserAccounts.registerPlugin(pA);
      expect(UserAccounts.pA).toBeDefined();
      expect(UserAccounts.pA).toEqual(pA);
    });

    it('should call the init method of the plugin', function() {
      spyOn(pA, 'init');
      UserAccounts.registerPlugin(pA);
      expect(pA.init).toHaveBeenCalled();
    });

    it('should not complain if plugin has no init method', function() {
      expect(function() { UserAccounts.registerPlugin(pB); }).not.toThrow();
    });
  });

  describe('removeModule', function() {
    beforeEach(function() {
      removeModules();
      UserAccounts.registerModule(mA);
    });

    it('should check the module is currently registered', function() {
      expect(function() {UserAccounts.removeModule(mA._id); }).not.toThrow();
      expect(function() {UserAccounts.removeModule(mB._id); }).toThrow();
    });

    it('should remove module from UserAccounts._modules', function() {
      UserAccounts.removeModule(mA._id);
      expect(UserAccounts._modules.mA).toBeUndefined();
    });

    it('should delete the field named after the module', function() {
      UserAccounts.removeModule(mA._id);
      expect(UserAccounts.mA).toBeUndefined();
    });

    it('should call the uninit method of the module', function() {
      spyOn(mA, 'uninit');
      UserAccounts.removeModule(mA._id);
      expect(mA.uninit).toHaveBeenCalled();
    });

    it('should not complain if module has no uninit method', function() {
      UserAccounts.registerModule(mB);
      expect(function() { UserAccounts.removeModule(mB._id); }).not.toThrow();
    });
  });

  describe('removePlugin', function() {
    beforeEach(function() {
      removePlugins();
      UserAccounts.registerPlugin(pA);
    });

    it('should check the plugin is currently registered', function() {
      expect(function() {UserAccounts.removePlugin(pA._id); }).not.toThrow();
      expect(function() {UserAccounts.removePlugin(pB._id); }).toThrow();
    });

    it('should remove plugin from UserAccounts._plugins', function() {
      UserAccounts.removePlugin(pA._id);
      expect(UserAccounts._plugins.pA).toBeUndefined();
    });

    it('should delete the field named after the plugin', function() {
      UserAccounts.removePlugin(pA._id);
      expect(UserAccounts.pA).toBeUndefined();
    });

    it('should call the uninit method of the plugin', function() {
      spyOn(pA, 'uninit');
      UserAccounts.removePlugin(pA._id);
      expect(pA.uninit).toHaveBeenCalled();
    });

    it('should not complain if plugin has no uninit method', function() {
      UserAccounts.registerPlugin(pB);
      expect(function() { UserAccounts.removePlugin(pB._id); }).not.toThrow();
    });
  });

  describe('setLogLevel', function() {
    var oldSettings;

    beforeAll(function() {
      oldSettings = Meteor.settings;
    });

    afterAll(function() {
      Meteor.settings = oldSettings;
    });

    beforeEach(function() {
      spyOn(Logger, 'setLevel');
      Meteor.settings = {
        UserAccounts: {},
      };
    });

    it('should load log level for logger from settings', function() {
      var testLogger = new Logger('useraccounts');
      var level = 'trace';
      Meteor.settings.UserAccounts.logLevel = level;
      UserAccounts.setLogLevel(testLogger);
      expect(Logger.setLevel).toHaveBeenCalledWith(testLogger.name, level);
    });

    it('should load log level for logger from settings', function() {
      var testLogger = new Logger('useraccounts:test');
      var level = 'trace';
      Meteor.settings.UserAccounts = {
        logLevel: 'wrongLevel',
        test: {
          logLevel: level,
        },
      };
      UserAccounts.setLogLevel(testLogger);
      expect(Logger.setLevel).toHaveBeenCalledWith(testLogger.name, level);
    });

    it('should load log level for logger from settings.public', function() {
      var testLogger = new Logger('useraccounts');
      var level = 'trace';
      Meteor.settings.UserAccounts.test = { logLevel: 'wrongLevel' };
      Meteor.settings.public = {
        UserAccounts: {
          logLevel: level,
        },
      };
      UserAccounts.setLogLevel(testLogger);
      expect(Logger.setLevel).toHaveBeenCalledWith(testLogger.name, level);
    });

    it('should load log level for logger from settings.public', function() {
      var testLogger = new Logger('useraccounts:test');
      var level = 'trace';
      Meteor.settings.UserAccounts.test = { logLevel: 'wrongLevel' };
      Meteor.settings.public = {
        UserAccounts: {
          logLevel: 'wrongLevel',
          test: {
            logLevel: level,
          },
        },
      };
      UserAccounts.setLogLevel(testLogger);
      expect(Logger.setLevel).toHaveBeenCalledWith(testLogger.name, level);
    });

    xit('should load log level for logger from settings or ENV', function() {
      expect(false).toBe(true);
    });
  });

  describe('startup', function() {
    xit('should register a new callback under __startupHooks', function() {
      expect(false).toBe(true);
    });
  });
});
