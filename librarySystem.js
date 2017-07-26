(function () {
  var libraryStorage = {};

  function librarySystem(libraryName, dependencies, callback) {
    var resolvedDependencies = [];
    // storing to librarySystem
    if (arguments.length > 1) {
      if (dependencies.length > 0) {
        // recursively resolve dependencies
        resolvedDependencies = dependencies.map(function resolve(dependency) {
          return librarySystem(dependency);
        });
        // pass in resolved dependencies
        libraryStorage[libraryName] = callback.apply(this, resolvedDependencies);
      } else {
        // no dependencies, just store result of callback
        libraryStorage[libraryName] = callback();
      }
    }
    // always return result; only thing that runs if only one argument supplied
    return libraryStorage[libraryName];
  }
  window.librarySystem = librarySystem;
}());
