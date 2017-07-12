const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('javascript-autocomplete'); // Better autocomplete
const jobs = require('./job-data');

const classificationList = jobs.classificationList;

const fuseOptions = {
  shouldSort: true,
  keys: ['value', 'text'],
  threshold: 0.6,
  location: 0,
  distance: 100
};

const fuse = new Fuse(classificationList, fuseOptions);
const fuseResult = fuse.search('query');

const complete = new autoComplete({
  selector: '#job-classification',
  minChars: 2,
  source: function(term, suggest){
      term = term.toLowerCase();
      
      const fuseResult = fuse.search(term);

      console.log(fuseResult);

      const fuseMatches = [];
      for (let i = 0; i < fuseResult.length; i++) {
        fuseMatches.push(fuseResult[i].text);
      }

      suggest(fuseMatches);
  },
  //   renderItem: function (item, search) {
  //   search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  //   var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
  //   return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
  // },
  onSelect: function(e, term, item){
      console.log(e);
      console.log(term);
      console.log(item);
  }
});
