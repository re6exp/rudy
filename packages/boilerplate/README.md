<a href="https://codesandbox.io/s/github/faceyspacey/redux-first-router-codesandbox" target="_blank">
  <img alt="Edit Redux-First Router Demo" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

# Simple Universal Boilerplate of [Rudy Router](https://github.com/respond-framework/rudy)

![redux-first-router-demo screenshot](./screenshot.png)


## Installation

```
git clone https://github.com/respond-framework/rudy.git
cd packages/boilerplate
yarn
yarn build:monorepo
yarn start
```

## Files You Should Look At:

_client code:_

- [**_src/configureStore.js_**](./src/configureStore.js)
- [**_src/routesMap.js_**](./src/routesMap.js) - **_(Rudy's application controller)_**
- [**_src/components/Switcher.js_**](./src/components/Switcher.js) - _(universal
  component concept)_
- [**_src/components/Sidebar.js_**](./src/components/Sidebar.js) - _(look at the
  different ways to link + dispatch URL-aware actions)_

_server code:_

- [**_server/index.js_**](./server/index.js)
- [**_server/render.js_**](./server/render.js) - \*(super simple thanks to
  [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks)
  from our **_"Universal"_** product line)\*
- [**_server/configureStore.js_**](./server/configureStore.js) - **_(observe how
  the matched route's thunk is awaited on)_**
