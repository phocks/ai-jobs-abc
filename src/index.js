const Fuse = require('fuse.js'); // Nice and fuzzy search
const autoComplete = require('js-autocomplete'); // Better autocomplete
const Vue = require('vue/dist/vue.min.js'); // Use vue/dist/vue.min.j version to suppress debug msg
const d3 = require('d3'); // Pretty drawings

require('./index.scss');
const template = require('./template');

// Declare a few globals
let anzscoLookup,
    fuse;

// Inject our template
const placeholder = document.querySelector('#ai-jobs-automation');
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
    shareURL: encodeURIComponent(window.location.href),
    shareText: '',
    reactionMessage: '',
    comparisonMessage: '',
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
  onSelect: function(e, term, itemEl) {
    const anzsco = itemEl.getAttribute('search-code');
    const jobTitle = itemEl.getAttribute('data-val');
    const selectedGroupData = anzscoLookup[anzsco];

    selectGroup(selectedGroupData, jobTitle);
  }
});


function selectGroup (selectedGroupData, jobTitle) {  
  // Update Vue data - will reactively show up in browser
  app.jobTitle = jobTitle;
  app.groupTitle = selectedGroupData.groupTitle;

  // Check if percentages are the same and redraw
  // if (app.percentLessSusceptible === selectedGroupData.percentLessSusceptible &&
  //     app.percentMoreSusceptible === selectedGroupData.percentMoreSusceptible) {
  //       app.$refs.pieLess.drawPie(selectedGroupData.percentLessSusceptible);
  //       app.$refs.pieMore.drawPie(selectedGroupData.percentMoreSusceptible);
  //     } 
  // else {
    app.percentMoreSusceptible = +selectedGroupData.percentMoreSusceptible;
    app.percentLessSusceptible = +selectedGroupData.percentLessSusceptible;
  // }


  // Set emotive message displayed to user
  if (app.percentMoreSusceptible <= 25)
    app.reactionMessage = 'Phew, only';
  else if (app.percentMoreSusceptible > 25 && app.percentMoreSusceptible <= 60)
    app.reactionMessage = 'Hmm,';
  else if (app.percentMoreSusceptible > 60 && app.percentMoreSusceptible <= 80)
    app.reactionMessage = 'Gosh,';
  else if (app.percentMoreSusceptible > 80)
    app.reactionMessage = 'Whoa,';


  // Set comparison message to display
  if (selectedGroupData.percentMoreSusceptible <= 35)
    app.comparisonMessage = 'less susceptible to';
  else if (selectedGroupData.percentMoreSusceptible > 35 && selectedGroupData.percentMoreSusceptible <= 65)
    app.comparisonMessage = 'in the middle ground on';
  else if (selectedGroupData.percentMoreSusceptible > 65)
    app.comparisonMessage = 'more susceptible to';

  // Message to share on Twitter or Email etc.
  app.shareText = encodeURIComponent(selectedGroupData.percentMoreSusceptible + "% of my job is susceptible to automation. What's your result?");

  // Clear the lists for next search
  app.lessTasks = [];
  app.moreTasks = [];

  // app.lessTasks.push(selectedGroupData.taskLessAffected1);
  // if (selectedGroupData.taskLessAffected2)
  //   app.lessTasks.push(selectedGroupData.taskLessAffected2);

  // app.moreTasks.push(selectedGroupData.taskMoreAffected1);
  // if (selectedGroupData.taskMoreAffected2)
  //   app.moreTasks.push(selectedGroupData.taskMoreAffected2);

  app.lessTasks = selectedGroupData.lessAffected.slice(0,6);
  app.moreTasks = selectedGroupData.moreAffected.slice(0,6);
  

  renderYourBarToComparison(app.percentMoreSusceptible);

  // Render the comparison chart
  if (app.groupTitle) {
    comparisonChart.classed('hidden', false);
  }

}




