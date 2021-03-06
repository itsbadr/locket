import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpProcessingService } from '../services/http-processing.service';
import { serverURL } from '../util/serverURL';

import Text from '../util/type/text';


@Injectable({
  providedIn: 'root'
})
export class LocketService {

  constructor(private client: HttpClient, private httpProessingService: HttpProcessingService) {
  }


  encryptedTexts: Subject<Text> = new Subject<Text>()
  setDate: Subject<string> = new Subject<string>();

  public communicate(): Observable<Object> {
    return this.client.get<Object>(serverURL + 'communicate')
      .pipe(
        catchError(this.httpProessingService.handleError)
      );
  }

  public uploadFile(files: FormData, multiple: boolean): Observable<Object> {
    if (multiple)
      return this.client.post<FormData>(serverURL + 'uploadFiles', files)
        .pipe(
          catchError(this.httpProessingService.handleError)
        );

    return this.client.post<FormData>(serverURL + 'uploadFile', files)
      .pipe(
        catchError(this.httpProessingService.handleError)
      );
  }

  public getEncryptedTexts(): Observable<Text[]> {
    return this.client.get<Text[]>(serverURL + "text/get/all")
      .pipe(
        catchError(this.httpProessingService.handleError)
      );
  }

  public sendTextToEncrypt(text: object): Observable<Object> {
    return this.client.post<object>(serverURL + 'text/save', text)
      .pipe(
        catchError(this.httpProessingService.handleError)
      );
  }

  public deleteEncryption(id: string): Observable<Text> {
    return this.client.delete<Text>(serverURL + `text/delete/${id}`)
      .pipe(
        catchError(this.httpProessingService.handleError)
      )
  }

  public reflectChanges(changes: Text) {
    this.encryptedTexts.next(changes);
  }

  public setDateValue(value: string) {
    this.setDate.next(value);
  }


}
