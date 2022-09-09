import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { prediction } from 'src/app/class/prediction.interface';
import { CrudService } from '../../core/service/crud.service';

@Injectable({
  providedIn: 'root'
})
export class PredictionService extends CrudService<prediction, number>{

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
  ) {
    super(http, `${baseUrl}prediction`);
   }
}
