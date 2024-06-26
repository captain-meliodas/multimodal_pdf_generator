# multimodal_pdf_generator

A multimodal pdf generator using React, GPT-4, and DALL-E

## Env Vars

Do not forget to provide these env vars with deployment

```
REACT_APP_GPT_TOKEN = "YOUR_OPEN_API_TOKEN"
REACT_APP_GPT_URL = "https://api.openai.com/v1/chat/completions"
REACT_APP_DALL_E_URL = "https://api.openai.com/v1/images/generations"
REACT_APP_GPT_MODEL = "gpt model to use"
REACT_APP_DALL_E_MODEL = "dall-e model to use"
```

## How to start the application in local
```
- switch to the root directory of the multimodal_pdf_generator
- Then run the command "npm install" to install the dependencies
- Then run the command "npm start" to start the server
```

## Updating API keys and mocking response

The mocked response is already present in the code for a visual representation of a multimodal pdf. You need to pass "mock_response" to get the mock response in the browser prompt box. When Open API key quota is expired or the wrong Open API key is given, this error will create a prompt on top of the browser to input new API keys or you can type "mock_response" in the browser prompt input on top once it is visible to get a download pdf button which contains mocked data with two pages (containing image and text).

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

# Enhancements / TODO:

- Improve image generation using paragraphs returned in the response by GPT-4.
- Separate OpenAI API calls from UI and improve application security (Create a backend separately to do the calls).
- Enhance page uses (use empty spaces efficiently) and improve on the pdf creation.
- Improve the UI interface quality by using libraries like Material UI.
- Need to write test specs (using cypress) for each component created in the component folder.
