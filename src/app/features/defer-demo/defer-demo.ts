import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-heavy-widget',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="heavy">
      <mat-icon fontSet="material-symbols-outlined">insights</mat-icon>
      <div>
        <strong>Loaded heavy widget</strong>
        <p>This component's chunk only downloaded after the &#64;defer trigger fired.</p>
      </div>
    </div>
  `,
  styles: [`
    .heavy { display: flex; gap: 0.85rem; padding: 1rem 1.15rem;
             background: color-mix(in srgb, var(--accent) 14%, transparent);
             border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
             border-radius: 12px; }
    mat-icon { font-size: 1.8rem; width: 1.8rem; height: 1.8rem; color: var(--accent-strong); }
    strong { display: block; }
    p { margin: 0.2rem 0 0; color: var(--text-secondary); }
  `],
})
export class HeavyWidget {}

@Component({
  selector: 'app-defer-demo',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, HeavyWidget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Three blocks demonstrating different triggers. Open DevTools → Network and clear it before
      interacting, then watch chunks load just-in-time.
    </p>

    <section>
      <header>{{ '@defer (on interaction)' }} — hover or click to load</header>
      @defer (on interaction; on hover) {
        <app-heavy-widget />
      } @placeholder {
        <button mat-stroked-button class="placeholder">
          <mat-icon fontSet="material-symbols-outlined">touch_app</mat-icon>
          Click or hover to load
        </button>
      } @loading (minimum 500ms) {
        <div class="loading">
          <mat-progress-spinner mode="indeterminate" diameter="22" />
          Loading…
        </div>
      }
    </section>

    <section>
      <header>{{ '@defer (on viewport)' }} — scroll the block into view</header>
      <div class="spacer">Scroll down ↓</div>
      @defer (on viewport) {
        <app-heavy-widget />
      } @placeholder {
        <div class="placeholder-card">
          <mat-icon fontSet="material-symbols-outlined">visibility</mat-icon>
          Waiting for viewport intersection…
        </div>
      } @loading (minimum 500ms) {
        <div class="loading">
          <mat-progress-spinner mode="indeterminate" diameter="22" />
          Loading…
        </div>
      }
    </section>

    <section>
      <header>{{ '@defer (when ...)' }} — explicit trigger</header>
      <button mat-raised-button color="primary" (click)="show.set(true)">
        <mat-icon fontSet="material-symbols-outlined">download</mat-icon>
        Trigger load
      </button>
      @defer (when show()) {
        <app-heavy-widget />
      } @placeholder {
        <div class="placeholder-card">Click the button to trigger the &#64;defer block.</div>
      }
    </section>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1.25rem; }
    section { display: flex; flex-direction: column; gap: 0.5rem; }
    header { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.82rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .placeholder { align-self: flex-start; }
    .placeholder-card { display: flex; align-items: center; gap: 0.5rem;
                        background: var(--surface-2); border: 1px dashed var(--surface-border);
                        border-radius: 10px; padding: 0.85rem 1rem; color: var(--text-muted); }
    .loading { display: flex; align-items: center; gap: 0.75rem;
               padding: 0.85rem 1rem; color: var(--text-secondary); }
    .spacer { padding: 4rem 1rem; text-align: center;
              background: linear-gradient(transparent, var(--surface-2));
              color: var(--text-muted); border-radius: 8px; }
  `],
})
export class DeferDemo {
  protected readonly show = signal(false);
}
