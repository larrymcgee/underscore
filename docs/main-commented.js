/*
Unfamiliar concepts:
  _.each, _.find, _.some
  window.location.hash
  false inside of addEventListener
*/

(function() {
  var functions = document.querySelectorAll('[data-name]');
  var sections = document.querySelectorAll('.searchable_section');
  var searchInput = document.getElementById('function_filter');

  // Used in doesMatch and filterToc.
  // Gets value from searchInput and does some light processing.
  function searchValue() {
    return searchInput.value.trim().replace(/^_\.?/, '');
  }

  // Used in doesMatch only.
  function strIn(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return b.indexOf(a) >= 0;
  }

  // Used in filterElement, filterToc, and gotoFirst.
  function doesMatch(element) {
    var name = element.getAttribute('data-name');
    var aliases = element.getAttribute('data-aliases') || '';
    var value = searchValue();
    return strIn(value, name) || strIn(value, aliases);
  }

  // Used in filterToc only.
  function filterElement(element) {
    element.style.display = doesMatch(element) ? '' : 'none';
  }

  // What is toc?
  // Runs each time 'input' event happes on the searchInput element.
  function filterToc() {
    _.each(functions, filterElement);

    var emptySearch = searchValue() === '';

    // Hide the titles of empty sections
    _.each(sections, function(section) {
      var sectionFunctions = section.querySelectorAll('[data-name]');
      var showSection = emptySearch || _.some(sectionFunctions, doesMatch);
      section.style.display = showSection ? '' : 'none';
    });
  }

  // Runs inside the callback function that runs when enter
  // is pressed on searchInput element.
  function gotoFirst() {
    var firstFunction = _.find(functions, doesMatch);
    if (firstFunction) {
      window.location.hash = firstFunction.getAttribute('data-name');
      searchInput.focus();
    }
  }

  // Tries to show relevant functions as you type.
  searchInput.addEventListener('input', filterToc, false);

  // Press "Enter" to jump to the first matching function
  searchInput.addEventListener('keypress', function(e) {
    if (e.which === 13) {
      // Show the documentation for the first function below
      // the search input. The URL also changes to reflect
      // the position in the page.
      gotoFirst();
    }
  });

  // Press "/" to search
  document.body.addEventListener('keyup', function(event) {
    if (191 === event.which) {
      searchInput.focus();
    }
  });
}());
