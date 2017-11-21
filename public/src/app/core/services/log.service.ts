import { Injectable } from '@angular/core';
import { IErrorResponse } from '../../../api-contracts/common';
declare const console: any;

interface ILogAdditionalInfo {
  title?: string;
  httpStatus?: string;
  originalError?: IErrorResponse;
  meta?: {
    [key: string]: any;
  };
}

@Injectable()
export class LogService {

  private centralizedLogging: any;

  constructor() { }

  public assert(...args: any[]): void {
    if (console && console.assert) { console.assert(...args); }
  }

  public group(...args: any[]): void {
    if (console && console.group) { console.group(...args); }
  }

  public groupEnd(...args: any[]): void {
    if (console && console.groupEnd) { console.groupEnd(...args); }
  }

  public info(...args: any[]): void {
    if (console && console.info) { console.info(...args); }
  }

  public log(...args: any[]): void {
    if (console && console.log) { console.log(...args); }
  }

  public warn(message: string, additionalInfo: ILogAdditionalInfo): void {
    if (console && console.warn) { console.warn([message, additionalInfo]); }

    if (this.centralizedLogging) {
      this.centralizedLogging.warn(this.formatTitle(message, additionalInfo), additionalInfo);
    }
  }

  public error(message: string, additionalInfo: ILogAdditionalInfo): void {
    if (console && console.error) { console.error([message, additionalInfo]); }

    if (this.centralizedLogging) {
      this.centralizedLogging.error(this.formatTitle(message, additionalInfo), additionalInfo);
    }
  }

  private formatTitle(message: string, additionalInfo?: ILogAdditionalInfo) {
    // Prefer custom titles to group similar errors
    let title = message;
    if (additionalInfo && additionalInfo.title) {
      title = additionalInfo.title;
      delete additionalInfo.title;
    }

    // Check for httpResponse object. If present, add status to title
    if (additionalInfo) {
      if (additionalInfo.httpStatus !== undefined) {
        title += ` [HTTP ${additionalInfo.httpStatus}]`;
      }
      if (additionalInfo.originalError && additionalInfo.originalError.error) {
        title += ` [${additionalInfo.originalError.error.key}]`;
      }
    }

    return title;
  }
}
