import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface HttpHop {
  layer: 'request' | 'auth-interceptor' | 'logging-interceptor' | 'http' | 'response';
  label: string;
  detail: string;
}

@Component({
  selector: 'app-http-interceptor-demo',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Functional interceptors form a pipeline around <code>HttpClient</code>. Each interceptor
      transforms the request, calls <code>next(req)</code>, then can transform the response.
      The diagram below simulates a request flowing through two interceptors.
    </p>

    <div class="row">
      <button mat-raised-button color="primary" (click)="trigger()">
        <mat-icon fontSet="material-symbols-outlined">cloud_upload</mat-icon>
        Send request
      </button>
      <button mat-stroked-button (click)="hops.set([])">Clear</button>
    </div>

    <ol class="hops">
      @for (hop of hops(); track $index) {
        <li [attr.data-layer]="hop.layer">
          <span class="badge">{{ hop.layer }}</span>
          <strong>{{ hop.label }}</strong>
          <small>{{ hop.detail }}</small>
        </li>
      } @empty {
        <li class="empty">Click "Send request" to trace a request.</li>
      }
    </ol>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .hint code { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
    .row { display: flex; gap: 0.6rem; }
    .hops { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
    .hops li { display: grid; grid-template-columns: 110px 1fr; gap: 0.4rem 0.85rem;
               padding: 0.6rem 0.85rem; background: var(--surface-2);
               border: 1px solid var(--surface-border); border-radius: 10px;
               animation: slideIn 0.25s ease; }
    .hops li small { grid-column: 2; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;
                      font-size: 0.78rem; }
    .hops li.empty { color: var(--text-muted); font-style: italic;
                     display: block; text-align: center; }
    .badge { padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.7rem;
             font-family: 'JetBrains Mono', monospace; text-transform: uppercase;
             letter-spacing: 0.05em; align-self: center; text-align: center; }
    li[data-layer='request']             .badge { background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent-strong); }
    li[data-layer='auth-interceptor']    .badge { background: color-mix(in srgb, var(--tertiary) 18%, transparent); color: var(--tertiary); }
    li[data-layer='logging-interceptor'] .badge { background: color-mix(in srgb, var(--warn) 18%, transparent); color: var(--warn); }
    li[data-layer='http']                .badge { background: color-mix(in srgb, var(--text-muted) 25%, transparent); color: var(--text-secondary); }
    li[data-layer='response']            .badge { background: color-mix(in srgb, var(--success) 18%, transparent); color: var(--success); }

    @keyframes slideIn { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class HttpInterceptorDemo {
  protected readonly hops = signal<HttpHop[]>([]);

  trigger() {
    this.hops.set([]);
    const stages: HttpHop[] = [
      { layer: 'request',             label: 'GET /api/orders',            detail: 'Caller dispatched request' },
      { layer: 'auth-interceptor',    label: 'Attach Authorization header', detail: 'Bearer eyJhbGc… (from inject(AuthService).token())' },
      { layer: 'logging-interceptor', label: 'Log request',                 detail: 'console.debug(req.urlWithParams)' },
      { layer: 'http',                label: 'fetch() roundtrip',           detail: '200 OK · 87ms' },
      { layer: 'logging-interceptor', label: 'Log response',                detail: 'console.debug(elapsed, status)' },
      { layer: 'auth-interceptor',    label: 'Pass through',                detail: 'No 401 → no refresh dance' },
      { layer: 'response',            label: 'Subscriber receives data',    detail: '[{ id: 1, … }, { id: 2, … }, …]' },
    ];

    stages.forEach((hop, i) => {
      setTimeout(() => this.hops.update((list) => [...list, hop]), i * 220);
    });
  }
}
