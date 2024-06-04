# multimodal_pdf_generator

A multimodal pdf generator using React, GPT-4 and DALL-E

## Env Vars

Do not forgot to provide these env vars with deployment

```
REACT_APP_GPT_TOKEN = "YOUR_OPEN_API_TOKEN"
REACT_APP_GPT_URL = "https://api.openai.com/v1/chat/completions"
REACT_APP_DALL_E_URL = "https://api.openai.com/v1/images/generations"
REACT_APP_GPT_MODEL = "gpt model to use"
REACT_APP_DALL_E_MODEL = "dall-e model to use"
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# TODO:

- Need to test specs (using cypress) for each component created in the component folder
