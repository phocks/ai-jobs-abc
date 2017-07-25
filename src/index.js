const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('js-autocomplete'); // Better autocomplete
const Vue = require('vue'); // Handles reactivity 
const d3 = require('d3'); // Pretty drawings

const template = require('./template');

// Declare a few globals
let anzscoLookup,
    fuse;

// Inject our template
const placeholder = document.querySelector('#ai-jobs-abc');
placeholder.innerHTML = template;

// const placeholderData = placeholder.dataset.data;
// console.log(placeholder.dataset);

const maxResults = 32;

// Let's try to load the JSON asynchronously - maybe use Promises later
// Loading async failed cross site headers so falling back to requiring json
// loadJSON(function(response) {
// Parse JSON string into object
// const jobs = JSON.parse(response);

// Pull in the data
const jobs = require('./job-data.json');

const jobList = jobs.jobList;
const automationData = jobs.automationData;

// Create a lookup object for searching by code eg. anzscolookup[111]
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
//  });


// Create our Vue instance
const app = new Vue({
  el: '#app',
  data: {
    groupTitle: '',
    percentLessSusceptible: '',
    percentMoreSusceptible: '',
    lessTasks: [],
    moreTasks: [],
  }
});


// D3 seeems to play well with Vue components 
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

      var color = d3.scaleOrdinal(['#3C6998', 'rgba(0, 0, 0, 0.0)']);

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

    // Limit number of results to a sensible number
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
      const anzsco = item.getAttribute('search-code');
      const selectedGroupData = anzscoLookup[anzsco];

      // Update Vue data - will reactively show up in browser
      app.groupTitle = selectedGroupData.groupTitle;

      // Check if percentages are the same and redraw
      if (app.percentLessSusceptible === selectedGroupData.percentLessSusceptible &&
          app.percentMoreSusceptible === selectedGroupData.percentMoreSusceptible) {
            app.$refs.pieLess.drawPie(selectedGroupData.percentLessSusceptible);
            app.$refs.pieMore.drawPie(selectedGroupData.percentMoreSusceptible);
          } 
      else {
        app.percentLessSusceptible = selectedGroupData.percentLessSusceptible;
        app.percentMoreSusceptible = selectedGroupData.percentMoreSusceptible;
      } 

      // Clear the lists for next search
      app.lessTasks = [];
      app.moreTasks = [];

      app.lessTasks.push(selectedGroupData.taskLessAffected1);
      if (selectedGroupData.taskLessAffected2)
        app.lessTasks.push(selectedGroupData.taskLessAffected2);

      app.moreTasks.push(selectedGroupData.taskMoreAffected1);
      if (selectedGroupData.taskMoreAffected2)
        app.moreTasks.push(selectedGroupData.taskMoreAffected2);

      // Render the comparison chart
      if (app.groupTitle) {
        comparisonChart.classed('hidden', false);
      }
  }
});



// A D3 chart comparison of job automation
comparisonChart = d3.select('#automation-comparison-chart');
automationList = d3.select('#automation-list');

comparisonChart.classed('hidden', true);



const data = jobs.automationData
  .sort(function (a, b) {
    return d3.ascending(a.groupTitle, b.groupTitle);
  });


automationList.selectAll('div')
  .data(data) 
  .enter().append('div')
  .attr('class', 'parent-bar')
  .style('background-color', '#B05154')
  .append('div')
  .style('width', (d) => d.percentLessSusceptible + '%')
  .style('background-color', '#1B7A7D')
  .style('margin-bottom', '1px')
  .style('white-space', 'nowrap')
  .style('padding', '1px 5px')
  .style('color', 'white')
  .text(function (d) {
    return d.groupTitle;
  });

  d3.select("button.ascending").on("click", () => { reorder('ascending') } );
  d3.select("button.descending").on("click", () => { reorder('descending') } );



  function reorder (sortOrder) {
    d3.selectAll('div.parent-bar')
    .sort(function (a, b) {
      switch (sortOrder) {
        case "ascending":
          // Prevent unpredictable behaviour when values are identical
          if (a.percentLessSusceptible !== b.percentLessSusceptible)
            return d3.ascending(a.percentLessSusceptible, b.percentLessSusceptible);
          else
            return a.groupTitle.localeCompare(b.groupTitle);
          break;
        case "descending":
          if (a.percentLessSusceptible !== b.percentLessSusceptible)
            return d3.descending(a.percentLessSusceptible, b.percentLessSusceptible);
          else
            return a.groupTitle.localeCompare(b.groupTitle);
      }
    })
  };



// automationChart.text("Automation is cool");




// Various functions are below here
// function loadJSON(callback) {   
//    var xobj = new XMLHttpRequest();
//        xobj.overrideMimeType("application/json");
//    xobj.open('GET', placeholderData, true); 
//    xobj.onreadystatechange = function () {
//          if (xobj.readyState == 4 && xobj.status == "200") {
//            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
//            callback(xobj.responseText);
//          }
//    };
//    xobj.send(null);
// }
