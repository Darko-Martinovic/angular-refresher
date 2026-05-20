import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Order {
  id: number;
  customer: string;
  amount: number;
}

@Component({
  selector: 'app-order-row',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <span class="id">#{{ order().id }}</span>
      <span class="customer">{{ order().customer }}</span>
      <span class="amount">$ {{ order().amount.toFixed(2) }}</span>
      <button mat-icon-button (click)="remove.emit(order().id)" aria-label="Remove">
        <mat-icon fontSet="material-symbols-outlined">delete</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .row { display: grid; grid-template-columns: 60px 1fr auto auto; gap: 0.65rem; align-items: center;
           padding: 0.4rem 0.85rem; background: var(--surface-2);
           border: 1px solid var(--surface-border); border-radius: 10px; }
    .id { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
    .customer { color: var(--text-primary); }
    .amount { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
  `],
})
export class OrderRow {
  /** Pure presentational — only inputs and outputs. */
  order = input.required<Order>();
  remove = output<number>();
}

@Component({
  selector: 'app-smart-presentational-demo',
  imports: [MatButtonModule, MatIconModule, OrderRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      The container owns state and effects. The row component is pure — only inputs/outputs.
      That row is also <code>OnPush</code> with signal inputs, so Angular can skip it whenever
      its input reference is unchanged.
    </p>

    <div class="row">
      <button mat-raised-button color="primary" (click)="add()">
        <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
        Add order
      </button>
      <span class="total">Total: <strong>$ {{ total().toFixed(2) }}</strong></span>
      <span class="count">{{ orders().length }} orders</span>
    </div>

    <div class="list">
      @for (o of orders(); track o.id) {
        <app-order-row [order]="o" (remove)="remove($event)" />
      } @empty {
        <p class="empty">No orders yet. Add one.</p>
      }
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 0.9rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .hint code { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
    .row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .total strong { color: var(--success); }
    .count { color: var(--text-muted); font-size: 0.9rem; margin-left: auto; }
    .list { display: flex; flex-direction: column; gap: 0.4rem; }
    .empty { color: var(--text-muted); font-style: italic; margin: 0; }
  `],
})
export class SmartPresentationalDemo {
  private nextId = 1;
  protected readonly orders = signal<Order[]>([
    { id: this.nextId++, customer: 'Ada Lovelace', amount: 124.5 },
    { id: this.nextId++, customer: 'Grace Hopper', amount: 89.0 },
  ]);

  protected readonly total = computed(() =>
    this.orders().reduce((sum, o) => sum + o.amount, 0),
  );

  private names = ['Ada', 'Grace', 'Linus', 'Edsger', 'Alan', 'Margaret', 'Donald'];

  add() {
    const name = this.names[Math.floor(Math.random() * this.names.length)];
    const amount = Math.round(Math.random() * 50000) / 100;
    this.orders.update((list) => [...list, { id: this.nextId++, customer: name, amount }]);
  }

  remove(id: number) {
    this.orders.update((list) => list.filter((o) => o.id !== id));
  }
}
