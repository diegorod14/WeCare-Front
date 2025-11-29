import { Component, computed, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavBarComponent } from './componente/nav-bar-component/nav-bar-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FrontendMonolith');
  private readonly hiddenRoutes = ['/info', '/objetivos'];
  private readonly currentUrl = signal('');
  protected readonly shouldShowNavBar = computed(() =>
    this.hiddenRoutes.every(route => !this.currentUrl().startsWith(route))
  );

  constructor(private readonly router: Router) {
    this.currentUrl.set(router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }
}
