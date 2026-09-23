<p align="center">
  <a href="https://kixdev.io/"><img src="./logo.png" alt="KIX" width="160" /></a>
</p>

<h1 align="center">KIX</h1>

<p align="center">
  A small JSX library for building web interfaces, with no virtual DOM and no re-renders.
</p>

<p align="center">
  <a href="https://github.com/Generalsimus/KIX/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen?&style=flat-square" alt="license" /></a>
  <a href="https://www.npmjs.com/package/kix"><img src="https://img.shields.io/npm/v/kix?&style=flat-square" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/kix"><img src="https://img.shields.io/npm/dt/kix?&style=flat-square" alt="npm downloads" /></a>
</p>

<p align="center">
  <a href="https://kixdev.io/">Website</a> ·
  <a href="https://kixdev.io/docs/">Documentation</a>
</p>

---

## What is KIX?

KIX renders JSX straight to real DOM nodes. A component runs **once**. It is never called again.

Updates happen because a TypeScript transformer rewrites your code at build time. When you put a variable or an object property inside JSX, KIX watches it. If the value changes, KIX updates only the DOM node that uses it.

```jsx
import kix from "kix";

let count = 0;

setInterval(() => {
  count++; // this updates the <h1>. No setState, no hooks.
}, 1000);

kix(document.body, <h1>Count: {count}</h1>);
```

- **No re-renders.** Components run once and only the affected nodes change.
- **Plain variables are state.** You change a `let` or an object property, and the view follows.
- **Props update too.** Props update in place without calling the component again.
- **JavaScript and TypeScript** are both supported, with typings included.
- **Built-in routing** with `<route-link>`, `<route-switch>` and `<route-block>`.
- **Custom elements and attributes** with `createElement` and `createAttribute`.

## Quick start

