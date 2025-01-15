import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type Task = {
  title: string;
  description: string;
  dueAt: string;
  productId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private _baseUrl = `${environment.apiUrl}/tasks`;

  constructor(private _http: HttpClient) {}

  create(task: Task) {
    return this._http.post(`${this._baseUrl}`, task);
  }

  delete(id: string) {
    return this._http.delete(`${this._baseUrl}/${id}`);
  }
}
