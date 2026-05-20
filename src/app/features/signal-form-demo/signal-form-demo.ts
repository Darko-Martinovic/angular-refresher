import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signal-form-demo',
  imports: [JsonPipe, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="note">
      <mat-icon fontSet="material-symbols-outlined">science</mat-icon>
      Signal Forms is experimental in v21. The illustration below uses plain signals + computed
      to show the shape the API is heading toward: field state, derived validity, and reactive output.
    </p>

    <div class="form">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" [ngModel]="email()" (ngModelChange)="email.set($event)" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Age</mat-label>
        <input matInput type="number" [ngModel]="age()" (ngModelChange)="age.set(+$event)" />
      </mat-form-field>
    </div>

    <div class="state">
      <div class="cell">
        <small>valid()</small>
        <span [class.ok]="valid()">{{ valid() }}</span>
      </div>
      <div class="cell">
        <small>summary()</small>
        <span>{{ summary() }}</span>
      </div>
      <div class="cell wide">
        <small>value()</small>
        <code>{{ value() | json }}</code>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .note { display: flex; align-items: center; gap: 0.5rem; margin: 0;
            background: color-mix(in srgb, var(--warn) 12%, transparent);
            color: var(--warn); padding: 0.55rem 0.85rem; border-radius: 8px;
            border: 1px solid color-mix(in srgb, var(--warn) 30%, transparent);
            font-size: 0.9rem; }
    .form { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; max-width: 480px; }
    .state { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
    .cell { background: var(--surface-2); border: 1px solid var(--surface-border);
            border-radius: 10px; padding: 0.65rem 0.85rem;
            display: flex; flex-direction: column; gap: 0.2rem; }
    .cell.wide { grid-column: 1 / -1; }
    small { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; }
    .ok { color: var(--success); font-weight: 600; }
    code { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); }
  `],
  standalone: true,
})
export class SignalFormDemo {
  protected readonly email = signal('ada@example.com');
  protected readonly age = signal(28);

  protected readonly valid = computed(
    () => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(this.email()) && this.age() >= 18,
  );

  protected readonly value = computed(() => ({
    email: this.email(),
    age: this.age(),
  }));

  protected readonly summary = computed(() => {
    if (!this.valid()) return 'invalid';
    return `${this.email()} (${this.age()})`;
  });
}
