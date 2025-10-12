import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  someMethod() {
    console.log('Hello from StateService');
  }
}
