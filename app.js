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
  return Prismic.client(process.env.PRISMIC_ENDPOINT, {
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

app.get('/', async (req, res) => {
  const api = await initApi(req);

  const meta = await api.getSingle('meta');
  const home = await api.getSingle('home');

  res.render('pages/home', {
    meta,
    home,
  });
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);

  const meta = await api.getSingle('meta');
  const about = await api.getSingle('about');

  res.render('pages/about', {
    meta,
    about,
  });
});

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req);

  const meta = await api.getSingle('meta');
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });

  res.render('pages/detail', {
    meta,
    product,
  });
});

app.get('/collections', async (req, res) => {
  const api = await initApi(req);

  const meta = await api.getSingle('meta');
  const { results: collections } = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    { fetchLinks: 'product.image' }
  );

  res.render('pages/collections', {
    meta,
    collections,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
