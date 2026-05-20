import {
  ChangeDetectionStrategy,
  Component,
  Type,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FeatureService } from '../../core/features/feature.service';
import { DEMO_LOADERS } from '../../core/features/demo-loaders';
import { CodeBlock } from '../code-block/code-block';
import { FeatureTasks } from '../feature-tasks/feature-tasks';

@Component({
  selector: 'app-feature-page',
  imports: [
    CommonModule,
    NgComponentOutlet,
    RouterLink,
    CodeBlock,
    FeatureTasks,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-page.html',
  styleUrl: './feature-page.scss',
})
export class FeaturePage {
  /** Route-bound :slug param via withComponentInputBinding(). */
  slug = input.required<string>();

  private features = inject(FeatureService);
  private router = inject(Router);

  protected readonly feature = computed(() => this.features.bySlug(this.slug()));
  protected readonly section = computed(() => {
    const f = this.feature();
    return f ? this.features.sectionByKey(f.section) : undefined;
  });
  protected readonly neighbors = computed(() => this.features.neighbors(this.slug()));

  protected readonly demoComponent = signal<Type<unknown> | null>(null);

  constructor() {
    effect(async () => {
      const f = this.feature();
      this.demoComponent.set(null);
      if (!f) {
        this.router.navigate(['/']);
        return;
      }
      if (f.demoKey && DEMO_LOADERS[f.demoKey]) {
        try {
          const cmp = await DEMO_LOADERS[f.demoKey]();
          if (this.feature()?.slug === f.slug) {
            this.demoComponent.set(cmp);
          }
        } catch {
          this.demoComponent.set(null);
        }
      }
    });
  }
}
