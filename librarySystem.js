(function () {
  var libraryStorage = {};

  function librarySystem(libraryName, callback) {
    if (arguments.length > 1) {
      libraryStorage[libraryName] = callback();
    }
    return libraryStorage[libraryName];
  }
  window.librarySystem = librarySystem;
}());
