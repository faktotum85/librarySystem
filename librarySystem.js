(function () {
  var libraryStorage = {};

  function librarySystem(libraryName, dependencies, callback) {
    var resolvedDependencies = [];
    var resolvedValue;
    var storedLibrary = libraryStorage[libraryName];
    if (arguments.length > 1) { // extra argunments - storing to librarySystem
      libraryStorage[libraryName] = {
        resolved: false,
        callback: callback,
        dependencies: dependencies
      };
    } else { // single argument passed in - return result
      // check if value is already cached
      if (storedLibrary.resolved === true) {
        return storedLibrary.value;
      }
      // not been called yet -> resolve dependencies and value
      resolvedDependencies = storedLibrary.dependencies.map(function resolve(dependency) {
        return librarySystem(dependency);
      });
      resolvedValue = storedLibrary.callback.apply(this, resolvedDependencies);
      // cache and return; need to assign directly to libraryStorage to overwrite
      libraryStorage[libraryName] = {
        resolved: true,
        value: resolvedValue
      };
      return resolvedValue;
    }
  }
  window.librarySystem = librarySystem;
}());

tests({
  'It should store and load libraries in a single global variable': function () {
    librarySystem('app', [], function () {
      return 'app';
    });
    eq(librarySystem('app'), 'app');
  },
  'It should accept dependencies': function () {
    librarySystem('dependency', [], function () {
      return 'loaded dependency';
    });
    librarySystem('app', ['dependency'], function (dependency) {
      return 'app with ' + dependency;
    });
    eq(librarySystem('app'), 'app with loaded dependency');
  },
  'It should work with multiple dependencies': function () {
    librarySystem('name', [], function () {
      return 'Gordon';
    });
    librarySystem('company', [], function () {
      return 'Watch and Code';
    });
    librarySystem('workBlurb', ['name', 'company'], function (name, company) {
      return name + ' works at ' + company;
    });
    eq(librarySystem('workBlurb'), 'Gordon works at Watch and Code');
  },
  'It should allow libraries to be created out of order': function () {
    // reset librarySystem to avoid previous test influencing results
    librarySystem('workBlurb', [], function () { return undefined; });
    librarySystem('name', [], function () { return undefined; });
    librarySystem('company', [], function () { return undefined; });
    // run test
    librarySystem('workBlurb', ['name', 'company'], function (name, company) {
      return name + ' works at ' + company;
    });
    librarySystem('name', [], function () {
      return 'Gordon';
    });
    librarySystem('company', [], function () {
      return 'Watch and Code';
    });
    eq(librarySystem('workBlurb'), 'Gordon works at Watch and Code');
  },
  'It should only run the callback function for each library once': function () {
    var callbackCount = 0;
    librarySystem('dependedOn', [], function () {
      callbackCount += 1;
      return 'depended on';
    });
    librarySystem('iAm', ['dependedOn'], function (dependedOn) {
      return 'I am ' + dependedOn;
    });
    librarySystem('youAre', ['dependedOn'], function (dependedOn) {
      return 'You Are ' + dependedOn;
    });
    librarySystem('iAm');
    librarySystem('youAre');
    eq(callbackCount, 1);
  }
});
