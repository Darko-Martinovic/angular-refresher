import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  features: readonly string[];
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config', {
  providedIn: 'root',
  factory: () => ({
    baseUrl: 'https://api.example.com',
    timeoutMs: 5000,
    features: ['orders', 'invoices', 'reports'] as const,
  }),
});

@Component({
  selector: 'app-injection-tokens-demo',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      The token below is provided via <code>InjectionToken</code> + factory. Any class
      can inject it as a typed configuration object.
    </p>

    <div class="card">
      <header>
        <mat-icon fontSet="material-symbols-outlined">key</mat-icon>
        <code>inject(API_CONFIG)</code>
      </header>
      <dl>
        <dt>baseUrl</dt>
        <dd>{{ config.baseUrl }}</dd>
        <dt>timeoutMs</dt>
        <dd>{{ config.timeoutMs }}</dd>
        <dt>features</dt>
        <dd>
          @for (f of config.features; track f) {
            <span class="chip">{{ f }}</span>
          }
        </dd>
      </dl>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .hint code { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
    .card { background: var(--surface-2); border: 1px solid var(--surface-border);
            border-radius: 10px; overflow: hidden; }
    header { display: flex; align-items: center; gap: 0.5rem;
             padding: 0.55rem 0.85rem; background: var(--surface-3);
             border-bottom: 1px solid var(--surface-border);
             color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
    header code { color: var(--accent-strong); }
    dl { display: grid; grid-template-columns: 130px 1fr; gap: 0.45rem 1rem;
         margin: 0; padding: 0.85rem 1rem; }
    dt { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; }
    dd { margin: 0; color: var(--text-primary); display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .chip { background: color-mix(in srgb, var(--accent) 14%, transparent);
            color: var(--accent-strong); padding: 0.1rem 0.55rem;
            border-radius: 999px; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }
  `],
})
export class InjectionTokensDemo {
  protected readonly config = inject(API_CONFIG);
}
