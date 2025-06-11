/**
 * Service for formatting Date objects into various string formats.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  /**
   * Returns a formatted string representation of a date.
   * @param date - The Date object to format.
   * @param format - The format type ('dd-mm-yyyy', 'hh-mm', 'last-thread').
   * @returns The formatted date string.
   */
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
