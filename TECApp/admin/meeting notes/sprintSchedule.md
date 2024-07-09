# Meeting Minutes: 6/28, 5pm-6pm

#### (Type/topic of Meeting Held) at (Physical/Digital Location)

#### Present Members:

- Yoto

- Andrew

- Tyler

#### agenda:

##### misc:
- HR approval - still more stuff to do 

##### schedule:

- need to discuss how much time different parts of the project will take - should be a long, comprehensive meeting where we cover pretty much everything that needs to be done, and give a rough time estimate

- 2 week sprints / time allocation for the summer: we have roughly 6 two week long sprints

- retrospectives after every sprint?

- 1st sprint: July 1 - July 12
    - Adjustments to time availability:
        - Yoto
        - Andrew
        - Tyler
    - Frontend - 20hr
        - update map to be the 10 different selectable regions - 4 hr
        - bottom sheet is created - 4 hr
        - onboarding feature is created - setup for fonts and other global stuff needed - 9 hr
        - top left temperature / TW bar is created - 3 hr
        - Test all frontend changes on iphone 15 pro, iphone SE, ipad 10th - primarily iphone 15, SE
    - backend - 21hr + x
        - backend postgres is setup on Digital Ocean (or potentially another hosting platform) The relations are created (there shouldn't be many if any relations so it shouldn't be too difficult) - 8 hr
        - relationship diagram for all the tables - 5 hr
        - create all tables,columns are filled with data from V10 - 8 hr
    - ci/cd - 8hr
        - finish ci/cd, it's 90% done (just a bug that needs to be fixed) - add JSDOCS for automatic basic documentation of different files in the repo - 8 hr

- 2nd sprint: July 15 - July 26
    - Adjustments to time availability:
        - Yoto - busy July 15 - 20th
        - Andrew
        - Tyler
    - Frontend / connecting to backend - 4 hr
        - Clicking on different regions in the map pulls up the respective bottom sheet - 1 hr
        - Global Climate dashboard is created and should be the default dashboard that the user pulls up - 3hr
            - The structure + text should be added. The select bar for 'Distribute Renewables' and 'Data Visualizations' should be created.
    - API / backend - 55 hr
        - Sliders should be created and interact with data. Pulling / moving the wind, solar, etc. sliders should update the renewable sources proportions section/bar. This should be the baseline: the only UI affect should just affect the current page (the proportion bar). - 10 hr for frontend, 40 hr for backend
        - the 2024, BAU (buisness as usual), and GV (global values) lines on the sliders should be pulled from the database and populate the sliders. - 5 hr



- 3rd sprint: July 29 - Aug 9
    - Adjustments to time availability:
        - Yoto
        - Andrew
        - Tyler - busy this week
    - API / backend: - 45 hr
        - after affecting the data for a region, this should update the global bottom sheet with the new values and calculate for new global temperature and TW. The global temperature and total TW should update in the top left corner. Updating multiple regions should not conflict and continue to update global temperature and TW based on toal changes made. (The temperature / TW counters on the Global Climate Dashboard should also update) - 40 hr
        - Reset to Global values button needs to be implemented to reset all changes. - 5 hr
    - Frontend - 52 hr
        - Implement the datavis tab for regions. Add in the scrollbar / buttons for each of the data visualizations: B.A.U (buisness as usual) comparison and Regional Comparison. - 4hr
        - 3 d3 graphs, BAU, Carbon Budget (just global) - 16 hr * 3 = 48hr
        - Find / build d3 graphs for Regional Comparison and B.A.U. Backend doesn't need to be implemented yet

- 4th sprint: Aug 12 - Aug 23
    - Adjustments to time availability:
        - Yoto - no time for week of 12-17th
        - Andrew
        - Tyler
    - API / backend: - 40 hr
        - Add in functionality for the graphs. 
            - Each regional B.A.U graph should have a buisness-as-usual baseline that takes the data from the sheets, and an updated line based on if the user has changed the values using the scrollbars. - 10 hr
            - Each regional Comparison graph should have the updated line based on the user's changes from the original region. Whent the user adds other regions, the updated user-changed lines from those regions should be added to the graph. - 15hr
            - The Carbon Budget graph for the global dashboard should update based on all of the combined regions. The line should be the expected amount of emissions per year that the model generates up to 2050. As the user adds more renewable energy, the line's slope decreases. - 15 hr
    - Frontend - 7hr
        -   Add in tooltips for the Regional Dashboards next to Wind, Solar, etc. Add in the help button in the top left which should open the Onboarding section. - 7 hr
    - iOS setup - 2hr
        - get a developer account, hopefully connected to / funded by UCSD - 2hr 

- 5th sprint: Aug 26 - Sep 6
    - Adjustments to time availability:
        - Yoto
        - Andrew
        - Tyler
    - Code refactoring:
        - Make the code pretty?
        - clean up documentation and comments in main / important files.
        - bugs
    - iOS setup
        - convert React-Native app into iOS. This should be pretty streamlined, but there will likely be a few issues to work out during this process.
        - 
- 6th sprint: Sep 9 - Sep 20
    - Adjustments to time availability:
        - Yoto
        - Andrew - moving in to dorms
        - Tyler
    - Code refactoring:
        - Continued if necessary
    - iOS setup
        - Continued if necessary
    - web-app + website development

- School Starts Sep 23: 



#### general notes

