const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('javascript-autocomplete'); // Better autocomplete
const jobs = require('./job-data');

const maxResults = 32;

const jobList = jobs.jobList;
const automationData = jobs.automationData;

// Create a lookup object for searching
const anzscoLookup = {};
for (let i = 0, len = automationData.length; i < len; i++) {
    anzscoLookup[automationData[i].anzsco] = automationData[i];
}

const fuseOptions = {
  shouldSort: true,
  keys: ['code', 'title'],
  threshold: 0.6,
  location: 0,
  distance: 100,
};

const fuse = new Fuse(jobList, fuseOptions);
const fuseResult = fuse.search('query');

const complete = new autoComplete({
  selector: '#job-search',
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
      const groupTitleEl = document.getElementsByClassName("group-title");
      const anzsco = item.getAttribute('search-code');
      const selectedGroupData = anzscoLookup[anzsco];

      console.log(selectedGroupData);


      for (let i = 0; i < groupTitleEl.length; i++) {
          groupTitleEl[i].innerText = selectedGroupData.groupTitle;
      } 
      document.getElementById("percent-less").innerText = selectedGroupData.percentLessSusceptible;
      document.getElementById("percent-more").innerText = selectedGroupData.percentMoreSusceptible;
      document.getElementById("task-less-1").innerText = selectedGroupData.taskLessAffected1;
      document.getElementById("task-less-2").innerText = selectedGroupData.taskLessAffected2;
      document.getElementById("task-more-1").innerText = selectedGroupData.taskMoreAffected1;
      document.getElementById("task-more-2").innerText = selectedGroupData.taskMoreAffected2;

      document.getElementById("automation-info").classList.remove("hidden");
  }
});
