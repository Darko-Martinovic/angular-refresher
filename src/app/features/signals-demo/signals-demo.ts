import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signals-demo',
  imports: [MatButtonModule, MatIconModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo">
      <div class="row">
        <button mat-icon-button (click)="dec()" aria-label="Decrement">
          <mat-icon fontSet="material-symbols-outlined">remove</mat-icon>
        </button>
        <div class="counter">
          <small>count()</small>
          <span class="value">{{ count() }}</span>
        </div>
        <button mat-icon-button (click)="inc()" aria-label="Increment">
          <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
        </button>
        <button mat-stroked-button (click)="count.set(0)" class="reset">Reset</button>
      </div>

      <div class="derived">
        <div class="cell">
          <small>computed(() => count() * 2)</small>
          <span>{{ doubled() }}</span>
        </div>
        <div class="cell">
          <small>computed(() => count() % 2 === 0)</small>
          <span [class.even]="isEven()">{{ isEven() ? 'even' : 'odd' }}</span>
        </div>
      </div>

      <div class="log">
        <header>
          <mat-icon fontSet="material-symbols-outlined">terminal</mat-icon>
          effect log
          <button mat-button (click)="clearLog()" class="clear">Clear</button>
        </header>
        <ol>
          @for (entry of log(); track $index) {
            <li>{{ entry }}</li>
          } @empty {
            <li class="empty">No effect runs yet — click + or −.</li>
          }
        </ol>
      </div>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .counter {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        padding: 0.5rem 1.5rem;
        min-width: 130px;
      }
      .counter small {
        color: var(--text-muted);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
      }
      .counter .value {
        font-size: 2.25rem;
        font-weight: 600;
        color: var(--accent-strong);
        line-height: 1;
        margin-top: 0.2rem;
      }
      .reset {
        margin-left: auto;
      }
      .derived {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
      }
      .cell {
        background: var(--surface-2);
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        padding: 0.7rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .cell small {
        color: var(--text-muted);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
      }
      .cell span {
        font-size: 1.1rem;
        font-weight: 500;
      }
      .even {
        color: var(--success);
      }
      .log {
        background: var(--surface-2);
        border: 1px solid var(--surface-border);
        border-radius: 10px;
      }
      .log header {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.55rem 0.85rem;
        border-bottom: 1px solid var(--surface-border);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: var(--text-muted);
      }
      .log header .clear {
        margin-left: auto;
        font-size: 0.75rem;
        min-width: auto;
      }
      .log ol {
        list-style: none;
        margin: 0;
        padding: 0.5rem 0.85rem;
        max-height: 160px;
        overflow-y: auto;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: var(--text-secondary);
      }
      .log li {
        padding: 0.2rem 0;
        animation: fadeIn 0.2s ease;
      }
      .log .empty {
        color: var(--text-muted);
        font-style: italic;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `,
  ],
})
export class SignalsDemo {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly isEven = computed(() => this.count() % 2 === 0);
  protected readonly log = signal<string[]>([]);

  constructor() {
    effect(() => {
      const c = this.count();
      const time = new Date().toLocaleTimeString();
      this.log.update((entries) => [`[${time}] count is now ${c}`, ...entries].slice(0, 30));
    });
  }

  inc() {
    this.count.update((c) => c + 1);
  }
  dec() {
    this.count.update((c) => c - 1);
  }
  clearLog() {
    this.log.set([]);
  }
}
