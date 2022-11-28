# Hosted and Deployed on Heroku and Vercel

- [Floema on Heroku](https://floema-ice.herokuapp.com)
- [Floema on Vercel](https://floema-ice.vercel.app)


# webpack-boilerplate
A boilerplate which inspired from luis henrique bizzaro course on awwwards but intent to use up-to-date technologies.


It has commits according to the lecture of the course 

# Setup

`npm install`
to install all the dependencies

add `.env` file to the folder

`npm start`
to run development in your localhost

# Migration Guide from @prismicio/client v5 to v6 

## Step - 1

- Remove `prismic-dom` module from file by doing `npm uninstall prismic-dom`
- Update `@prismicio/client` module 
- add `@prismicio/helpers` and `node-fetch` by doing `npm i @prismicio/helpers node-fetch@2.6.7` // don't install the latest v of node-fetch it isn't compatible
to cjs env.

## Step - 2
- add PrismicH to the `app.js`
```js
const PrismicH = require('@prismicio/helpers');
```
- replace the declaration of **PrismicDOM** from **PrismicH** from everywhere
- add node-fetch to the `app.js`
```js
const fetch = require('node-fetch');
```
things should look like this

```js
const fetch = require('node-fetch');
const logger = require('morgan');
const path = require('path');
const express = require('express');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = process.env.PORT || 8004;

const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');
const { application } = require('express');
const UAParser = require('ua-parser-js');
```

## Step - 3
refactor the prismic init
```js
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};
```

## Step - 4
now we have to fetch all the pages at once to resolve the issue of pages are not loading on time
replace this 👇 from your `app.js/handleRequest function`
```js
  const meta = await api.getSingle('meta');
  const preloader = await api.getSingle('preloader');
  const navigation = await api.getSingle('navigation');
  const home = await api.getSingle('home');
  const about = await api.getSingle('about');
  const { results: collections } = await api.query( Prismic.Predicates.at('document.type', 'collection'), { fetchLinks: 'product.image' } ); // prettier-ignore
```
to this 👇
```js
  const [meta, preloader, navigation, home, about, { results: collections }] =
    await Promise.all([
      api.getSingle('meta'),
      api.getSingle('preloader'),
      api.getSingle('navigation'),
      api.getSingle('home'),
      api.getSingle('about'),
      api.query(Prismic.Predicates.at('document.type', 'collection'), {
        fetchLinks: 'product.image',
      }),
    ]);
```
after this all pages are gonna load on time except `/about` route coz you forgot to refactor `PrismicDOM` to `PrismicH` 😆 les do that also...

## Step - 5
replace this 👇 
`.about__content__description!=PrismicDOM.RichText.asHtml(section.primary.description).replace(/<p>/g, '<p data-animation="paragraph">')`

to this 👇
```js
.about__content__description!=PrismicDOM.asHTML(section.primary.description).replace(/<p>/g, '<p data-animation="paragraph">')
```

now we updated our repo to Prismic v6 :)



