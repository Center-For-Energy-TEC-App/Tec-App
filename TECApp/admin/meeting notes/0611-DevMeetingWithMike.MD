# Meeting Minutes: 06/11, 11:00 - 12:00 pm

#### dev meeting with mike at serf 209

#### Present Members:

- Mike

- Pedro

- Yoto

- Andrew

- Tyler


#### general notes
- talked to mike about tech stack - we'll use React Native, D3.js, Postgres SQL



#### Yoto's Notes on the TEC Google Sheets / Model
- Tab on far right is just data (I’m assuming just raw data) — Mike will give us a simplified version of this tab since some parts are unnecessary for our purposes
- Secondary calculations is taking data from tab on far right and organizing with simple calculations
- TEC Model is what takes in the inputs and what is used to update the model depending on the slider
- Inputs is the the different inputs — the orange is what the users would change and the green columns would change accordingly. On Version 10, the orange and green column are not currently accurate for the app, the sliders (orange column) would actually be Zero-Carbon Electricity Installed Capacity. 
  - tldr: The scroll bars on our app will correlate to Zero-Carbon Electricity Installed Capacity (GW). The orange columns are ideally the ones that would correlate to the scroll bar, but Version 10 is not accurate in reflecting this.
- We are working on Version 10 of the data, but in the end, we will actually want to work with Version 14 of the data (the latest version).
- Top-down vs Bottom-up:
  - Top-down (Global):
Analogy: “I have $10 and the model tells me to give $4 to Person A, $4 to Person B, and $2 to Person C”
I have $1,000,000. The model determines how much to distribute among the regions
  - Bottom-up:
Analogy: “I want to give Person A $5, Person B $7, and Person C $6. Now I gave a total of $18”
The user picks North America to have $80,000, Asia to have $100,000, South America to have $85,000, etc. for all the regions
Now I have a total of like $2,000,000 or something
- For Development: While Mike is finishing up V14 of the data, we should try to work on the frontend and utilize the V10 data for now. The data will be formatted very similary so updating our app with the V14 model instead of the V10 model would not be too much trouble