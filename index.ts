import { constants } from './server/config';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import * as express from 'express';
import * as path from 'path';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as dbInitializer from './server/repositories/db-initializer';
import * as logService from './server/utils/log-service';
import * as registrationController from './server/controllers/registration-controller';

export let app = express();
const logger = logService.getLogger('[index] ');

const forceSsl = function (req: Request, res: Response, next: NextFunction) {
  if (!(req.headers['x-forwarded-proto'] === 'https' || req.headers['x-arr-ssl'])) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

// Public Files
if (constants.isDev) {
  logger.warn('Local development mode');
  enableStandardHelmetOptions();
} else {
  enableStandardHelmetOptions();
  app.use(helmet.hsts());
  app.use(forceSsl);
}

// Helmet options applicable for both local development and online mode
function enableStandardHelmetOptions() {
  app.use(helmet.frameguard());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.frameguard());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
}

app.use(compression());
app.use(cookieParser());

app.set('port', process.env.PORT || 5001);
app.use(bodyParser.json());
app.enable('trust proxy');


app.use('/fonts', express.static(path.join(__dirname, 'public/dist/fonts'), { maxAge: '15d' }));
app.use('/icons', express.static(path.join(__dirname, 'public/dist/icons'), { maxAge: '15d' }));
app.use('/images', express.static(path.join(__dirname, 'public/dist/images'), { maxAge: '15d' }));
app.use('/', express.static(path.join(__dirname, 'public/dist'), { maxAge: '0d' }));

// During development: return Allow-CORS headers
app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
  if (constants.isDev) {
    const originHeader = req.get('origin');
    if (originHeader) {
      const matches = originHeader.match(/^((http|https):\/\/localhost:([0-9]{4}))(.*)/);
      if (matches && matches.length > 1) {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', matches[1]);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-XSRF-TOKEN, X-AuthRetried, refreshtoken, authuserid');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS, DELETE, PATCH');
      }
    }
  }
  next();
});


// Helpers
function isPublicEndpoint(req: Request): boolean {
  return req.url === '/';
}

app.options('/*', (req, res) => {
  res.header('Allow', 'POST, GET, OPTIONS, PUT, DELETE');
  res.send('POST, GET, OPTIONS, PUT, DELETE');
});

app.get('/api/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

/**
 *  Registrations
 **/
// public
app.post('/api/register/:code', registrationController.registerCode);

// admin
app.get('/api/admin/registrations/:code', registrationController.getRegistrationByCode);
app.get('/api/admin/registrations', registrationController.getAllRegistrations);
app.post('/api/admin/registrations/generate', registrationController.generateCode);


function init() {
  app.listen(app.get('port'), () => {
    logger.info(`Brosklasse is running at port ${app.get('port')}!`);
  });
}

// Start database connection, then start express
dbInitializer.initConnection()
    .then(() => {
      init();
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    })
    .done();

process.on('SIGINT', () => {
  dbInitializer.closeDBConnections();
  process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)} reason: ${JSON.stringify(reason)}`);
});

