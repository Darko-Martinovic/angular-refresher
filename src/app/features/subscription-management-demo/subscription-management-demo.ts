import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-leaky-child',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="child leaky">
    <span>Leaky child · counts: {{ counter() }}</span>
    <small>NO unsubscribe — interval keeps emitting after destroy</small>
  </div>`,
  styles: [`
    .child { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.7rem 0.9rem;
             background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .child.leaky { border-color: color-mix(in srgb, var(--danger) 40%, var(--surface-border)); }
    small { color: var(--text-muted); font-size: 0.78rem; }
  `],
})
export class LeakyChild {
  protected readonly counter = signal(0);
  private sub?: Subscription;

  constructor() {
    this.sub = interval(500).subscribe(() => {
      this.counter.update((c) => c + 1);
      console.warn('[Leaky] tick — subscription still alive');
    });
  }
}

@Component({
  selector: 'app-leak-safe-child',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="child safe">
    <span>Leak-safe child · counts: {{ counter() }}</span>
    <small>takeUntilDestroyed() — auto-cleanup on destroy</small>
  </div>`,
  styles: [`
    .child { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.7rem 0.9rem;
             background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .child.safe { border-color: color-mix(in srgb, var(--success) 40%, var(--surface-border)); }
    small { color: var(--text-muted); font-size: 0.78rem; }
  `],
})
export class LeakSafeChild {
  protected readonly counter = signal(0);

  constructor() {
    interval(500)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.counter.update((c) => c + 1));
  }
}

@Component({
  selector: 'app-subscription-management-demo',
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule, FormsModule, LeakyChild, LeakSafeChild],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Open DevTools console. Toggle each child off, then watch the warnings:
      the leaky child keeps ticking after destroy.
    </p>

    <div class="toggles">
      <mat-slide-toggle [(ngModel)]="leakyMounted">Mount leaky child</mat-slide-toggle>
      <mat-slide-toggle [(ngModel)]="safeMounted">Mount leak-safe child</mat-slide-toggle>
    </div>

    @if (leakyMounted) { <app-leaky-child /> }
    @if (safeMounted) { <app-leak-safe-child /> }
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 0.85rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .toggles { display: flex; gap: 1.5rem; flex-wrap: wrap; }
  `],
})
export class SubscriptionManagementDemo {
  protected leakyMounted = true;
  protected safeMounted = true;
}
