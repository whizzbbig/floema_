/* eslint-disable no-unused-vars */
require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const port = 8004;
const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

// Link Resolver
const HandleLinkResolver = (doc) => {
  // Define the url depending on the document type
  //   if (doc.type === 'page') {
  //     return '/page/' + doc.uid;
  //   } else if (doc.type === 'blog_post') {
  //     return '/blog/' + doc.uid;
  //   }

  // Default to homepage
  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: HandleLinkResolver,
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/about', (req, res) => {
  initApi(req).then((api) => {
    api
      .query(Prismic.Predicates.any('document.type', ['meta', 'about']))
      .then((response) => {
        const { results } = response;
        const [about, meta] = results;
        console.log(about, meta);
        res.render('pages/about', {
          meta,
          about,
        });
      });
  });
});

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail');
});

app.get('/collection', (req, res) => {
  res.render('pages/collection');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