Vue.component('waffle-chart', {
  props: ['percent', 'section', 'text'],
  template: '<div class="waffle-chart"></div>',
  mounted () {
    this.drawWaffle(this.percent, this.section, this.text);
  },
  watch: {
    percent: function (value) {
      this.drawWaffle(value, this.section, this.text);
    }
  },
  methods: {
    drawWaffle (percent, section, text) {
      // Make a data set of 100 units
      const dataset = [];

      for (let i = 0; i < percent; i++) {
        dataset.push({ label: 'more', count: i + 1})
      }

      for (let i = 0; i < (100 - percent); i++) {
        dataset.push({ label: 'less', count: +percent + i + 1})
      }


      // Setup for waffle
      var xNumOfUnits = 10,
        yNumOfUnits = 10,
        unitSize = 5,
        gap = 2;

      var chartWidth = 290;
      var chartHeight = ((unitSize * 2) + gap + 1) * 10;
      var radius = Math.min(chartWidth, radius) / 2;

      if (section === "more")
        var color = d3.scaleOrdinal(['#D2635B', 'rgba(0, 0, 0, 0.0)', '#BC6B00']);
      else
        var color = d3.scaleOrdinal(['rgba(0, 0, 0, 0.0)', '#4D6EAB', '#006987']);
      // or transparent: rgba(0, 0, 0, 0.0) 
      // or this '#3C6998'

      // Get rid of the one already there
      d3.select(this.$el).selectAll("svg").remove();

      var svg = d3.select(this.$el)
        .append('svg')
        .attr('width', '100%')
        // Make scalable
        .attr('viewBox', `0, 0, ${+chartWidth}, ${+chartHeight}`);

      let waffleGroup = svg.append('g');

      const circles = waffleGroup.selectAll('circle')
        .data(dataset)
        .enter().append('circle')
        .attr("r", function (d) {
            switch (section) {
              case 'less':
                if (d.label === "more") 
                  return unitSize - 0.5;
                else
                  return unitSize;
                break;
              case 'more':
                if (d.label === "less") 
                  return unitSize - 0.5;
                else
                  return unitSize;
            }
        })
        .attr("fill", function(d) {
          return color(d.label);
        })
        .attr('stroke', function (d) {
          switch (section) {
            case 'less':
              if (d.label == "more")
                return 'rgba(0, 0, 0, 0.3)';
              else
                return 'rgba(0, 0, 0, 0.0)';
              break;
            case 'more': 
              if (d.label == "less")
                return 'rgba(0, 0, 0, 0.3)';
              else
                return 'rgba(0, 0, 0, 0.0)';
            }
        })
        .attr("cx", function(d, i)
        {
            let col = i % xNumOfUnits;
            var x = (col * (unitSize * 2 + gap)) + (col + unitSize);
            return x;
        })
        .attr("cy", function(d, i) {
            //group n squares for column
            let row = Math.floor(i / xNumOfUnits);
            return (row * (unitSize * 2 + gap)) + (row + unitSize);
        });

      const topText = svg.append('text')
        .attr('x', chartWidth - 80)
        .attr('dy', chartHeight - 95)
        .style('font-size', '24px')
        .style('font-weight', '900')
        .style('fill', color(section) )
        // .style('stroke', function() { return color(section + "Outline")})
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'alphabetical')
        .text(text);

      const percentText = svg.append('text')
        .attr('x', chartWidth -80)
        .attr('dy', chartHeight - 27)
        .style('font-size', '76px')
        .style('font-weight', '900')
        .style('fill', color(section) )
        // .style('stroke', function() { return color(section + "Outline")})
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'alphabetical')
        .text(function () {
          if (section === 'more')
            return percent;
          else
            return 100 - percent;
        })
        .append('tspan')
        .style('font-size', '60px')
        .attr('dy', '-14px')
        .text('%');
    }
  }
});


