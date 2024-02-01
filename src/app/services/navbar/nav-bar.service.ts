import {inject, Injectable, signal} from '@angular/core';
import {Location} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  history = signal<string>("");

  constructor() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.history.set(val.urlAfterRedirects);
      }
    });
  }

  back() {
    this.location.back();
  }
}
