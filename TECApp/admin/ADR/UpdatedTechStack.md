## Updated Architectural Decision record for primary techstack

Completed 6/15/24

### Backend

#### Switching from Firebase to SQL
- switching from firebase to SQL:
    - data is stored in columns that are pretty easy to query in SQL
    - sql scales very well to handle new data that Mike will want to add in the future. It's more likely that future devs will have experience with SQL because UCSD classes teach SQL (132 series), which will hopefully also help with building the app in the future past us.
    - a little bit more developer interest from both tyler and andrew

#### POSTGRES vs. MYSQL
- In my mind (tyler), there's not much difference between POSTGRES and MYSQL. MySQL is slightly simpler which makes learning a bit easier, but I (tyler) have experience with postgres which should be helpful during the project. 
- Postgres was also recommended by Powell to use because it's a bit better experience than MySql

#### Frontend 
- Frontend remains unchanged