Vue.component('barcode-chart', {
  props: ['yourJobPercent', 'highlightPercent'],
  template: `<div class="barcode-chart"></div>`,
  mounted () {
    this.drawBarcode(this.yourJobPercent, this.highlightPercent);
  },
  watch: {
    yourJobPercent: function (changedValue) {
      this.drawBarcode(changedValue, this.highlightPercent);
    }
  },
  methods: {
    drawBarcode (yourJobPercent, highlightPercent) {
      // A D3 chart comparison of job automation
      // const comparisonChart = d3.select('#automation-comparison-chart');
      // const automationList = d3.select('#automation-list');

      // Get rid of the barcode chart if one is already there
      d3.select(this.$el).selectAll("svg").remove();
      d3.select(this.$el).selectAll("div").remove();

      const barcodeChart = d3.select(this.$el)

      // comparisonChart.classed('hidden', true);


      const data = jobs.automationData
        .sort(function (a, b) {
          return d3.ascending(a.groupTitle, b.groupTitle);
        });


      // Let's build a barcode chart
      const chartWidth = '100%',
        chartHeight = 24,
        barWidth = 2, // chartWidth / 100;
        barColor = 'rgba(0, 0, 0, 0.1)';

      const highlightBarWidth = 2;
      const highlightBarHeight = 28;
      const highlightBarColor = 'rgba(255, 159, 0, 1.0)';

      const yourBarWidth = 2,
        yourBarHeight = 32,
        yourBarColor = 'rgba(189, 80, 72, 1.0)';

      const chartScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, 100]); // fallback to percentage as x indicator


      drawChart(barcodeChart, data, highlightPercent, yourJobPercent);


      function drawChart(d3El, data, highlightPosition, yourBarPosition) {
        var svgEl = d3El
          .append('svg')
          .attr('width', chartWidth)
          .attr('height', chartHeight * 3);

        let barcodeGroup = svgEl.append('g')
          .attr('transform', 'translate(0, ' + chartHeight + ')');

        // The background bar
        barcodeGroup.append('rect')
          .attr('width', chartWidth)
          .attr('height', chartHeight)
          .style('fill', '#f4f4f4');

        barcodeGroup.append('rect')
          .attr('width', chartScale(highlightPosition) + '%')
          .attr('height', chartHeight)
          .style('fill', 'rgba(255, 155, 0, 0.15)');

        // Append grey bars according to data
        barcodeGroup.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('width', barWidth)
          .attr('height', chartHeight)
          .style('fill', barColor)
          .attr('x', function (d, i) {
            return Math.floor(chartScale(d.percentMoreSusceptible)) + "%";
          });

        // Render a bar for comparison
        var highlightBar = barcodeGroup.append('rect')
          .attr('width', highlightBarWidth)
          .attr('height', highlightBarHeight)
          .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
          .style('fill', highlightBarColor)
          .attr('x', chartScale(highlightPosition) + '%');

        barcodeGroup.append('text')
          .style('font-size', '18px')
          .style('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('x', function () {
            return Math.floor(chartScale(highlightPosition)) + '%';
          })
          .attr('dx', 7)
          .attr('dy', -7)
          .attr('dominant-baseline', 'alphabetical')
          .text(highlightPosition + '%');

        // Render a bar that represents Your Job that you chose
        // const yourBar = barcodeGroup.append('rect')
        //   .attr('width', yourBarWidth)
        //   .attr('height', yourBarHeight)
        //   .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
        //   .style('fill', yourBarColor)
        //   .attr('x', function () {
        //     return Math.floor(chartScale(yourBarPosition)) + '%';
        //   });
        barcodeGroup.append('rect')
          .classed('your-bar', true)
          .attr('width', yourBarWidth)
          .attr('height', 2)
          .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
          .style('fill', yourBarColor)
          .attr('x', function (d) {
            return Math.floor(chartScale(yourJobPercent)) + '%';
          });

        barcodeGroup.append('rect')
          .classed('your-bar', true)
          .attr('width', yourBarWidth)
          .attr('height', 6)
          .attr('transform', 'translate(0, 24)')
          .style('fill', yourBarColor)
          .attr('x', function (d) {
            return Math.floor(chartScale(yourJobPercent)) + '%';
          });

        barcodeGroup.append('text')
          .style('fill', yourBarColor)
          .style('font-size', '11px')
          .style('font-weight', '900')
          .attr('text-anchor', 'middle')
          .attr('x', function () {
            return Math.floor(chartScale(yourBarPosition)) + '%';
          })
          .attr('y', yourBarHeight)
          .attr('dominant-baseline', 'alphabetical')
          .attr('dy', '1em')
          .text('Your job');

        // barcodeChart.append('div')
        //   .classed('chart-key-container', true)
        //   .html('<div class="more-key">More susceptible <span class="arrow">&rarr;</span></div><div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>');
      };
    },
  },
});



// A D3 chart comparison of job automation
// Loads at start
const comparisonChart = d3.select('#automation-comparison-chart');
const automationList = d3.select('#automation-list');
// const barcodeChart = d3.select('#barcode-chart');

comparisonChart.classed('hidden', true);


