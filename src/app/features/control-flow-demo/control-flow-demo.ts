import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-flow-demo',
  imports: [MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <header>{{ '@if' }} / {{ '@else' }}</header>
      <mat-button-toggle-group [(ngModel)]="state" (ngModelChange)="onStateChange($event)">
        <mat-button-toggle value="loading">loading</mat-button-toggle>
        <mat-button-toggle value="ok">ok</mat-button-toggle>
        <mat-button-toggle value="error">error</mat-button-toggle>
      </mat-button-toggle-group>

      <div class="surface">
        @if (state === 'loading') {
          <div class="row">
            <mat-icon fontSet="material-symbols-outlined" class="spin">progress_activity</mat-icon>
            Loading orders…
          </div>
        } @else if (state === 'error') {
          <div class="row danger">
            <mat-icon fontSet="material-symbols-outlined">error</mat-icon>
            Failed to load. Retry?
          </div>
        } @else {
          <div class="row success">
            <mat-icon fontSet="material-symbols-outlined">check_circle</mat-icon>
            {{ items().length }} orders ready.
          </div>
        }
      </div>
    </section>

    <section>
      <header>{{ '@for' }} (with track) / {{ '@empty' }}</header>
      <div class="row buttons">
        <button mat-stroked-button (click)="add()">
          <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
          Add item
        </button>
        <button mat-stroked-button (click)="removeFirst()" [disabled]="!items().length">
          <mat-icon fontSet="material-symbols-outlined">remove</mat-icon>
          Remove first
        </button>
        <button mat-stroked-button (click)="items.set([])" [disabled]="!items().length">Clear</button>
      </div>

      <ul class="list">
        @for (item of items(); track item.id; let idx = $index, isFirst = $first, isLast = $last) {
          <li>
            <span class="idx">#{{ idx }}</span>
            <span>{{ item.label }}</span>
            @if (isFirst) { <small class="tag">first</small> }
            @if (isLast)  { <small class="tag">last</small> }
          </li>
        } @empty {
          <li class="empty">No items — add one to render the &#64;for block.</li>
        }
      </ul>
    </section>

    <section>
      <header>{{ '@switch' }}</header>
      <div class="row buttons">
        <button mat-stroked-button (click)="cycleRole()">Cycle role: {{ role() }}</button>
      </div>
      <div class="surface">
        @switch (role()) {
          @case ('admin') {
            <p><mat-icon fontSet="material-symbols-outlined">shield_person</mat-icon> Admin tools enabled.</p>
          }
          @case ('editor') {
            <p><mat-icon fontSet="material-symbols-outlined">edit</mat-icon> Editor view.</p>
          }
          @default {
            <p><mat-icon fontSet="material-symbols-outlined">visibility</mat-icon> Read-only.</p>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1.25rem; }
    section { display: flex; flex-direction: column; gap: 0.55rem; }
    header { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.85rem; }
    .surface { background: var(--surface-2); border: 1px solid var(--surface-border);
               border-radius: 10px; padding: 0.85rem 1rem; min-height: 56px; display: flex; }
    .row { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
    .row.danger { color: var(--danger); }
    .row.success { color: var(--success); }
    .buttons { gap: 0.65rem; flex-wrap: wrap; }
    .list { list-style: none; margin: 0; padding: 0;
            background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .list li { display: flex; align-items: center; gap: 0.65rem;
               padding: 0.55rem 0.85rem; border-bottom: 1px solid var(--surface-border); }
    .list li:last-child { border-bottom: none; }
    .list li.empty { color: var(--text-muted); font-style: italic; justify-content: center; }
    .idx { font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 0.78rem; min-width: 2.5ch; }
    .tag { background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent-strong);
           padding: 0.05rem 0.35rem; border-radius: 4px; font-size: 0.7rem; }
    .spin { animation: spin 1.2s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { margin: 0; display: inline-flex; align-items: center; gap: 0.45rem; }
  `],
})
export class ControlFlowDemo {
  protected state: 'loading' | 'ok' | 'error' = 'ok';
  protected readonly items = signal([
    { id: 1, label: 'Pen' },
    { id: 2, label: 'Notebook' },
    { id: 3, label: 'Lamp' },
  ]);
  protected readonly role = signal<'admin' | 'editor' | 'viewer'>('viewer');
  private nextId = 4;

  onStateChange(_v: string) { /* trigger CD via ngModel */ }

  add() {
    this.items.update((arr) => [
      ...arr,
      { id: this.nextId, label: `Item #${this.nextId++}` },
    ]);
  }
  removeFirst() {
    this.items.update((arr) => arr.slice(1));
  }
  cycleRole() {
    const order: Array<'admin' | 'editor' | 'viewer'> = ['viewer', 'editor', 'admin'];
    this.role.update((r) => order[(order.indexOf(r) + 1) % order.length]);
  }
}
