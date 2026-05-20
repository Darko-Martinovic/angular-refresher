import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'app-async-pipe-demo',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (running()) {
      <div class="stream">
        <header>
          <mat-icon fontSet="material-symbols-outlined">stream</mat-icon>
          <code>tick$ | async</code>
        </header>
        @if (tick$ | async; as tick) {
          <div class="value">
            <small>Tick</small>
            <span>{{ tick }}</span>
          </div>
        }
      </div>
    } @else {
      <p class="off">Stream stopped — async pipe unsubscribed automatically.</p>
    }

    <div class="row">
      <button mat-raised-button color="primary" (click)="toggle()">
        <mat-icon fontSet="material-symbols-outlined">{{ running() ? 'stop' : 'play_arrow' }}</mat-icon>
        {{ running() ? 'Stop stream' : 'Start stream' }}
      </button>
      <span class="note">
        Toggling unmounts the &#64;if block — the async pipe cleans up its subscription with no ngOnDestroy boilerplate.
      </span>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .stream { background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px;
              padding: 0.85rem 1rem; display: flex; align-items: center; gap: 1rem; }
    .stream header { display: flex; align-items: center; gap: 0.45rem; color: var(--text-secondary);
                     font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
    .stream code { color: var(--accent-strong); }
    .value { display: flex; flex-direction: column; align-items: center; margin-left: auto; }
    .value small { font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 0.7rem; }
    .value span { font-size: 1.4rem; font-weight: 600; color: var(--accent-strong); }
    .off { color: var(--text-muted); font-style: italic; margin: 0; }
    .row { display: flex; gap: 0.85rem; align-items: center; flex-wrap: wrap; }
    .note { color: var(--text-muted); font-size: 0.85rem; }
  `],
})
export class AsyncPipeDemo {
  protected readonly running = signal(true);

  protected readonly tick$: Observable<number> = interval(1000).pipe(
    map((n) => n + 1),
  );

  toggle() {
    this.running.update((r) => !r);
  }
}
