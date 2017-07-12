// const horsey = require('horsey'); // Auto-complete
const Fuse = require('fuse.js'); // Better fuzzy search
const autoComplete = require('javascript-autocomplete'); // Trying another autocomplete
const jobs = require('./job-data');

classificationList = jobs.classificationList;

var fuseOptions = {
  shouldSort: true,
  keys: ['value', 'text'],
  threshold: 0.6,
  location: 0,
  distance: 100,
};

const fuse = new Fuse(classificationList, fuseOptions);
const fuseResult = fuse.search('query');

const complete = new autoComplete({
  selector: '#job-classification',
  minChars: 2,
  source: function(term, suggest){
      term = term.toLowerCase();
      
      const fuseResult = fuse.search(term);

      const fuseMatches = [];
      for (let i = 0; i < fuseResult.length; i++) {
        fuseMatches.push(fuseResult[i].text);
      }

      suggest(fuseMatches);
  },
  onSelect: function(){
      console.log('item selected');
  }
});
