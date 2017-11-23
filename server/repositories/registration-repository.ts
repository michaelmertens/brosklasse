import * as mongoose from 'mongoose';
import * as Q from 'q';
import { registrationSchema, IRegistration } from './db-models';
import { resolveQuery } from './db-functions';
import * as logService from '../utils/log-service';
const logger = logService.getLogger('[registration-repository]');

let registrationsModel;

export function initializeSchema() {
  registrationsModel = mongoose.model('Registration', registrationSchema);
}

/**
 * Read
 */
export function getAllRegistrations(): Q.IPromise<IRegistration[]> {
  return Q.Promise((resolve, reject) => {
    registrationsModel.find({})
        .sort({ createdAt: -1 })
        .lean()
        .exec(resolveQuery(resolve, reject));
  });
}

export function getRegistrationById(id: string) {
  return Q.Promise(function (resolve, reject) {
    registrationsModel.findById(id, {"__v":0})
        .exec(resolveQuery(resolve, reject));
  });
}

export function getRegistrationByCreator(user: string) {
  return Q.Promise(function (resolve, reject) {
    registrationsModel.find({ createdBy: user })
        .lean()
        .exec(resolveQuery(resolve, reject));
  });
}

export function getRegistrationByCode(code: string): Q.IPromise<IRegistration> {
  return Q.Promise((resolve, reject) =>  {
    registrationsModel.findOne({ code }, {"__v":0})
        .exec(resolveQuery(resolve, reject));
  });
}

/**
 * Write
 */
export function createRegistrationRecord(code: string, createdBy: string, emailReservation?: string): Q.IPromise<IRegistration> {
  const registration = new registrationsModel({
    code,
    createdBy,
    reservedFor: emailReservation
  });
  save(registration);

  return registration;
}

export function save(registration: IRegistration): Q.IPromise<IRegistration> {
  return Q.ninvoke<IRegistration>(registration, 'save')
      .then((mongoResponse) => {
        return mongoResponse[0];
      })
      .catch((err) => {
        logger.error(`Error saving a registration record: ${err}`);
        throw err;
      });
}