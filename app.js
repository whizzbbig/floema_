/* eslint-disable no-unused-vars */
require('dotenv').config();

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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};

// Link Resolver
const HandleLinkResolver = (doc) => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === 'collections') {
    return '/collections';
  }

  if (doc.type === 'about') {
    return `/about`;
  }

  // Default to homepage
  return '/';
};

// Middleware to inject prismic context
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent']);

  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === 'mobile';
  res.locals.isTablet = ua.device.type === 'tablet';

  res.locals.Link = HandleLinkResolver;
  res.locals.PrismicH = PrismicH;
  res.locals.Numbers = (index) => {
    return index === 0
      ? 'One'
      : index === 1
      ? 'Two'
      : index === 2
      ? 'Three'
      : index === 3
      ? 'Four'
      : '';
  };

  next();
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

const handleRequest = async (api) => {
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

  //   console.log(about, home, collections);

  const assets = [];

  home.data.gallery.forEach((item) => {
    assets.push(item.image.url);
  });

  about.data.gallery.forEach((item) => {
    assets.push(item.image.url);
  });

  about.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => {
        assets.push(item.image.url);
      });
    }
  });

  collections.forEach((collection) => {
    collection.data.list.forEach((item) => {
      assets.push(item.product.data.image.url);
    });
  });

  console.log(assets);

  return {
    assets,
    meta,
    home,
    collections,
    about,
    navigation,
    preloader,
  };
};

app.get('/', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  res.render('pages/home', {
    ...defaults,
  });
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  res.render('pages/about', {
    ...defaults,
  });
});

app.get('/collections', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  res.render('pages/collections', {
    ...defaults,
  });
});

// app.get('/detail/:uid', async (req, res) => {
//   const api = await initApi(req);
//   const defaults = await handleRequest(api);

//   const product = await api.getByUID('product', req.params.uid, {
//     fetchLinks: 'collection.title',
//   });

//   if (product) {
//     res.render('pages/detail', {
//       product,
//       ...defaults,
//     });
//   } else {
//     res.status(404).send('Page not found');
//   }
// });

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });

  res.render('pages/detail', {
    ...defaults,
    product,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// "start": "concurrently --kill-others \"npm run backend:development\" \"npm run frontend:development\""
