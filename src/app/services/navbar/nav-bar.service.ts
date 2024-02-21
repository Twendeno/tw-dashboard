import {inject, Injectable, signal} from '@angular/core';
import {Location} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  items: MenuItem[]  = [];
  home: MenuItem = [];

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.items = [];
        val.urlAfterRedirects.split('/').forEach((value, index) => {

          let menuItem:MenuItem = {label: value,routerLink: val.urlAfterRedirects.split('/').slice(0, index + 1).join('/')};

          if (value != ''&& value != 'dashboard' && value != 'home') {
            if (index ==val.urlAfterRedirects.split('/').length - 1) {
              menuItem.routerLink = ''
            }
            this.items.push(menuItem)
          }

        });
      }
    });
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard/home' };
  }

  back() {
    this.location.back();
  }
}
