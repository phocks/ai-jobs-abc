module.exports = `<div class='ai-jobs'>
<div id="search-group">
  <label for='job-search'>Search for your job title: </label>
  <input id='job-search'/>
</div>

<!-- Our Reactive Vue App -->
<div id="app" v-if="groupTitle" v-cloak>

  <h2 class="job-title">{{ jobTitle }}</h2>
  <div class="group-title">{{ groupTitle }} spend...</div>

  <div class="row">
    <div class="one-half column">
      



      <waffle-chart v-bind:percent="percentMoreSusceptible" section="more" ref="waffleMore"></waffle-chart>
      <!-- <pie-chart v-bind:percent="percentMoreSusceptible" ref="waffleMore"></pie-chart> -->

      <p><strong>{{ percentMoreSusceptible }}%</strong> of work time on tasks that are&nbsp;<strong class="more-highlighter"> more susceptible </strong>&nbsp;to automation.</p>

      <div v-if="moreTasks[0]" id="tasks-more">
      <p>Some of these typical tasks are:</p>

      <ul id="more-tasks">
        <li v-for="item in moreTasks">
          {{ item }}
        </li>
      </ul>

      </div>


    </div>
    <div class="one-half column">


      <waffle-chart v-bind:percent="percentMoreSusceptible" section="less" ref="waffleLess"></waffle-chart>
      <!-- <pie-chart v-bind:percent="percentLessSusceptible" ref="waffleLess"></pie-chart> -->
      
      <p><strong>{{ percentLessSusceptible }}%</strong> of work time on tasks that are&nbsp;<strong class="less-highlighter"> less susceptible </strong>&nbsp;to automation.</p>

      <div v-if="lessTasks[0]" id="tasks-less">
        <p>Some of these typical tasks are:</p>

        <ul id="less-tasks">
          <li v-for="item in lessTasks">
            {{ item }}
          </li>
        </ul>

      </div>
      
    </div>
  </div>

</div>



<div id="automation-comparison-chart">
  <h2>Automation comparison</h2>
  <p>When we take a look at all the employment groups we see that...</p>
  <div class="sort-buttons">
    Order by: 
    <button class="ascending">Most susceptible</button>
    <button class="descending">Least susceptible</button>
  </div>

  <div class="chart-container">
    <div class="more-key">More susceptible</div> 
    <div class="less-key">Less susceptible</div>
  </div>
  <div id="automation-list"></div>
</div>

</div>`
