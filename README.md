# @abcnews/aunty-pl

Tools to extend [@abcnews/aunty](https://github.com/abcnews/aunty) for Presentation Layer

## Prerequisites

1. Install this package into your `react` **aunty** project as a development dependency

```sh
npm install -D @abcnews/aunty-pl
```

2. Create (or update) your `aunty.config.js` file so that it contains at a minimum:

```js
module.exports = {
  type: 'react',
  webpack: config => {
    return config;
  }
};
```

If you had to create the file above, remember to delete the now-redundant `aunty` property from your `package.json` file.

## Usage

To enable aunty to build projects that depend on `@abcaustralia/*` component libraries, import the `applyWebpackRules` utility from this package into your `aunty.config.js`, and call it with your Webpack config object:

```js
const { applyWebpackRules } = require('@abcnews/aunty-pl');

module.exports = {
  type: 'react',
  webpack: config => {
    applyWebpackRules(config);

    return config;
  }
};
```

The effects of applying this update are:

- The existing Webpack rule that handles `.css` / `.scss` files excludes the `@abcaustralia` package namespace.
- A new rule is added specifically for handling `.css` files under the `@abcaustralia` package namespace, which applies, in order:
  1. their `postcss-loader`
  2. our `css-loader` with their options (they use CSS modules)
  3. our last loader, which will either be `MiniCssExtractPlugin`'s loader or `style-loader` (default), depending on whether our project is configured to extract CSS into separate assets or not.
