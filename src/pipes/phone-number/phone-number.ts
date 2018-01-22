import {Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone-number',
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string, ...args) {
    return '(' + value.substr(0, 3) + ') ' + value.substr(3, 3) + '-' + value.substr(6, 4);
  }
}
