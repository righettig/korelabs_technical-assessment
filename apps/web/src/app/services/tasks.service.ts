import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

export type Task = {
  id?: string;
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
    return this._http
      .post(`${this._baseUrl}`, task)
      .pipe(map((el: any) => {
        return {
          id: el.id,
          title: el.title,
          description: el.description,
          dueAt: el.dueAt,
          productId: el.product.id,
        }
      }));
  }

  update(task: Task) {
    return this._http.patch(`${this._baseUrl}/${task.id}`, task);
  }

  delete(id: string) {
    return this._http.delete(`${this._baseUrl}/${id}`);
  }
}