const data = jobs.automationData
  // .sort(function (a, b) {
  //   return d3.ascending(a.groupTitle, b.groupTitle);
  // });

const chartWidth = '100%',
  chartHeight = 24,
  barWidth = 2, // chartWidth / 100;
  barColor = 'rgba(0, 0, 0, 0.1)';

const highlightBarWidth = 2;
const highlightBarHeight = 28;
const highlightBarColor = 'rgba(255, 159, 0, 1.0)';

const yourBarWidth = 2,
  yourBarHeight = 32,
  yourBarColor = 'rgba(189, 80, 72, 1.0)';

const chartScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 100]); // fallback to percentage as x indicator


// Render a bar that represents Your Job that you chose
function renderYourBarToComparison (yourJobPercent) {
  d3.selectAll('.your-bar').remove();
  d3.selectAll('.your-text').remove();

  // Hack to get the illusion of going "behind" bar
  barcodeGroup.append('rect')
    .classed('your-bar', true)
    .attr('width', yourBarWidth)
    .attr('height', 2)
    .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
    .style('fill', yourBarColor)
    .attr('x', function (d) {
      return Math.floor(chartScale(yourJobPercent)) + '%';
    });

  barcodeGroup.append('rect')
    .classed('your-bar', true)
    .attr('width', yourBarWidth)
    .attr('height', 6)
    .attr('transform', 'translate(0, 24)')
    .style('fill', yourBarColor)
    .attr('x', function (d) {
      return Math.floor(chartScale(yourJobPercent)) + '%';
    });

  barcodeGroup.append('text')
  .classed('your-text', true)
    .style('fill', yourBarColor)
    .style('font-size', '11px')
    .style('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('x', function () {
      return Math.floor(chartScale(yourJobPercent)) + '%';
    })
    .attr('y', yourBarHeight)
    .attr('dominant-baseline', 'text-before-edge')
    .text('Your job');
}



const jobsInList = automationList.selectAll('div')
  .data(data) 
  .enter()
  .append('div')
  .attr('class', 'job-group-title')
  .style('font-size', '15px')
  .text(function (d) {
    return d.groupTitle;
  })
  
//   .style('cursor', 'pointer')
//   .on("click", (groupData) => {
//     selectGroup(groupData);
//     const searchInput = document.getElementById('job-search');
//     searchInput.value = groupData.groupTitle;
//     window.scrollTo(0,searchInput.offsetTop);
// });


const svgEl = jobsInList
  .append('div')
  .append('svg')
  .attr('width', chartWidth)
  .attr('height', chartHeight * 3);

let barcodeGroup = svgEl.append('g')
  .attr('transform', 'translate(0, ' + chartHeight + ')');

// The background bar
barcodeGroup.append('rect')
  .attr('width', chartWidth)
  .attr('height', chartHeight)
  .style('fill', '#f4f4f4');

// Comparison transparent fill
barcodeGroup.append('rect')
  .attr('width', (d) => { return chartScale(d.percentMoreSusceptible) + '%' })
  .attr('height', chartHeight)
  .style('fill', 'rgba(255, 155, 0, 0.15)');

// Append grey bars according to data
barcodeGroup.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('width', barWidth)
  .attr('height', chartHeight)
  .style('fill', barColor)
  .attr('x', function (d, i) {
    return Math.floor(chartScale(d.percentMoreSusceptible)) + "%";
  });

// Comparison bars
barcodeGroup.append('rect')
  .classed('target', true)
  .attr('width', highlightBarWidth)
  .attr('height', highlightBarHeight)
  .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
  .style('fill', highlightBarColor)
  .attr('x', (d) => { return chartScale(d.percentMoreSusceptible) + '%' });

barcodeGroup.append('text')
  .style('font-size', '13px')
  .style('font-weight', '900')
  .attr('text-anchor', 'middle')
  .attr('x', (d) => { return chartScale(d.percentMoreSusceptible) + '%' })
  .attr('dx', 7)
  .attr('dy', -7)
  .attr('dominant-baseline', 'alphabetical')
  .text((d) => { return d.percentMoreSusceptible + '%' });



reorder('ascending');

