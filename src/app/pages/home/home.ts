import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { FeatureService } from '../../core/features/feature.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private features = inject(FeatureService);

  protected readonly grouped = this.features.grouped;
  protected readonly totalFeatures = computed(() => this.features.features().length);
  protected readonly totalSections = computed(() => this.features.sections().length);
  protected readonly demoCount = computed(
    () => this.features.features().filter((f) => f.demoKey).length,
  );
  protected readonly taskCount = computed(() =>
    this.features.features().reduce((sum, f) => sum + (f.tasks?.length ?? 0), 0),
  );

  protected readonly query = signal('');

  protected readonly filteredGroups = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.grouped();
    return this.grouped()
      .map((g) => ({
        section: g.section,
        features: g.features.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.tagline.toLowerCase().includes(q) ||
            f.summary.toLowerCase().includes(q) ||
            f.keyPoints.some((k) => k.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.features.length > 0);
  });

  clearQuery() {
    this.query.set('');
  }
}
