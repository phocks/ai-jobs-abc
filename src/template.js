module.exports = `<div class='ai-jobs'>
<div id="search-group" class="">
<div class="">
  <h2 class="search-header no-margin-top">Search for your job:</h2>
  <input id='job-search' onclick="this.focus();this.select()" aria-label="Search for your job. Start typing then choose an option from the list below"/>
</div>
</div>



<!-- Our App -->
<div id="app2" class="u-richtext" v-if="groupTitle" v-cloak>
  <h2 class="job-title">{{ jobTitle }}</h2>
  <div class="group-title">{{ groupTitle }}</div>

  <div class="section-more">

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="more" 
      v-bind:text="reactionMessage"
      ref="waffleMore">
    </waffle-chart>

    <p class="more-result">of your job is more susceptible to automation.</p>

    <div v-if="moreTasks[0]" id="tasks-more" class="u-richtext">
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

    <waffle-chart 
      v-bind:percent="percentMoreSusceptible" 
      section="less"
      text="That leaves"
      ref="waffleLess">
    </waffle-chart>

    <p class="less-result">of work time on tasks that are less susceptible to automation.</p>

    <div v-if="lessTasks[0]" id="tasks-less" class="u-richtext">
      <p>That&rsquo;s when you&rsquo;re doing things like...</p>

      <ul id="less-tasks">
        <li v-for="item in lessTasks">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="source-link">
      * <a href="#method">Where did you get this data?</a>
    </div>

  </div> <!-- end section-less -->

  

  <h2>What does this mean for my job?</h2>
  <p>Economist Andrew Charlton, who led the AlphaBeta team that <a href="http://www.alphabeta.com/wp-content/uploads/2017/08/The-Automation-Advantage.pdf">created this dataset</a>, says that over the next 30 years, automation will <strong>affect every job in Australia</strong> — but not always in the ways you might expect.</p>
  <p>It’s not all about machines destroying jobs, he says.</p>
  <p>“It’s not so much about what jobs will we do, but how will we do our jobs,” he explains. “Everyone will do their job differently, working with machines over the next 20 years.</p>
  <p>“For example, a retail worker will spend nine hours less on physical and routine tasks like stocking shelves and processing goods at the checkout, and nine hours more on tasks like helping customers to find what they want and providing them with advice.”</p>
  <p>Still, there’s no doubt AI will put some jobs at risk, and Charlton says the most critical thing is how Australian governments and businesses respond to the need to transform large sections of the workforce.</p>

  <h2>How does my job compare to other occupations?</h2>
  <p>Here’s how&nbsp;<strong class="your-job-text"> {{ groupTitle }} </strong>&nbsp;sit on the scale of all job groups. It’s <strong class="">{{ comparisonMessage }}</strong> automation compared to many other occupations.</p>

  <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" v-bind:highlight-percent="percentMoreSusceptible"></barcode-chart>

  <h2>Who faces the biggest risk of automation?</h2>
  <p>The Australian workers whose jobs are most susceptible to automation work in construction, trades, food prep, and cleaning.</p>

  <div class="chart-key-container" aria-hidden="true">
    <div class="more-key">More susceptible <span class="arrow">&rarr;</span></div> 
    <div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>
  </div>

  <h3 class="barcode-title">Construction and Mining Labourers</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="86">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Glaziers, Plasterers and Tilers</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="85">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Floor Finishers and Painting Trades Workers</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="84">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Food Preparation Assistants</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="84">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Cleaners and Laundry Workers</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="77">
    </barcode-chart>
  </div>


  <h2>Who faces the lowest risk of automation?</h2>
  <p>The Australian workers whose jobs are least susceptible to automation work as project managers, insurance agents, real estate agents, engineers and IT managers.</p>


  <div class="chart-key-container" aria-hidden="true">
    <div class="more-key">More susceptible <span class="arrow">&rarr;</span></div> 
    <div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>
  </div>

  <h3 class="barcode-title">Contract, Program and Project Administrators</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="7">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Insurance Agents and Sales Representatives</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="7">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Real Estate Sales Agents</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="9">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">Engineering Professionals</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="10">
    </barcode-chart>
  </div>

  <h3 class="barcode-title">ICT Managers</h3>
  <div class="barcode-chart">
    <barcode-chart v-bind:your-job-percent="percentMoreSusceptible" highlight-percent="12">
    </barcode-chart>
  </div>

  <hr>


</div>



 <div id="automation-comparison-chart" class="u-richtext">
  <h2 class="no-margin-top">Explore all jobs</h2>

  <div class="sort-wrapper" id="sort-wrapper" aria-label="Use these buttons to control sort order">
    <div class="sort-header">
      <div class="sort-detail">
        <div class="buttons">
          <button class="ascending selected notransition">Most susceptible</button>
          <button class="descending margin notransition">Least susceptible</button>
          <button class="atoz margin notransition">A-Z</button>
        </div>
        
        <div class="chart-key-container" aria-hidden="true">
          <div class="more-key">More susceptible <span class="arrow">&rarr;</span></div> 
          <div class="less-key"><span class="arrow">&larr;</span> Less susceptible</div>
        </div>
      </div>
    </div>

    <div id="automation-list"></div>
  </div>

  <a class="anchor" name="method"></a>
  <h2>How did you get this data?</h2>
  <p>Economic modelling firm AlphaBeta <a href="http://www.alphabeta.com/wp-content/uploads/2017/08/The-Automation-Advantage.pdf">conducted an analysis</a> to figure out how difficult it would be to automate each type of job in Australia, in a research project that was funded by Google.</p>
  It’s a huge task, and not simple. The project was led by economist Andrew Charlton, a former adviser to Kevin Rudd.</p>
  <p>“We broke the Australian economy down into 20 billion hours of work,” he explains, “and we asked what does every Australian do with their day, and how does what they do in their job change over the next 15 years.”</p>
  <p>In more detail, here’s the process Charlton and his team stepped through:</p>
  <ol>
  <li>The starting point was an existing US government database called O*NET, which provides a breakdown of the types of tasks every occupation performs. For example, a factory worker might ‘operate equipment’ and ‘monitor facilities’, while a sales assistant would ‘assist customers’ and ‘assess products’. The database contains more than 2,000 such work-related activities.</li>
  <li>Each of those work tasks was assessed and placed into one of six groups depending on the type of work it represented. For instance, tasks requiring interaction with other people were assigned to a group named ‘interpersonal’ and tasks such as reviewing documents or monitoring facilities were assigned to a group named ‘information analysis’.</li>
  <li>Each of those groups of work tasks was rated as ‘difficult to automate’ or ‘automatable’.</li>
  <li>All of that information was pulled together, so the researchers could see how much of any individual job was ‘difficult to automate’ and how much was ‘automatable’.</li>
  </ol>

  <h3>Credits</h3>
  <ul>
  <li>Reporting: Margot O’Neill</li>
  <li>Design, illustration: Ben Spraggon</li>
  <li>Development: Joshua Byrd</li>
  <li>Editor: Matt Liddy
  </ul>


</div> <!-- end hiding until after search -->

<div class="font_preload" style="opacity: 0">
    <span style="
      font-family: 'ABCSans','Interval Sans Pro',Arial,Helvetica,sans-serif;
      font-weight: 900"></span>
    
</div>

</div>`;
