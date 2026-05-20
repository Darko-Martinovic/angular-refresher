import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { FeatureService } from './core/features/feature.service';

const THEME_KEY = 'angular-refresher-theme';
type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private features = inject(FeatureService);
  private router = inject(Router);
  private breakpoint = inject(BreakpointObserver);
  private document = inject(DOCUMENT);

  protected readonly grouped = this.features.grouped;

  protected readonly isHandset = toSignal(
    this.breakpoint.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(map((s) => s.matches)),
    { initialValue: false },
  );

  protected readonly sidenavMode = computed(() => (this.isHandset() ? 'over' : 'side'));
  protected readonly sidenavOpened = signal(true);

  protected readonly theme = signal<Theme>(this.loadTheme());

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly currentSlug = computed(() => {
    const url = this.currentUrl();
    const match = url.match(/^\/feature\/([^/?#]+)/);
    return match?.[1] ?? null;
  });

  constructor() {
    effect(() => {
      if (this.isHandset()) {
        this.sidenavOpened.set(false);
      } else {
        this.sidenavOpened.set(true);
      }
    });

    effect(() => {
      const t = this.theme();
      this.document.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem(THEME_KEY, t);
      } catch {
        /* ignore */
      }
    });
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  toggleSidenav(): void {
    this.sidenavOpened.update((v) => !v);
  }

  onNavClick(): void {
    if (this.isHandset()) {
      this.sidenavOpened.set(false);
    }
  }

  private loadTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      /* ignore */
    }
    const prefersDark = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