You need [Node.js](https://nodejs.org/).

```bash
npm i -g kix        # install the CLI
kix new app-name    # create a project (pick JS/TS and Webpack/Vite)
cd app-name
kix start           # dev server with live reload
kix build           # production build
```

`kix new` asks you for:

- the project name
- a template: **JavaScript** or **TypeScript**
- a module builder: **Webpack** (recommended) or **Vite**

After that it installs the dependencies.

### CLI

| Command            | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `kix new [name]`   | Create a new KIX project.                             |
| `kix start`        | Start the dev server and rebuild when files change.   |
| `kix build`        | Build the app for production.                         |

Options: `--port <number>` sets the dev server port (Webpack uses `2206` by default). `--outDir <path>` sets the output folder (default `dist`).

Any other command is passed to the project's npm scripts. For example, `kix <script>` runs `npm run <script>`.

## Usage

### Mounting

```jsx
import kix from "kix";

kix(document.body, <div>Hello KIX</div>);
```

`kix(parent, jsx)` creates the DOM nodes, adds them to `parent` and returns them.

### Components

Components can be functions or classes. Both run only once.

```jsx
import kix from "kix";

function DateNow() {
  const date = new Date();
  return <span>Date: {date}</span>;
}

class DateNowClass {
  date = new Date();

  render() {
    return <h4>Date: {this.date}</h4>;
  }
}

kix(document.body, <>
  <DateNow />
  <DateNowClass />
</>);
```

### Props

Props are live. When the value passed in changes, the component's output updates.

```tsx
import kix, { Component } from "kix";

interface Props {
  index: number;
}

function ShowIndex(props: Props) {
  return <h1>INDEX: {props.index}</h1>;
}

// In class components, props are on `this`
class ShowIndexClass extends Component<{ index: number }> {
  render() {
    return <h1>INDEX: {this.index}</h1>;
  }
}

let increment = 0;
setInterval(() => increment++, 1000);

kix(document.body, <ShowIndex index={increment} />);
```

### Events

An event handler gets two arguments: the event and the element it is attached to.

```jsx
import kix from "kix";

let value = "value";

kix(document.body, <>
  <h3>{value}</h3>
  <input
    type="text"
    value={value}
    onInput={(event, element) => {
      value = element.value;
    }}
  />
</>);
```

### Routing

```jsx
import kix from "kix";

function App() {
  return <>
    <route-link href="/">Home</route-link>
    <route-link href="/page/2">Page 2</route-link>

    <route-block ifEmptyComponent={<div>Not found</div>}>
      <route-switch path="/" unique={true} component={<h1>Home</h1>} />
      <route-switch path="/page/2" component={<h1>Page 2</h1>} />
    </route-block>
  </>;
}

kix(document.body, <App />);
```

- `<route-link>` works like an `<a>` tag, but it navigates without reloading the page. Set `routeScroll` (default `true`) to control scrolling after navigation.
- `<route-switch>` renders `component` when the URL matches `path`. With `unique`, the path must match exactly.
- `<route-block>` renders `ifEmptyComponent` when none of the `<route-switch>` elements inside it match.

#### Route parameters

```jsx
import kix, { Router } from "kix";

function User() {
  const path = "/user/:name";
  const params = Router.getPathParams(path); // live, updates on navigation
  // Router.getGlobalParams() gives the params of the route that matches now

  return <>
    <route-link href="/user/Naomi">Naomi</route-link>
    <route-link href="/user/Perry">Perry</route-link>
    <route-switch path={path} component={<h1>User: {params.name}</h1>} />
  </>;
}
```

#### Navigating from code

KIX uses the browser's [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) and listens to `popstate`. To navigate from code, use `Router.history` and then dispatch `popstate`:

```jsx
import { Router } from "kix";

const go = (event, element) => {
  event.preventDefault();
  Router.history.pushState(undefined, "", element.getAttribute("href")); // or replaceState
  window.dispatchEvent(new CustomEvent("popstate"));
};

<a href="/page/1" onClick={go}>Page 1</a>;
```

`Router.history.back()` and `Router.history.forward()` work as usual. To react to route changes, listen for `popstate` on `window`.

### `useListener`

This hook watches one property of an object. It works on props too.

```jsx
import kix, { useListener } from "kix";

function Counter() {
  const state = { increment: 0 };

  const listener = useListener(state, "increment", (value, propertyName, object) => {
    console.log("changed to", value);
  });

  return <>
    <button onClick={() => state.increment++}>Click</button>
    <button onClick={() => listener.close()}>Pause</button>
    <button onClick={() => listener.open()}>Resume</button>
    <h2>Clicks: {state.increment}</h2>
  </>;
}
```

The returned listener has these methods: `open()`, `close()`, `isOpen()`, `init()`, `getValue()`, `addCallback(fn)` and `addChildListener(fn)`.

### `useObjectListener`

This hook watches every property of an object. You can also pass a list of keys to watch only those.

```jsx
import kix, { useObjectListener } from "kix";

const Component = (props) => {
  let changes = 0;
  useObjectListener(props, (object, propertyName, value) => {
    changes++;
  });
  return <h1>{changes}</h1>;
};
```

### `createElement`

This function defines a global custom tag. The tag's attributes are live, like the attributes of any other element.

```jsx
import kix, { createElement } from "kix";

createElement("counter-view", (state, tagName) => {
  // state[tagName] is the children, other keys are the attributes
  return <h1>INDEX: {state.index}</h1>;
});

let index = 0;
setInterval(() => index++, 1000);

kix(document.body, <counter-view index={index} />);
```

### `createAttribute`

This function defines a global custom attribute. Its handler runs every time the value changes.

```jsx
import kix, { createAttribute } from "kix";

createAttribute("isError", (element, attributeName, value, setAttribute) => {
  element.style.color = value ? "red" : "blue";
});

// With `true` as the third argument, the value returned by the handler
// is set on the element as the attribute
createAttribute("style", (element, attributeName, value) => value, true);

let error = false;
setInterval(() => (error = !error), 1000);

kix(document.body, <h3 isError={error}>Element</h3>);
```

## Setting up KIX by hand

`kix new` sets this up for you. To add KIX to an existing project, pass the KIX TypeScript transformers to your TS loader, and set `"jsx": "preserve"` in `tsconfig.json`.

**Webpack** (with [`webpack-ts-load`](https://www.npmjs.com/package/webpack-ts-load)):

```js
const { getTransformers } = require("kix/transformers");

module.exports = {
  module: {
    rules: [{
      test: /\.(t|j)sx?$/,
      exclude: /node_modules/,
      use: [{ loader: "webpack-ts-load", options: { transformers: getTransformers() } }],
    }],
  },
};
```

**Vite** (with [`vite-typescript-plugin`](https://www.npmjs.com/package/vite-typescript-plugin)):

```js
import { defineConfig } from "vite";
import { getTransformers } from "kix/transformers";
import { createTsPlugin } from "vite-typescript-plugin";

export default defineConfig({
  plugins: [
    createTsPlugin({
      name: "kix",
      test: /\.(t|j)sx?$/,
      transformers: getTransformers(),
    }),
  ],
});
```

## Development

```bash
git clone https://github.com/Generalsimus/KIX.git
cd KIX
npm install
npm run dev     # tsc --watch
npm start       # run the CLI from dist/
```

The project is organized like this:

- `command/`: CLI argument parsing and commands
- `templates/`: project scaffolding for Webpack and Vite
- `transformers/`: the TypeScript transformers that make JSX reactive
- `web/`: the browser runtime (`kix`, `Router`, `useListener`, …) and its typings

## Author

KIX is created and maintained by [Soso Tsertsvadze](mailto:sosotsertsvadze2@gmail.com).

## License

[MIT](./LICENSE)
