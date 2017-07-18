const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('javascript-autocomplete'); // Better autocomplete
const Vue = require('vue');
const d3 = require('d3');

// Pull in the data
// const jobs = require('./job-data');

// Declare a few globals is maybe good
let anzscoLookup,
    fuse;

const maxResults = 32;

// Let's try to load the JSON asynchronously - maybe use Promises later
loadJSON(function(response) {
  // Parse JSON string into object
    const jobs = JSON.parse(response);
    // console.log(jobs);

    const jobList = jobs.jobList;
    const automationData = jobs.automationData;

    // Create a lookup object for searching
    anzscoLookup = {};
    for (let i = 0, len = automationData.length; i < len; i++) {
        anzscoLookup[automationData[i].anzsco] = automationData[i];
    }

    const fuseOptions = {
      shouldSort: true,
      keys: ['code', 'title'],
      threshold: 0.6,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
    };

    fuse = new Fuse(jobList, fuseOptions);
    const fuseResult = fuse.search('query');
 });





// Create our Vue instance
const app = new Vue({
  el: '#app',
  data: {
    groupTitle: '',
    percentLessSusceptible: '',
    percentMoreSusceptible: '',
    // taskLessAffected1: '',
    // taskLessAffected2: '',
    // taskMoreAffected1: '',
    // taskMoreAffected2: '',
    lessTasks: [],
    moreTasks: [],
    
  }
});


// Trying a Vue component for pie chart
// Need to streamline this
Vue.component('pie-chart', {
  props: ['percent'],
  template: '<div class="pie-chart"></div>',
  mounted () {
    this.drawPie(this.percent);
  },
  watch: {
    percent: function (value) {
      this.drawPie(value);
    }
  },
  methods: {
    drawPie (percent) {
      var dataset = [
        { label: 'Less', count: percent },
        { label: 'More', count: 100 - percent }
      ];

      var width = 200;
      var height = 200;
      var radius = Math.min(width, height) / 2;

      var color = d3.scaleOrdinal(['#3C6998', 'white']);

      // Get rid of the one already there
      d3.select(this.$el).selectAll("svg").remove();

      var svg = d3.select(this.$el)
        .append('svg')
        .attr('width', +width)
        .attr('height', +height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
      
      var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null);

      var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
          return color(d.data.label);
        })
        .transition()
        .ease(d3.easeExpInOut)
        .duration(750)
        .attrTween("d", tweenPie);

      function tweenPie(b) {
        var i = d3.interpolate({startAngle: 0.1*Math.PI, endAngle: 0.1*Math.PI}, b);
        return function(t) { return arc(i(t)); };
        };
    }
  }
});

// Create our autoComplete instance
const complete = new autoComplete({
  selector: '#job-search',
  minChars: 1,
  delay: 150,
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

    // Remove title code from data
    item = item.replace(/\s+\(S\)|\s\(P\)|\s\(A\)|\s\(N\)|\snec/g, "");

    // Return the element
    return '<div \
      class="autocomplete-suggestion" \
      search-code="' + item.substr(0,3) + '" \
      data-val="' + item.substring(7) + '">' + 
      item.substring(7).replace(re, "<b>$1</b>") + 
        '</div>';
  },
  onSelect: function(e, term, item) {
      const groupTitleEl = document.getElementsByClassName("group-title");
      const anzsco = item.getAttribute('search-code');
      const selectedGroupData = anzscoLookup[anzsco];

      console.log(selectedGroupData);

      // Update Vue data - will reactively show up in browser
      app.groupTitle = selectedGroupData.groupTitle;

      app.percentLessSusceptible = selectedGroupData.percentLessSusceptible;
      app.percentMoreSusceptible = selectedGroupData.percentMoreSusceptible;

      // app.taskLessAffected1 = selectedGroupData.taskLessAffected1;
      // app.taskLessAffected2 = selectedGroupData.taskLessAffected2;

      // app.taskMoreAffected1 = selectedGroupData.taskMoreAffected1;
      // app.taskMoreAffected2 = selectedGroupData.taskMoreAffected2;

      // Clear the lists for next search
      app.lessTasks = [];
      app.moreTasks = [];

      app.lessTasks.push(selectedGroupData.taskLessAffected1);
      app.lessTasks.push(selectedGroupData.taskLessAffected2);

      app.moreTasks.push(selectedGroupData.taskMoreAffected1);
      app.moreTasks.push(selectedGroupData.taskMoreAffected2);

      // app.lessTasks = [selectedGroupData.taskLessAffected1, selectedGroupData.taskLessAffected2];
      // app.moreTasks = [selectedGroupData.taskMoreAffected1, selectedGroupData.taskMoreAffected2]
  }
});


// Various functions are below here
function loadJSON(callback) {   
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'job-data.json', true); 
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);  
}
