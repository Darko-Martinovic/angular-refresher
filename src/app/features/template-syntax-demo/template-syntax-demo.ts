import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-template-syntax-demo',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      <div class="cell">
        <header>Interpolation · {{ '{{ name() }}' }}</header>
        <p>Hello, {{ name() }}!</p>
      </div>

      <div class="cell">
        <header>Property · [disabled]</header>
        <button mat-raised-button [disabled]="disabled()" color="primary">
          @if (disabled()) { Disabled } @else { Enabled }
        </button>
        <mat-slide-toggle [(ngModel)]="disabledModel" (ngModelChange)="disabled.set($event)">
          disabled
        </mat-slide-toggle>
      </div>

      <div class="cell">
        <header>Attribute · [attr.data-status]</header>
        <div class="dot" [attr.data-status]="status()" [attr.aria-label]="'status ' + status()"></div>
        <button mat-stroked-button (click)="cycleStatus()">
          {{ status() }}
          <mat-icon fontSet="material-symbols-outlined">refresh</mat-icon>
        </button>
      </div>

      <div class="cell">
        <header>Event · (click)</header>
        <button mat-stroked-button (click)="bump()">
          <mat-icon fontSet="material-symbols-outlined">add</mat-icon>
          Clicks: {{ clicks() }}
        </button>
      </div>

      <div class="cell wide">
        <header>Two-way · [(ngModel)]</header>
        <mat-form-field appearance="outline">
          <mat-label>Your name</mat-label>
          <input matInput [(ngModel)]="nameModel" (ngModelChange)="name.set($event)" />
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; }
    .cell { display: flex; flex-direction: column; gap: 0.55rem; padding: 0.85rem 1rem;
            background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .cell.wide { grid-column: 1 / -1; }
    header { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--accent-strong); }
    .dot { width: 24px; height: 24px; border-radius: 50%; transition: background 0.2s; }
    .dot[data-status="idle"]   { background: var(--text-muted); }
    .dot[data-status="active"] { background: var(--accent); }
    .dot[data-status="done"]   { background: var(--success); }
    p { margin: 0; color: var(--text-primary); font-size: 1.05rem; }
  `],
})
export class TemplateSyntaxDemo {
  protected readonly name = signal('Ada');
  protected readonly disabled = signal(false);
  protected readonly clicks = signal(0);
  protected readonly status = signal<'idle' | 'active' | 'done'>('idle');

  protected nameModel = 'Ada';
  protected disabledModel = false;

  bump() { this.clicks.update((c) => c + 1); }

  cycleStatus() {
    const order: Array<'idle' | 'active' | 'done'> = ['idle', 'active', 'done'];
    this.status.update((s) => order[(order.indexOf(s) + 1) % order.length]);
  }
}
