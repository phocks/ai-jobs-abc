module.exports = `<div class='ai-jobs'>
<div id="search-group">
  <label for='job-search'>Search for your job title: </label>
  <input id='job-search'/>
</div>



<!-- Our Reactive Vue App -->
<div id="app" v-if="groupTitle" v-cloak>

  <h2 class="job-title">{{ jobTitle }}</h2>
  <div class="group-title">{{ groupTitle }}</div>

  <div v-if="false">Phew!</div>


  <div class="section-more">

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="more" 
      ref="waffleMore">
    </waffle-chart>
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


    <div class="Share-title">Share your result</div>
    <div class="ShareLinks">
      <a 
      v-bind:href=" 'http://www.facebook.com/sharer.php?t=' + shareText +
      '&amp;u=' + shareURL " 
      aria-label="Share this story via facebook" 
      class="ShareLink ShareLink--facebook" target="_blank"></a>
      
      <a v-bind:href=" 'http://twitter.com/share?url=' + shareURL +
      '&amp;text=' + shareText + '&amp;via=abcnews' " 
      aria-label="Share this story via twitter"
      class="ShareLink ShareLink--twitter" target="_blank"></a>
      
      <a v-bind:href=" 'whatsapp://send?text=' + shareText + '%20' + shareURL "
      aria-label="Share this story via whatsapp"
      class="ShareLink ShareLink--whatsapp"></a>
      
      <a v-bind:href=" 'mailto:?subject=' + shareText + '&amp;body=' + shareURL "
      aria-label="Share this story via email"
      class="ShareLink ShareLink--email"></a>
    </div>



  </div>

  <div class="section-less">

    <div class="mid-text"><strong>So that means that</strong></div>
    <div class="group-title">{{ groupTitle }} spend...</div>

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="less" 
      ref="waffleLess">
    </waffle-chart>

    <p><strong>{{ percentLessSusceptible }}%</strong> of work time on tasks that are&nbsp;<strong class="less-highlighter"> less susceptible </strong>&nbsp;to automation.</p>

    <div v-if="lessTasks[0]" id="tasks-less">
      <p>Some of these typical tasks are:</p>

      <ul id="less-tasks">
        <li v-for="item in lessTasks">
          {{ item }}
        </li>
      </ul>

    </div>
  </div> <!-- end section-less -->

  <p>As you can see below blah blah can automate about half their work tasks.</p>

  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="55">
    </barcode-chart>
  </div>

  <p>But blah blah's susceptibility to automation is very low.</p>

  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="8">
    </barcode-chart>
  </div>

  <hr>

   <!-- <automation-comparison v-bind:your-job-percent="percentMoreSusceptible"></automation-comparison>  -->

</div> <!-- end Vue app -->



 <div id="automation-comparison-chart">
  <p>Let's have a look at how our jobs compare...</p>
  <!-- <div class="sort-buttons">
    Order by: 
    <button class="ascending">Most susceptible</button>
    <button class="descending">Least susceptible</button>
  </div> -->

   <!-- <div id="barcode-chart"></div> -->

   <div class="chart-key-container">
    <div class="more-key">More susceptible <span class="arrow">&rarr;</span></div> 
    <div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>
  </div>  

    <div id="automation-list"></div>  
</div> 

</div>`
