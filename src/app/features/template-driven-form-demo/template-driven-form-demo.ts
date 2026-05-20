import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-driven-form-demo',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f.value)" class="form">
      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" name="email" [(ngModel)]="model.email" required email />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput type="password" name="password" [(ngModel)]="model.password" required minlength="8" />
      </mat-form-field>

      <div class="row">
        <button mat-raised-button color="primary" type="submit" [disabled]="f.invalid">
          Sign in
        </button>
        <span class="status">Form valid: <strong>{{ f.valid }}</strong></span>
      </div>
    </form>

    @if (lastSubmit(); as v) {
      <div class="result">
        <mat-icon fontSet="material-symbols-outlined">check_circle</mat-icon>
        Submitted: <code>{{ v }}</code>
      </div>
    }
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 0.5rem; max-width: 380px; }
    .row { display: flex; align-items: center; gap: 0.85rem; }
    .status { color: var(--text-muted); font-size: 0.85rem; }
    .status strong { color: var(--accent-strong); }
    .result { display: flex; align-items: center; gap: 0.5rem; color: var(--success);
              background: color-mix(in srgb, var(--success) 14%, transparent);
              padding: 0.55rem 0.85rem; border-radius: 8px; margin-top: 0.85rem; }
    code { font-family: 'JetBrains Mono', monospace; color: var(--text-primary); }
  `],
})
export class TemplateDrivenFormDemo {
  protected model = { email: '', password: '' };
  protected readonly lastSubmit = signal<string | null>(null);

  onSubmit(value: unknown) {
    this.lastSubmit.set(JSON.stringify(value));
  }
}
