import {Component, OnInit} from '@angular/core';
import { I18n }            from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-home',
  template: `<h3>{{ message }}</h3>`
})
export class HomeComponent implements OnInit {
  public message: string;

  constructor(private i18n: I18n) {}

  ngOnInit() {
    this.message = this.i18n('Hello');
  }
}
