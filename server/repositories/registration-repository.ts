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

export function getRegistrationByCode(code: string): IRegistration {
  return Q.Promise((resolve, reject) =>  {
    registrationsModel.findOne({ code })
        .lean()
        .exec(resolveQuery(resolve, reject));
  });
}

// export function updateRegistrationByCode(code: IRegistration): IRegistration {
//   return Q.Promise((resolve, reject) =>  {
//     registrationsModel.findOne({ code })
//         .lean()
//         .exec(resolveQuery(resolve, reject));
//   });
// }
