import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lazy-loading-demo',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <mat-icon fontSet="material-symbols-outlined">check_circle</mat-icon>
      <div>
        <strong>You're looking at lazy-loaded code right now.</strong>
        <p>
          The feature-page route uses
          <code>loadComponent: () => import('./shared/feature-page/feature-page').then(m => m.FeaturePage)</code>,
          and the demo you see here is loaded via a dynamic <code>import()</code> from
          <code>demo-loaders.ts</code>. Open DevTools → Network and switch features to watch the
          chunks load on demand.
        </p>
      </div>
    </div>

    <p class="hint">
      Inspect <code>src/app/app.routes.ts</code> for the route lazy boundaries and
      <code>src/app/core/features/demo-loaders.ts</code> for the per-demo dynamic imports.
    </p>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 0.85rem; }
    .card { display: flex; gap: 0.85rem; padding: 0.85rem 1rem;
            background: color-mix(in srgb, var(--success) 12%, transparent);
            border: 1px solid color-mix(in srgb, var(--success) 30%, transparent);
            border-radius: 10px; color: var(--text-primary); }
    .card mat-icon { color: var(--success); font-size: 1.6rem; width: 1.6rem; height: 1.6rem; flex-shrink: 0; }
    strong { display: block; margin-bottom: 0.25rem; }
    p { margin: 0; color: var(--text-secondary); line-height: 1.55; }
    .hint { margin: 0; color: var(--text-muted); line-height: 1.5; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--accent-strong);
           background: var(--surface-2); padding: 0.1rem 0.35rem; border-radius: 4px; }
  `],
})
export class LazyLoadingDemo {}
