import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cd-child-default',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="card">
      <header>Default · ChangeDetectionStrategy.Default</header>
      <div class="body">
        <span class="label">Input value</span>
        <span class="value">{{ value() }}</span>
        <span class="label">Checks observed</span>
        <span class="value accent">{{ checkCount() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid var(--surface-border); border-radius: 10px; overflow: hidden; }
    header { padding: 0.45rem 0.75rem; background: var(--surface-3);
             font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-secondary); }
    .body { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 0.85rem; padding: 0.65rem 0.85rem; }
    .label { color: var(--text-muted); font-size: 0.82rem; }
    .value { font-weight: 500; font-family: 'JetBrains Mono', monospace; }
    .accent { color: var(--danger); }
  `],
})
export class DefaultChild {
  value = input<number>(0);
  private count = 0;
  checkCount = computed(() => {
    // computed re-runs every CD cycle if Default reaches it
    this.value();
    return ++this.count;
  });
}

@Component({
  selector: 'app-cd-child-onpush',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <header>OnPush · ChangeDetectionStrategy.OnPush</header>
      <div class="body">
        <span class="label">Input value</span>
        <span class="value">{{ value() }}</span>
        <span class="label">Checks observed</span>
        <span class="value success">{{ checkCount() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid var(--surface-border); border-radius: 10px; overflow: hidden; }
    header { padding: 0.45rem 0.75rem; background: var(--surface-3);
             font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-secondary); }
    .body { display: grid; grid-template-columns: auto 1fr; gap: 0.3rem 0.85rem; padding: 0.65rem 0.85rem; }
    .label { color: var(--text-muted); font-size: 0.82rem; }
    .value { font-weight: 500; font-family: 'JetBrains Mono', monospace; }
    .success { color: var(--success); }
  `],
})
export class OnPushChild {
  value = input<number>(0);
  private count = 0;
  checkCount = computed(() => {
    this.value();
    return ++this.count;
  });
}

@Component({
  selector: 'app-change-detection-demo',
  imports: [MatButtonModule, MatIconModule, MatSlideToggleModule, FormsModule, DefaultChild, OnPushChild],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo">
      <p class="hint">
        Both children watch the same input. The Default child re-checks every cycle;
        OnPush only re-checks when its input reference changes.
      </p>

      <div class="row">
        <button mat-stroked-button (click)="bump()">
          <mat-icon fontSet="material-symbols-outlined">refresh</mat-icon>
          Trigger CD (no input change)
        </button>
        <button mat-stroked-button (click)="updateInput()">
          <mat-icon fontSet="material-symbols-outlined">edit</mat-icon>
          Change input value ({{ value() }})
        </button>
      </div>

      <div class="children">
        <app-cd-child-default [value]="value()" />
        <app-cd-child-onpush  [value]="value()" />
      </div>

      <div class="info">
        Outer ticks: <strong>{{ outerTicks() }}</strong>
        — click "Trigger CD" repeatedly and notice OnPush stays put.
      </div>
    </div>
  `,
  styles: [`
    .demo { display: flex; flex-direction: column; gap: 1rem; }
    .hint { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    .row { display: flex; gap: 0.65rem; flex-wrap: wrap; }
    .children { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem; }
    .info { color: var(--text-muted); font-size: 0.9rem; }
    strong { color: var(--accent-strong); }
  `],
})
export class ChangeDetectionDemo {
  protected readonly value = signal(0);
  protected readonly outerTicks = signal(0);

  bump() {
    // Triggers a CD cycle without changing the input reference
    this.outerTicks.update((t) => t + 1);
  }

  updateInput() {
    this.value.update((v) => v + 1);
    this.outerTicks.update((t) => t + 1);
  }
}
