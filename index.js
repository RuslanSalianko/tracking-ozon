import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import Handlebars from 'handlebars';
import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import csurf from 'csurf';
import mongoose from 'mongoose';
import ConnectMongoDBSession from 'connect-mongodb-session';
import varMiddleware from './middleware/variables.js';
import userMiddleware from './middleware/user.js';

import { homeRouter, authRouter, settingsRouter } from './routes/index.js';

import keys from './keys/index.js';

const MongoDBStore = ConnectMongoDBSession(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const store = new MongoDBStore({
  uri: keys.MONGODB_URI,
  collection: 'session',
});

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));

app.use(csurf());
app.use(flash());

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/settings', settingsRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    throw new Error('Error POST login: ', error);
  }
}

start();
