Clone the repo, and run these in the vscode command line
``` 
npm install -g pnpm
pnpm install
pnpm start
``` 

if running into issues - might need to download expo, npm, react, react-native

try `npm add @babel/runtime`
`npm start`

try ```npx expo start```



Run these commands for linting and formating.

- `pnpm exec prettier . --write` - This command will automatically format code according to the prettierrc guidelines

- `pnpm eslint [filename]` - This command currently works on eslint 8.57.0, and finds common issues that helps to prevent future bugs. If the command is not working, check that the eslint version on your computer is 8.57 using `eslint --v`. If a different version, try `pnpm upgrade eslint@^8.56.0`.

[React Native Doc](https://reactnative.dev/docs/environment-setup) I ended up using to setup the environment
