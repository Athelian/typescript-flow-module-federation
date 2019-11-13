# Zenport Web App

Web application for Zenport with [create-react-app-v3](https://github.com/facebook/create-react-app/releases/tag/v3.0.1)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

- **Essential**

  - Node.js

    Install node.js using [nvm](https://github.com/creationix/nvm) or on windows use [nvm-windows](https://github.com/coreybutler/nvm-windows).

    this helps us to manage different version of node on our machine easily.

    Follow the instructions and install latest version of node.js (10.x.x)

    ```sh
    nvm install 10
    ```

  - git

    Install and setup `git`, refer [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

  - yarn

  Install yarn, refer [here](https://yarnpkg.com/en/docs/install)

- **Development**

  After installing node js a few extra dependencies maybe required system wide.

  - Watchman

    If `jest` complains regarding `watchman`, install it from [here](https://facebook.github.io/watchman/docs/install.html).

  - pushstate-server/ any static file server

    for checking the build on our local machine, a static file server is essential.

    prefer using [pushstate-server](https://github.com/scottcorgan/pushstate-server), which supports HTML5 pushstate.

- **Browser Extensions**
  Install necessary browser extensions for development. Below listed extensions are for chrome, find alternates if you are not using chrome.

  - [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

  - [Apollo Dev Tools](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm?hl=en)

### Installing

Clone the repository to your projects folder and change the directory to downloaded folder.

```sh
git clone git@github.com:zenportinc/web-app.git && cd web-app
```

and install all the dependencies.

```sh
yarn install
```

## Unit tests

run tests using [jest](https://github.com/facebook/jest).

```
 yarn test
```

### End to end tests

run e2e tests using [cypress](https://docs.cypress.io/guides/getting-started/installing-cypress.html#Adding-npm-scripts).

```
 yarn e2e
```

## Coding style

Follow [airbnb coding style](https://github.com/airbnb/javascript) and [clean code JS](https://github.com/ryanmcdermott/clean-code-javascript).

## Deployment

- **start**

  ```
  yarn start
  ```

  start the development server.

- **build:stg**

  ```
  yarn build:stg
  ```

  build the project using staging environment variables.

  **NOTE:** Final build is produced in the `build` folder.

- **build:prod**

  ```
  yarn build:prod
  ```

  build the project using production environment variables.

  **NOTE:** Final build is produced in the `build` folder.

  If you want to deploy with now.sh, please follow this [guide line](https://zeit.co/guides/deploying-react-with-now-cra).

- **storybook**

  ```
  yarn storybook
  ```

  starts [storybook](https://github.com/storybooks/storybook) development server for designing isolated components.

- **flow**

  ```
  yarn flow
  ```

  run [flow](https://flow.org/) to type check javascript.

- **lint**

  ```
  yarn lint
  ```

[eslint](https://github.com/eslint/eslint) to check all linting errors.

- **format**

  ```
  yarn format
  ```

  run [prettier](https://github.com/prettier/prettier) and [eslint](https://github.com/eslint/eslint) to format all javascript files.

- **analyze**

  ```
  yarn analyze
  ```

  generated a report of the built bundle displaying sizes of all the dependencies.

  **NOTE:** Run this command only after `build:stg` or `build:prod`

- **translate**
  We need to clear the babel cache and running build bundle for generate latest i18n message.

  ```
  yarn translate
  ```

  generate the ja.json language file base on en.json file.

  **Code quality**

  ```
  yarn check:quality
  ```

check for duplication on our codebase with [jscpd](https://github.com/kucherenko/jscpd)

- **build:storybook**

  ```
  yarn build:storybook
  ```

  builds deployment ready storybook.

- **build:styleguide**

  ```
  yarn build:styleguide
  cd styleguide
  now --public // deploy to now.sh
  ```

  builds deployment ready styleguide.

## Project Configuration

This section describes various build and development tools used in this project and also describes how they are organized.

### Tools

- [yarn](https://yarnpkg.com/en/)

  to manage npm dependencies.

- [eslint](https://eslint.org/)

  for enforcing rules for writing javascript.

- [prettier](https://github.com/prettier/prettier)

  for formatting code with specified rules with help of eslint.

- [flow](https://flow.org/)

  for type checking javascript.

- [babel](https://github.com/babel/babel)

  for transpiling javascript.

- [webpack](https://webpack.js.org/)

  for bundling javascript modules together with dependencies.

- [jest](https://facebook.github.io/jest/)

  for writing tests.

- [husky](https://github.com/typicode/husky)

  for adding git hooks.

- [lint-staged](https://github.com/okonet/lint-staged)

  for processing git staged files.

- [storybook](https://github.com/storybooks/storybook)

  for designing and developing components.

* [vscode](https://code.visualstudio.com/)

  vscode is the recommended ide/text editor, although no hard dependency is present in the project.

  Also a few extensions would aid in development.
  Listed below are extensions for vscode, if using other ide/editor it would be beneficial to search for similar extensions.

  Required extensions: `flow`, `eslint`, `prettier` and `editor config`.

  To install vscode extensions

  First setup shell command for `vscode` from [here](https://code.visualstudio.com/docs/editor/command-line)

  ```sh
  code --install-extension EditorConfig.EditorConfig &&
  code --install-extension Orta.vscode-jest &&
  code --install-extension dbaeumer.vscode-eslint &&
  code --install-extension esbenp.prettier-vscode &&
  code --install-extension flowtype.flow-for-vscode &&
  code --install-extension joelday.docthis &&
  code --install-extension ms-vscode.node-debug2 &&
  code --install-extension msjsdiag.debugger-for-chrome &&
  code --install-extension wix.vscode-import-cost
  ```

### Graphql

We generated graphql things from our server and output on `src/generated`

```
src/generated
├── fragmentTypes.json
├── schema.graphql
```

```sh
#1. Generate typings for apollo client
yarn gql-gen
#2. Download latest schema from our graphql server
npx graphql-cli get-schema
```

### Configuration

```
├── config                                // build tool related configs
│   ├── env.js                            // helper to load appropriate env variables
│   ├── jest                              // config folder for jest
│   │   ├── cssTransform.js               // css transformation for jest
│   │   ├── fileTransform.js              // file transformation for jest
│   │   └── setupTests.js                 // configuration for setting up jest
│   ├── paths.js                          // common paths used across the application
│   ├── webpack.config.js             // configuration for webpack
│   └── webpackDevServer.config.js        // configuration for webpack dev server
│
├── .babelrc                              // configuration for babel
│
├── .editorconfig                         // configuration for basic editor setup
│
├── .env                                  // default enviroment variable
├── .env.production                       // enviroment variable for staging build
├── .env.staging                          // enviroment variable for production build
│
├── .eslintignore                         // eslint ignored files config
├── .eslintrc.json                        // eslint rules config
│
├── .flowconfig                           // flowtype config
├── flow-typed                            // type definitions for dependency packages
│
├── .gitignore                            // git ignored files
│
├── .npmrc                                // keys for private registry
│
├── .prettierrc.json                      // config file for prettier
│
├── cypress                            // config for cypress(e2e)
├── .storybook                            // config for storybook
│   ├── config.js                         // basic config for storybook
│   ├── addons.js                         // addons config for storybook
│   └── webpack.config.js                 // webpack config for storybook
│
├── src                                   // main app, refer app documentation
│
├── scripts                               // folder to organise custom scripts
│   ├── build.js                          // script to build the project
│   ├── checkTranslation.js               // script to check missing locale on the project
│   ├── start.js                          // script to start development server
│   ├── migrate.js                        // script to migrate translation
│   ├── translate.js                      // script to build translation files from code
│   └── test.js                           // script for running tests using jest
│
├── package.json                          // managing depenecies, script and few configurations│
├── README.md                             // documentation of project
```

## App

This section describes folder organization and app architecture, used throughout the project.

### Folder Organization

```
src                                        // app code
├── components                             // stateless/ non redux connected components
│   │
│   ├── StateLess Global Component A       // stateless component folder
│   │   ├── __tests__                      // test folder for component
│   │   │   └── index.test.js              // snapshot test for component
│   │   ├── README.md                       // Styleguide document for component
│   │   ├── index.jsx                       // entry point for component
│   │   ├── index.stories.js                       // storybook for component
│   │   ├── style.js                       // styles for component
│   │   └── messages.js                    // translations if any for component
│   │
│   └── StateLess Global Component Group   // stateless component group folder
│       │
│       ├── StateLess Global Component B   // stateless component folder
│       │   ├── __tests__
│       │   ├── index.jsx
│       │   ├── style.js
│       │   └── messages.js
│       │
│       └── StateLess Global Component C  // stateless component folder
│           ├── __tests__
│           ├── index.jsx
│           ├── style.js
│           └── messages.js
│
├── constants                             // global constants
├── generated                             // FILE HAS BEEN AUTO-GENERATED
├── modules                               // statefull
│   │
│   ├── Module A
│   │   ├── __tests__                     // tests for component
│   │   │   ├── index.test.js             // snapshot test for component
│   │   │
│   │   ├── index.jsx                     // entry point for the component
│   │   ├── components                    // presentation components
│   │   ├── media                         // media folder containing assets if any (img, video, audio, etc)
│   │   ├── style.js                      // styles for the component
│   │   └── messages.js                   // translation if any
├── media                                // global assets folder containing images, audio, video, fonts, etc
│
├── i18n                           // setup for internationalization
│
├── index.js                             // entry point for the app
│
│
├── routes.js                            // file for route configuration
│
│
├── styles                               // folder for global and common styles
│
└── utils                                // helper and utilty functions
│
public                                   // folder for public files
├── favicon.ico                          // site favicon
└── index.html                           // templte html entry point
│
build                                    // auto generated build folder containing the built app
├── favicon.ico                          // optimised favicon
├── index.html                           // optimised built hhtml file
└── static                               // folder containing static resources
│   ├── css                              // folder containing optimised css file(s)
│   ├── js                               // folder containing optimised js file(s)
│   └── media                            // folder containing optimised media file(s)
```

## Built With

- [react](https://github.com/facebook/react/)

  for managing views.

- [apollo](https://www.apollographql.com/docs/react/)

  for querying graphql.

- [unstated](https://github.com/jamiebuilds/unstated)

  for state management.

- [immutability-helper](https://github.com/kolodny/immutability-helper)

  Immutable data structures for JavaScript which are backwards-compatible with normal JS Arrays and Objects.

* [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list)

  a tiny but mighty list virtualization library

- [react-values](https://github.com/ianstormtaylor/react-values)

  A set of tiny, composable React components for handling state with render props.

* [reach-router](https://github.com/reach/router)

  for managing routes.

- [scroll-into-view-if-needed](https://scroll-into-view-if-needed.netlify.com)
  Polyfill for upcoming Element.scrollIntoView() APIs like scrollMode: if-needed, behavior: smooth and block: center

* [emotion](https://github.com/emotion-js/emotion)

  for managing component based css via js.

* [react-hot-loader](https://github.com/gaearon/react-hot-loader)

  for hot loading app during development while preserving state.

* [ramda](https://github.com/ramda/ramda)

  functional js data structure utility library.

* [lodash](https://github.com/lodash/lodash)

  A modern JavaScript utility library delivering modularity, performance, & extras..

* [date-fns](https://github.com/date-fns/date-fns)

  modular date utility library.

* [randomcolor](https://github.com/davidmerfield/randomColor)

  for generating attractive colors.

- [react-debounce-input](https://github.com/nkbt/react-debounce-input)

  for input with debounced onChange.

- [react-intl](https://github.com/yahoo/react-intl)

  for managing internationalization.

- [react-fontawesome](https://github.com/FortAwesome/react-fontawesome)

  for importing fontawesome in react.

- [yup](https://github.com/jquense/yup)

  for JavaScript object schema validator and object parser.

- [emitter](https://github.com/facebook/emitter#readme)

  Facebook's EventEmitter is a simple emitter implementation that prioritizes speed and simplicity.

- [pluralize](https://github.com/blakeembrey/pluralize#readme)
  Pluralize and singularize any word

- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
  Beautiful, accessible drag and drop for lists with React.js

* [react-snap](https://github.com/stereobooster/react-snap)

  for static prerendering for SPAs

- [react-infinite-scroller](https://github.com/CassetteRocks/react-infinite-scroller)

  simple wrapper to infinitely fetch data on scroll

## Git Rules

**NOTE:** This convention base on [git flow](https://danielkummer.github.io/git-flow-cheatsheet/) with small customize.

_When doing a fix for bug that exists on master/production_

1. Create your branch from `hotfixes` branch
2. When make PR, set target branch as `hotfixes` branch
3. When make PR, set target branch as `develop` branch

_When doing new feature & new feature bug fixes_

1. Create your branch from `develop` branch
2. When make PR, set target branch as `develop` branch (this is default so you dont have to mind)

_When doing deploy of hotfixes_

1. Create PR to merge `hotfixes` into `master` branch

_When doing deploy of new features_

1. Create PR to merge `develop` into `master` branch
2. Create PR to merge `master` into `hotfixes` after the merge is complete in step 1

## Versioning

We use [SemVer](http://semver.org/) for versioning.

### Troubleshooting

Try to run `pkill flow` if you meet a memory issue with `flow` then restart VSCode.

If you want to fix the flow issue, you could try `yarn flow --show-all-branches` for detail explanation with flow error