// Hacky way of doing this. Will fix if I get time.
d3.select("button.ascending").on("click", () => { 
  d3.select("button.ascending").classed('selected', true);
  d3.select("button.descending").classed('selected', false);
  d3.select("button.atoz").classed('selected', false);
  reorder('ascending');
} );
d3.select("button.descending").on("click", () => { 
  d3.select("button.ascending").classed('selected', false);
  d3.select("button.descending").classed('selected', true);
  d3.select("button.atoz").classed('selected', false);
  reorder('descending');
} );
d3.select("button.atoz").on("click", () => {
  d3.select("button.ascending").classed('selected', false);
  d3.select("button.descending").classed('selected', false);
  d3.select("button.atoz").classed('selected', true);
  reorder('atoz');
});


function reorder (sortOrder) {
  d3.selectAll('div.job-group-title')
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
      break;
      case "atoz":
          return a.groupTitle.localeCompare(b.groupTitle);
    }
  })
};


window.addEventListener('scroll', function () {
  // The actual box to check
  const sortWrapper = document.getElementById('sort-wrapper');

  // The thing that gets attached
  const sortHeader = document.querySelector('#sort-wrapper .sort-header');

  // Check for Nav-Bar
  if (!document.querySelector(".Nav-bar.is-hiding")) {
    sortHeader.style.setProperty('padding-top', "50px");
  } else {
    sortHeader.style.setProperty('padding-top', "5px");
  }

  // console.log(navBar);

  // Check if we should attach it
  const bounds = sortWrapper.getBoundingClientRect();
  if (bounds.top < 0) {
    sortHeader.className = 'sort-header is-fixed';
    sortWrapper.style.setProperty('padding-top', sortHeader.getBoundingClientRect().height + 'px');
  } else {
    sortHeader.className = 'sort-header';
    sortWrapper.style.setProperty('padding-top', '0');
  }

  if (bounds.bottom < 0) {
    sortHeader.style.setProperty('opacity', "0.0");
    sortHeader.style.setProperty('visibility', "hidden");
    sortHeader.style.setProperty('pointer-events', "none");
  } else {
    sortHeader.style.setProperty('opacity', "1.0");
    sortHeader.style.setProperty('visibility', "visible");
    sortHeader.style.setProperty('pointer-events', "auto");
  }
});




// outerListDiv
//   .append('div')
//   .style('width', (d) => d.percentLessSusceptible + '%')
//   // .style('background-color', '#1B7A7D')
//   .style('margin-bottom', '1px')
//   .style('white-space', 'nowrap')
//   .style('padding', '1px 5px')
//   // .style('color', 'white')
//   .text(function (d) {
//     return d.groupTitle;
// });







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



// D3 seeems to play well with Vue components 
// Vue.component('pie-chart', {
//   props: ['percent'],
//   template: '<div class="pie-chart"></div>',
//   mounted () {
//     this.drawPie(this.percent);
//   },
//   watch: {
//     percent: function (value) {
//       this.drawPie(value);
//     }
//   },
//   methods: {
//     drawPie (percent) {
//       var dataset = [
//         { label: 'Less', count: percent },
//         { label: 'More', count: 100 - percent }
//       ];

//       var width = 200;
//       var height = 200;
//       var radius = Math.min(width, height) / 2;

//       var color = d3.scaleOrdinal(['#3C6998', 'rgba(0, 0, 0, 0.0)']);

//       // Get rid of the one already there
//       d3.select(this.$el).selectAll("svg").remove();

//       var svg = d3.select(this.$el)
//         .append('svg')
//         .attr('width', +width)
//         .attr('height', +height)
//         .append('g')
//         .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
      
//       var arc = d3.arc()
//         .innerRadius(0)
//         .outerRadius(radius);

//       var pie = d3.pie()
//         .value(function(d) { return d.count; })
//         .sort(null);

//       var path = svg.selectAll('path')
//         .data(pie(dataset))
//         .enter()
//         .append('path')
//         .attr('d', arc)
//         .attr('fill', function(d, i) {
//           return color(d.data.label);
//         })
//         .transition()
//         .ease(d3.easeExpInOut)
//         .duration(750)
//         .attrTween("d", tweenPie);

//       function tweenPie(b) {
//         var i = d3.interpolate({startAngle: 0.1*Math.PI, endAngle: 0.1*Math.PI}, b);
//         return function(t) { return arc(i(t)); };
//         };
//     }
//   }
// });



// drawChart(barcodeChart, data, 77, 23);


