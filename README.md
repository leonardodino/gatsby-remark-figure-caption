# gatsby-remark-figure-caption

[![Package Version](https://img.shields.io/npm/v/gatsby-remark-figure-caption.svg)](https://www.npmjs.com/package/gatsby-remark-figure-caption)
[![Build Status](https://travis-ci.com/leonardodino/gatsby-remark-figure-caption.svg?branch=master)](https://travis-ci.com/leonardodino/gatsby-remark-figure-caption)
[![Code Coverage](https://codecov.io/gh/leonardodino/gatsby-remark-figure-caption/branch/master/graph/badge.svg)](https://codecov.io/gh/leonardodino/gatsby-remark-figure-caption)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/leonardodino/gatsby-remark-figure-caption/blob/master/LICENSE)

transforms: `![image with description](path-to-image.jpg)` into:
```html
<figure>
  <img src="path-to-image.jpg">
  <figcaption>image with description</figcaption>
</figure>
```

<!-- [TODO]: motivation -->


## Install

`npm install --save gatsby-remark-figure-caption`


## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-figure-caption`,
          options: {figureClassName: 'md-figure'},
        },
      ],
    },
  },
]
```


## Options

| Name | Default | Description |
| ---- | ------- | ----------- |
| `figureClassName` | `''` | class for the wrapper `figure` element |
| `imageClassName` | `''` | class for the wrapped `img` element |
| `captionClassName` | `''` | class for the wrapped `figcaption` element |


## Disclaimers

**only tested with `gatsby v2`**, it may work on `v1`.

**not really a _good_ thing `a11y`-wise:**
- images should have a descriptive `alt`, that can replace it.
- created for working around cripled `markdown` tools.
- [there are better ways to describe an image.](https://github.github.com/gfm/#image-description)

**`PRs` welcome.**
