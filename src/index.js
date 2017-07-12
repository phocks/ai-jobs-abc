const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('javascript-autocomplete'); // Better autocomplete
const jobs = require('./job-data');

const maxResults = 32;

const classificationList = jobs.jobList;

const fuseOptions = {
  shouldSort: true,
  keys: ['code', 'title'],
  threshold: 0.6,
  location: 0,
  distance: 100,
};

const fuse = new Fuse(classificationList, fuseOptions);
const fuseResult = fuse.search('query');

const complete = new autoComplete({
  selector: '#job-classification',
  minChars: 2,
  source: function(term, suggest) {
      term = term.toLowerCase();
      
      const fuseResult = fuse.search(term);

      // Limit number of results
      let suggestionCount = (fuseResult.length > maxResults ) ? suggestionCount = maxResults : fuseResult.length;

      const fuseMatches = [];
      for (let i = 0; i < suggestionCount; i++) {
        fuseMatches.push(fuseResult[i].code + " " + fuseResult[i].title);
      }

      suggest(fuseMatches);
  },
    renderItem: function (item, search) {
      search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special characters
      var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi"); // Highlight?

      // Return the element
      return '<div \
        class="autocomplete-suggestion" \
        search-code="' + item.substr(0,3) + '" \
        data-val="' + item.substring(7) + '">' + 
        item.substring(7).replace(re, "<b>$1</b>") + 
        '</div>';
  },
  onSelect: function(e, term, item){
      console.log(e);
      console.log(term);
      console.log(item);
  }
});