// function drawChart(d3El, data, highlightPosition, yourBarPosition) {
//   var svgEl = d3El
//     .append('svg')
//     .attr('width', chartWidth)
//     .attr('height', chartHeight * 3);

//   let barcodeGroup = svgEl.append('g')
//     .attr('transform', 'translate(0, ' + chartHeight + ')');

//   // Render a bar that represents Your Job that you chose
//   const yourBar = barcodeGroup.append('rect')
//     .attr('width', yourBarWidth)
//     .attr('height', yourBarHeight)
//     .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
//     .style('fill', yourBarColor)
//     .attr('x', function () {
//       return Math.floor(chartScale(yourBarPosition)) + '%';
//     });

//   barcodeGroup.append('text')
//     .style('fill', yourBarColor)
//     .style('font-size', '11px')
//     .style('font-weight', 'bold')
//     .attr('text-anchor', 'middle')
//     .attr('x', function () {
//       return Math.floor(chartScale(yourBarPosition)) + '%';
//     })
//     .attr('y', yourBarHeight)
//     .attr('dominant-baseline', 'text-before-edge')
//     .text('Your job');

//   // The background bar
//   barcodeGroup.append('rect')
//     .attr('width', chartWidth)
//     .attr('height', chartHeight)
//     .style('fill', '#f4f4f4');

//   barcodeGroup.append('rect')
//     .attr('width', chartScale(highlightPosition) + '%')
//     .attr('height', chartHeight)
//     .style('fill', 'rgba(255, 155, 0, 0.15)');

//   // Append grey bars according to data
//   barcodeGroup.selectAll('rect')
//     .data(data)
//     .enter()
//     .append('rect')
//     .attr('width', barWidth)
//     .attr('height', chartHeight)
//     .style('fill', barColor)
//     .attr('x', function (d, i) {
//       return Math.floor(chartScale(d.percentMoreSusceptible)) + "%";
//     });

//   // Render a bar for comparison
//   var highlightBar = barcodeGroup.append('rect')
//     .attr('width', highlightBarWidth)
//     .attr('height', highlightBarHeight)
//     .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
//     .style('fill', highlightBarColor)
//     .attr('x', chartScale(highlightPosition) + '%');

//   barcodeGroup.append('text')
//     .style('font-size', '18px')
//     .style('font-weight', 'bold')
//     .attr('text-anchor', 'middle')
//     .attr('x', function () {
//       return Math.floor(chartScale(highlightPosition)) + '%';
//     })
//     .attr('dx', 7)
//     .attr('dy', -7)
//     .attr('dominant-baseline', 'alphabetical')
//     .text(highlightPosition + '%');

//   barcodeChart.append('div')
//     .classed('chart-key-container', true)
//     .html('<div class="more-key">More susceptible <span class="arrow">&rarr;</span></div><div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>');
// };





// No longer using because too intensive rendering 1000s of elements every time
// Vue.component('automation-comparison', {
//   props: ['yourJobPercent'],
//   template: `<div class="automation-comparison"></div>`,
//   mounted () {
//     this.drawCharts(this.yourJobPercent);
//   },
//   watch: {
//     yourJobPercent: function (changedValue) {
//       this.drawCharts(changedValue);
//     }
//   },
//   methods: {
//     drawCharts (yourJobPercent) {
//       // A D3 chart comparison of job automation
//       // const comparisonChart = d3.select('#automation-comparison-chart');
//       // const automationList = d3.select('#automation-list');

//       // Get rid of the barcode chart if one is already there
//       d3.select(this.$el).selectAll("svg").remove();
//       d3.select(this.$el).selectAll("div").remove();

//       const automationComparison = d3.select(this.$el)

//       const data = jobs.automationData
//         .sort(function (a, b) {
//           return d3.ascending(a.groupTitle, b.groupTitle);
//         });

//       const chartWidth = '100%',
//         chartHeight = 24,
//         barWidth = 2, // chartWidth / 100;
//         barColor = 'rgba(0, 0, 0, 0.1)';

//       const highlightBarWidth = 3;
//       const highlightBarHeight = 28;
//       const highlightBarColor = 'rgba(255, 159, 0, 1.0)';

//       const yourBarWidth = 3,
//         yourBarHeight = 32,
//         yourBarColor = 'rgba(195, 51, 127, 1.0)';

