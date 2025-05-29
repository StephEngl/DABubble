import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

    getDate(date: Date, format: 'dd-mm-yyyy' | 'hh-mm' | 'last-thread'):string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if(format === 'dd-mm-yyyy') {
      return `${day}.${month}.${year}`;
    } else if(format === 'hh-mm') {
      return `${hours}:${minutes}`;
    } else {
      return `${day}.${month}.${year} | ${hours}:${minutes}`;
    }
  }

}
