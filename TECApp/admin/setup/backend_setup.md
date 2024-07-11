# To start backend server locally:
Get .env file from Secrets folder in Google Drive and put it into the backend directory. Then, to run the server:
```
cd backend
npm start       //this is just a custom script, you can see all of them in the "scripts" section of package.json
```
For production, backend has to be deployed to an actual server (various options online), but for development purposes we just host it on our computer then make requests directly to the localhost url in the frontend.