//       const chartScale = d3.scaleLinear()
//           .domain([0, 100])
//           .range([0, 100]); // fallback to percentage as x indicator


//       const jobsInList = automationComparison.selectAll('div')
//         .data(data) 
//         .enter()
//         .append('div')
//         .attr('class', 'job-group-title')
//         .style('font-size', '15px')
//         .text(function (d) {
//           return d.groupTitle;
//         })

//       //   .style('cursor', 'pointer')
//       //   .on("click", (groupData) => {
//       //     selectGroup(groupData);
//       //     const searchInput = document.getElementById('job-search');
//       //     searchInput.value = groupData.groupTitle;
//       //     window.scrollTo(0,searchInput.offsetTop);
//       // });


//       const svgEl = jobsInList
//         .append('div')
//         .append('svg')
//         .attr('width', chartWidth)
//         .attr('height', chartHeight * 3);

//       let barcodeGroup = svgEl.append('g')
//         .attr('transform', 'translate(0, ' + chartHeight + ')');

//       // Render a bar that represents Your Job that you chose
//       const yourBar = barcodeGroup.append('rect')
//         .attr('width', yourBarWidth)
//         .attr('height', yourBarHeight)
//         .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
//         .style('fill', yourBarColor)
//         .attr('x', function (d) {
//           return Math.floor(chartScale(yourJobPercent)) + '%';
//         });


//       barcodeGroup.append('text')
//         .style('fill', yourBarColor)
//         .style('font-size', '11px')
//         .style('font-weight', 'bold')
//         .attr('text-anchor', 'middle')
//         .attr('x', function () {
//           return Math.floor(chartScale(yourJobPercent)) + '%';
//         })
//         .attr('y', yourBarHeight)
//         .attr('dominant-baseline', 'text-before-edge')
//         .text('Your job');

//       // The background bar
//       barcodeGroup.append('rect')
//         .attr('width', chartWidth)
//         .attr('height', chartHeight)
//         .style('fill', '#f4f4f4');

//       // Comparison transparent fill
//       barcodeGroup.append('rect')
//         .attr('width', (d) => { return chartScale(d.percentMoreSusceptible) + '%' })
//         .attr('height', chartHeight)
//         .style('fill', 'rgba(255, 155, 0, 0.15)');

//       // Append grey bars according to data
//       barcodeGroup.selectAll('rect')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('width', barWidth)
//         .attr('height', chartHeight)
//         .style('fill', barColor)
//         .attr('x', function (d, i) {
//           return Math.floor(chartScale(d.percentMoreSusceptible)) + "%";
//         });

//       // Comparison bars
//       barcodeGroup.append('rect')
//         .classed('target', true)
//         .attr('width', highlightBarWidth)
//         .attr('height', highlightBarHeight)
//         .attr('transform', 'translate(0, ' + '-' + (highlightBarHeight - chartHeight) / 2 + ')')
//         .style('fill', highlightBarColor)
//         .attr('x', (d) => { return chartScale(d.percentMoreSusceptible) + '%' });

//       barcodeGroup.append('text')
//         .style('font-size', '13px')
//         .style('font-weight', '900')
//         .attr('text-anchor', 'middle')
//         .attr('x', (d) => { return chartScale(d.percentMoreSusceptible) + '%' })
//         .attr('dx', 7)
//         .attr('dy', -7)
//         .attr('dominant-baseline', 'alphabetical')
//         .text((d) => { return d.percentMoreSusceptible + '%' });


//       reorder('ascending');


//       function reorder (sortOrder) {
//         d3.selectAll('div.job-group-title')
//         .sort(function (a, b) {
//           switch (sortOrder) {
//             case "ascending":
//               // Prevent unpredictable behaviour when values are identical
//               if (a.percentLessSusceptible !== b.percentLessSusceptible)
//                 return d3.ascending(a.percentLessSusceptible, b.percentLessSusceptible);
//               else
//                 return a.groupTitle.localeCompare(b.groupTitle);
//               break;
//             case "descending":
//               if (a.percentLessSusceptible !== b.percentLessSusceptible)
//                 return d3.descending(a.percentLessSusceptible, b.percentLessSusceptible);
//               else
//                 return a.groupTitle.localeCompare(b.groupTitle);
//           }
//         })
//       };
//     },
//   },
// });