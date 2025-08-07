import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { catchError, tap, throwError } from "rxjs";
import { debounceTime, map, startWith } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

import { IndicatorScoreDTO } from "src/app/domain/dto/indicator-score.dto";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { IndicatorDTO } from "src/app/domain/dto/indicator.dto";
import { PageResponseDTO } from "src/app/domain/dto/response/page-response.dto";

import { IndicatorScoresService } from "src/app/services/administration/indicator-scores.service";
import { PlansService } from "src/app/services/administration/plans.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";
import { IndicatorsService } from "src/app/services/configuration/indicators.service";

@Component({
  selector: "app-indicator-scores-edit",
  templateUrl: "./indicator-scores-edit.component.html",
  styleUrls: ["./indicator-scores-edit.component.css"],
})
export class IndicatorScoresEditComponent implements OnInit {
  entityControl = new FormControl();
  filteredEntities: any[] = [];
  indicators: IndicatorDTO[] = [];

  scoreForm!: FormGroup;

  entities: { id: number; name: string; code?: string; acronym?: string }[] =
    [];
  filteredPlans: PlanDTO[] = [];
  selectedEntityId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<IndicatorScoresEditComponent>,
    private _formBuilder: FormBuilder,
    private service: IndicatorScoresService,
    private entityService: EntityVirtusService,
    private planService: PlansService,
    private indicatorService: IndicatorsService,
    @Inject(MAT_DIALOG_DATA) public object: IndicatorScoreDTO
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadEntities();
    this.loadIndicators();

    this.entityControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(200),
        map((value) => this.filterEntities(value))
      )
      .subscribe((filtered) => {
        this.filteredEntities = filtered;
      });

    if (this.object?.cnpb) {
      this.loadPlanAndEntityFromCnpb(this.object.cnpb);
    }
  }

  private buildForm(): void {
    const normalized = {
      cnpb: this.object.cnpb ?? null,
      referenceDate: this.object.referenceDate ?? null,
      indicatorId: this.object.indicatorId ?? null,
      indicatorSigla: this.object.indicatorSigla ?? null,
      score: this.object.score ?? null,
      createdAt: this.object.createdAt ?? null,
    };

    this.scoreForm = this._formBuilder.group({
      cnpb: [normalized.cnpb, [Validators.required]],
      referenceDate: [
        normalized.referenceDate,
        [Validators.required, Validators.pattern(/^[0-9]{4}(0[1-9]|1[0-2])$/)],
      ],
      indicatorId: [normalized.indicatorId, [Validators.required]],
      indicatorSigla: [normalized.indicatorSigla, [Validators.required]],
      score: [normalized.score, [Validators.required, Validators.min(0)]],
      createdAt: [normalized.createdAt],
    });
  }

  private loadEntities(): void {
    this.entityService.getAll("", 0, 1000).subscribe({
      next: (response) => {
        this.entities = (response.content || []).map((e: any) => ({
          id: e.id,
          name: e.name ?? "",
          acronym: e.acronym ?? "",
          code: e.code ?? "",
        }));
        this.filteredEntities = [...this.entities];
      },
      error: (err) => console.error("Erro ao carregar entidades", err),
    });
  }

  private loadIndicators(): void {
    this.indicatorService.getAll("", 0, 100).subscribe({
      next: (response: PageResponseDTO<IndicatorDTO>) => {
        this.indicators = (response?.content || []).sort((a, b) =>
          (a.indicatorAcronym ?? "").localeCompare(b.indicatorAcronym ?? "")
        );
      },
      error: (err: any) => {
        console.error("Erro ao carregar indicadores", err);
        this.indicators = [];
      },
    });
  }

  private loadPlanAndEntityFromCnpb(cnpb: string): void {
    this.planService.getByCnpb(cnpb).subscribe({
      next: (plan: PlanDTO) => {
        if (plan?.entity?.id) {
          const entity = {
            id: plan.entity.id,
            name: plan.entity.name ?? "",
            acronym: plan.entity.acronym ?? "",
            code: plan.entity.code ?? "",
          };
          this.selectedEntityId = entity.id;
          this.entityControl.setValue(entity);

          this.planService.getByEntityId(entity.id).subscribe({
            next: (plans) => {
              this.filteredPlans = plans || [];
              if (!this.filteredPlans.find((p) => p.cnpb === cnpb)) {
                this.filteredPlans.unshift(plan);
              }
            },
            error: (err) => {
              console.error("Erro ao carregar planos da entidade", err);
              this.filteredPlans = [];
            },
          });
        }
      },
      error: (err: any) => {
        console.error("Erro ao buscar plano por CNPB:", err);
      },
    });
  }

  save(): void {
    if (this.scoreForm.invalid) {
      this.scoreForm.markAllAsTouched();
      return;
    }

    this.object.cnpb = this.scoreForm.value.cnpb?.toString();
    this.object.referenceDate = this.scoreForm.value.referenceDate?.toString();
    this.object.indicatorId = Number(this.scoreForm.value.indicatorId);
    this.object.indicatorSigla =
      this.scoreForm.value.indicatorSigla?.toString();
    this.object.score = Number(this.scoreForm.value.score);

    const request$ = this.object.id
      ? this.service.update(this.object)
      : this.service.create(this.object);

    request$
      .pipe(
        tap((result) => this.dialogRef.close(result)),
        catchError((error) => {
          console.error("Erro ao salvar:", error);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  getTitle(): string {
    return this.object.indicatorSigla
      ? `Editar Nota "${this.object.indicatorSigla}"`
      : "Cadastrar nova Nota";
  }

  onEntitySelected(event: MatAutocompleteSelectedEvent): void {
    const entity = event.option.value;
    if (!entity?.id) return;

    this.selectedEntityId = entity.id;
    this.entityControl.setValue(entity);

    this.planService.getByEntityId(entity.id).subscribe({
      next: (plans) => {
        this.filteredPlans = plans || [];
      },
      error: (err) => {
        console.error("Erro ao carregar planos da entidade", err);
        this.filteredPlans = [];
      },
    });
  }

  private filterEntities(value: string): any[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : "";
    return this.entities.filter((entity) =>
      `${entity.code ?? ""} ${entity.acronym ?? ""} ${entity.name ?? ""}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  displayEntityFn(entity: any): string {
    return entity ? `${entity.code} - ${entity.acronym} - ${entity.name}` : "";
  }

  onIndicatorSelected(acronym: string): void {
    const indicator = this.indicators.find(
      (i) => i.indicatorAcronym === acronym
    );
    if (indicator) {
      this.scoreForm.patchValue({
        indicatorId: indicator.id,
        indicatorSigla: indicator.indicatorAcronym,
      });
    }
  }
}
