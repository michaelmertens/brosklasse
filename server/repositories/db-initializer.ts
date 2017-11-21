const mongoose = require('mongoose');
import { constants } from '../config';
import * as Q from 'q';
import * as registrationRepository from './registration-repository';
import * as logService from '../utils/log-service';
const logger = logService.getLogger('[db-initializer]');

let db;

export function initConnection() {
  const deferred = Q.defer();

  mongoose.Promise = require('q').Promise;
  mongoose.connect(constants.DB_URI);
  db = mongoose.connection;
  db.on('error', (err) => {
    logger.error('database error: ' + err);
    deferred.reject(err);
  });
  db.once('open', () => {
    logger.info('initializing schemas ...');
    registrationRepository.initializeSchema();
    deferred.resolve();
  });
  return deferred.promise;
}

export function closeDBConnections() {
  logger.info('Closing DB Connections');
  db.close();
}
