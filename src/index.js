// const horsey = require('horsey'); // Auto-complete
const Fuse = require('fuse.js'); // Better fuzzy search
const autoComplete = require('javascript-autocomplete'); // Trying another autocomplete
const jobs = require('./job-data');


// const rootEl = document.querySelector('[data-ai-jobs-abc-root]');
// const appEl = document.createElement('div');

// appEl.className = 'ai-jobs-abc';
// appEl.innerHTML = '<pre>ai-jobs-abc OK!</pre>';
// rootEl.appendChild(appEl);

console.log(jobs);

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

      // const matches = [];

      // for (let i=0; i<choices.length; i++) {
      //   if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
      // }
      // console.log(fuseMatches);

      suggest(fuseMatches);
  }
});

// Horsey does not highlight Uppercase letters so let's convert to lowercase
// const classificationListLower = [];
// for (var i = 0; i < classificationList.length; i++) {
//     classificationListLower[i] = 
//       {
//         value: classificationList[i].value,
//         text: classificationList[i].text.toLowerCase()
//       };
// }

// horsey(document.querySelector('#job-classification'), {
//   source: [{
//     // id: "Job classification",
//     list: classificationListLower
//   }],
//   getText: 'text',
//   getValue: 'value',
//   filter: (query, selection) => {
//     console.log(this.source);
//     return true;
//   },
//   // noMatches: "Not found, try again",
//   // limit: 6
// });