## Initial Architectural Decision record for primary techstack

Completed 5/17/24

### Front-end

#### React Native
- Wanted a cross-platform frontend tool to implement both an iOS app, web app, and website. Mike wanted to push for an app as the core part of the project.
- React Native has a lot of support, and the team was most comfortable with a react based background
- Decided on completing the iOS app first in React Native. iOS first because it's the most difficult / unique, and therefore we believe that completing webapp afterwards will be easier compared to the other way around

#### TypeScript
- added safety as the project scales

### Backend

#### Firebase
- given that the current database is very small (<1 million lines), it makes sense to use Firebase given its low floor for difficulty and ease to set up.
- Ability to connect google sheets in the future
- Free

#### Firebase vs. MySQL
- database is relatively non relational, so as a result it's not super important to use SQL
- most hosting options for SQL cost money, while Firebase is free for up to 1 GB of storage, which the app will likely stay under for a long time
- SQL would take much longer to set up, and there's a high likelihood of human error as well as safety concerns which Firebase can resolve easily
- Firebase could be potentially worse than SQL because of the type of data, where Firebase's document based design might not work as well as SQL for querying rows of numbers.

#### Firebase vs. vanilla Google Sheets
- worried about more data in the future - wanted a more scalable option
- some of the data Mike wants to add, like income and other stuff might make it more difficult to use google sheets / some things might be impossible in google sheets. Using a dedicated database platform means that this issue won't occur.