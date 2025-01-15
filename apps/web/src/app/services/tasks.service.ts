import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type Task = {

}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private _http: HttpClient) {}

  delete(id: string) {
    return this._http.delete(`${this._baseUrl}/${id}`);
  }
}
