module.exports = `<div class='parent'>
<div id="search-group">
  <label for='job-search'>Search for your job title: </label>
  <input id='job-search'/>
</div>

<!-- Our Reactive Vue App -->
<div id="app" v-if="groupTitle" v-cloak>

  <h3>{{ groupTitle }} spend ...</h3>

  <div class="row">
    <div class="one-half column">
      <pie-chart v-bind:percent="percentLessSusceptible" ref="pieLess"></pie-chart> 
      
      <p><strong>{{ percentLessSusceptible }}%</strong> of work time on tasks that are <strong>less</strong> susceptible to automation.</p>

      <div v-if="lessTasks[0]" id="tasks-less">
        <p>Some typical things <strong>{{ groupTitle }}</strong> do that are <b>less affected</b> by automation are:</p>

        <ul id="less-tasks">
          <li v-for="item in lessTasks">
            {{ item }}
          </li>
        </ul>

      </div>
    </div>
    <div class="one-half column">

      <pie-chart v-bind:percent="percentMoreSusceptible" ref="pieMore"></pie-chart> 
      <p><strong>{{ percentMoreSusceptible }}%</strong> of work time on tasks that are <strong>more</strong> susceptible to automation.</p>

      <div v-if="moreTasks[0]" id="tasks-more">
      <p>Some typical things <strong><strong>{{ groupTitle }}</strong></strong> do that are <b>more affected</b> by automation are:</p>

      <ul id="more-tasks">
        <li v-for="item in moreTasks">
          {{ item }}
        </li>
      </ul>

    </div>
  </div>
</div>

</div>



<div id="automation-comparison-chart">
  <h2>Automation comparison</h2>
  <button>Sort</button>
  <div id="automation-list">
  </div>
</div>

</div>`