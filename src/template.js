module.exports = `<div class='ai-jobs'>
<div id="search-group">
  <label for='job-search'>Search for your job title: </label>
  <input id='job-search'/>
</div>



<!-- Our Reactive Vue App -->
<div id="app" v-if="groupTitle" v-cloak>

  <h2 class="job-title">{{ jobTitle }}</h2>
  <div class="group-title">{{ groupTitle }}</div>

  <div class="reaction-message">“{{ reactionMessage }}”</div>

  <div class="section-more">

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="more" 
      ref="waffleMore">
    </waffle-chart>
    <!-- <pie-chart v-bind:percent="percentMoreSusceptible" ref="waffleMore"></pie-chart> -->

    <p><strong>{{ percentMoreSusceptible }}%</strong> of your job is&nbsp;<strong class="more-highlighter"> more susceptible </strong>&nbsp;to automation.</p>

    <div v-if="moreTasks[0]" id="tasks-more">
      <p>Some of your tasks that are easier to automate are...</p>

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

  <p>That leaves...</p>

    <!-- <div class="mid-text"><strong>That leaves</strong></div> -->
    <!-- <div class="group-title">{{ groupTitle }} spend...</div> -->

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="less" 
      ref="waffleLess">
    </waffle-chart>

    <p><strong>{{ percentLessSusceptible }}%</strong> of work time on tasks that are&nbsp;<strong class="less-highlighter"> less susceptible </strong>&nbsp;to automation.</p>

    <div v-if="lessTasks[0]" id="tasks-less">
      <p>That&rsquo;s when you&rsquo;re doing things like...</p>

      <ul id="less-tasks">
        <li v-for="item in lessTasks">
          {{ item }}
        </li>
      </ul>

    </div>
  </div> <!-- end section-less -->

  <h3>How does that compare to other occupations?</h3>
  <p>Here’s how Architects, Designers, Planners and Surveyors sit on the scale of all job groups. It’s [key phrase] automation compared to many other occupations.</p>

  <h3>Who faces the biggest risk of automation?</h3>
  <p>The Australian workers whose jobs are most susceptible to automation work in construction, trades, food prep, and cleaning.</p>

  <div class="barcode-title">Construction and Mining Labourers</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="86">
    </barcode-chart>
  </div>

  <div class="barcode-title">Glaziers, Plasterers and Tilers</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="85">
    </barcode-chart>
  </div>

  <div class="barcode-title">Floor Finishers and Painting Trades Workers</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="84">
    </barcode-chart>
  </div>

  <div class="barcode-title">Food Preparation Assistants</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="84">
    </barcode-chart>
  </div>

  <div class="barcode-title">Cleaners and Laundry Workers</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="77">
    </barcode-chart>
  </div>

  <div class="spacer"></div>

  <h3>Who faces the lowest risk of automation?</h3>
  <p>The Australian workers whose jobs are least susceptible to automation work as project managers, insurance agents, real estate agents, engineers and IT managers.</p>

  <div class="barcode-title">Contract, Program and Project Administrators</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="7">
    </barcode-chart>
  </div>

  <div class="barcode-title">Insurance Agents and Sales Representatives</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="7">
    </barcode-chart>
  </div>

  <div class="barcode-title">Real Estate Sales Agents</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="9">
    </barcode-chart>
  </div>

  <div class="barcode-title">Engineering Professionals</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="10">
    </barcode-chart>
  </div>

  <div class="barcode-title">ICT Managers</div>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="12">
    </barcode-chart>
  </div>

  <hr>

   <!-- <automation-comparison v-bind:your-job-percent="percentMoreSusceptible"></automation-comparison>  -->

</div> <!-- end Vue app -->



 <div id="automation-comparison-chart">
  <h3>Explore all jobs</h3>
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
