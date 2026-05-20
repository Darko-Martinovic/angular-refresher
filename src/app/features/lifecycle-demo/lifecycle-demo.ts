import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lc-child',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="child"><strong>Child component</strong> · value: {{ value }}</div>`,
  styles: [`
    .child { padding: 0.75rem 1rem; background: var(--surface-2);
             border: 1px solid var(--surface-border); border-radius: 10px; }
  `],
})
export class LifecycleChild implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() value = 0;
  @Output() log = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    const keys = Object.keys(changes).join(',');
    this.log.emit(`ngOnChanges → ${keys}`);
  }
  ngOnInit() { this.log.emit('ngOnInit'); }
  ngAfterViewInit() { this.log.emit('ngAfterViewInit'); }
  ngOnDestroy() { this.log.emit('ngOnDestroy'); }
}

@Component({
  selector: 'app-lifecycle-demo',
  imports: [CommonModule, MatButtonModule, MatIconModule, LifecycleChild],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Each hook fires once or when its trigger occurs. Mount/unmount the child and change its input
      to see them in order.
    </p>
    <div class="row">
      <button mat-stroked-button (click)="mounted.set(!mounted())">
        <mat-icon fontSet="material-symbols-outlined">power_settings_new</mat-icon>
        {{ mounted() ? 'Unmount child' : 'Mount child' }}
      </button>
      <button mat-stroked-button (click)="bump()" [disabled]="!mounted()">
        <mat-icon fontSet="material-symbols-outlined">edit</mat-icon>
        Change input (value = {{ value() }})
      </button>
      <button mat-button (click)="logs.set([])">Clear log</button>
    </div>

    @if (mounted()) {
      <app-lc-child [value]="value()" (log)="append($event)" />
    }

    <div class="log">
      <header>Hook log</header>
      <ol>
        @for (entry of logs(); track $index) {
          <li>{{ entry }}</li>
        } @empty {
          <li class="empty">No hooks fired yet.</li>
        }
      </ol>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .hint { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    .row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .log { background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .log header { padding: 0.4rem 0.85rem; border-bottom: 1px solid var(--surface-border);
                  color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
    ol { list-style: none; margin: 0; padding: 0.4rem 0.85rem;
         max-height: 160px; overflow-y: auto;
         font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: var(--text-secondary); }
    li.empty { color: var(--text-muted); font-style: italic; }
  `],
})
export class LifecycleDemo {
  protected readonly mounted = signal(true);
  protected readonly value = signal(0);
  protected readonly logs = signal<string[]>([]);

  bump() { this.value.update((v) => v + 1); }

  append(entry: string) {
    const time = new Date().toLocaleTimeString();
    this.logs.update((l) => [`[${time}] ${entry}`, ...l].slice(0, 30));
  }
}
