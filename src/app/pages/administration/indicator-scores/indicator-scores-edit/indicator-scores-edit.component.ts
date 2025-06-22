import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { catchError, tap, throwError } from "rxjs";

import { IndicatorScoreDTO } from "src/app/domain/dto/indicator-scores.dto";
import { IndicatorScoresService } from "src/app/services/administration/indicator-scores.service";
import { PlansService } from "src/app/services/administration/plans.service";
import { EntityVirtusService } from "src/app/services/rating/entity-virtus.service";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

import { debounceTime, map, startWith } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";

@Component({
  selector: "app-indicator-scores-edit",
  templateUrl: "./indicator-scores-edit.component.html",
  styleUrls: ["./indicator-scores-edit.component.css"],
})
export class IndicatorScoresEditComponent implements OnInit {
  entityControl = new FormControl();
  filteredEntities: any[] = [];

  scoreForm = this._formBuilder.group({
    cnpb: [this.object.cnpb, [Validators.required]],
    referenceDate: [
      this.object.referenceDate,
      [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])[0-9]{4}$/), // MMYYYY
      ],
    ],

    indicatorSigla: [this.object.indicatorSigla, [Validators.required]],
    componentText: [this.object.componentText, [Validators.required]],
    score: [this.object.score, [Validators.required, Validators.min(0)]],
    createdAt: [this.object.createdAt],
  });

  entities: { id: number; name: string; code?: string; acronym?: string }[] =
    [];
  entityPlans: { cnpb: string; description: string }[] = [];
  selectedEntityId: number | null = null;
  filteredPlans: PlanDTO[] = [];
  plans: PlanDTO[] = [];
  loadingPlans: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<IndicatorScoresEditComponent>,
    private _formBuilder: FormBuilder,
    private service: IndicatorScoresService,
    private entityService: EntityVirtusService,
    private planService: PlansService,
    @Inject(MAT_DIALOG_DATA) public object: IndicatorScoreDTO
  ) {}

  ngOnInit(): void {
    this.loadEntities();

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
      this.planService.getByCnpb(this.object.cnpb).subscribe({
        next: (plan: PlanDTO) => {
          if (plan?.entity?.id) {
            const entity = {
              id: plan.entity.id,
              name: plan.entity.name ?? "",
              acronym: plan.entity.acronym ?? "",
              code: plan.entity.code ?? "",
            };
            this.selectedEntityId = entity.id;
            this.entityControl.setValue(entity); // exibe entidade no campo

            this.planService.getByEntityId(entity.id).subscribe({
              next: (plans) => {
                this.filteredPlans = plans || [];

                // Garante que o CNPB estará entre os planos disponíveis
                if (
                  !this.filteredPlans.find((p) => p.cnpb === this.object.cnpb)
                ) {
                  this.filteredPlans.unshift(plan); // adiciona manualmente se necessário
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
  }

  save(): void {
    if (this.scoreForm.invalid) {
      this.scoreForm.markAllAsTouched();
      return;
    }

    this.object.cnpb = this.scoreForm.value.cnpb?.toString();
    this.object.referenceDate = this.scoreForm.value.referenceDate?.toString();
    this.object.indicatorSigla =
      this.scoreForm.value.indicatorSigla?.toString();
    this.object.componentText = this.scoreForm.value.componentText?.toString();
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
      ? `Editar Nota "${this.object.indicatorSigla}" `
      : "Cadastrar nova Nota";
  }

  private loadEntities(): void {
    this.entityService.getAll("", 0, 1000).subscribe({
      next: (response) => {
        this.entities = (response.content || []).map((e: any) => ({
          id: e.id,
          name: e.name ?? "",
          acronym: e.acronym ?? "",
          code: e.code ?? "", // ajuste conforme backend
        }));
        this.filteredEntities = [...this.entities];
      },
      error: (err) => console.error("Erro ao carregar entidades", err),
    });
  }

  onEntitySelected(event: MatAutocompleteSelectedEvent): void {
    const entity = event.option.value;

    if (!entity?.id) return;

    this.selectedEntityId = entity.id;
    this.entityControl.setValue(entity); // mantém o objeto visível

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

  private filterEntities(
    value: string
  ): { id: number; name: string; code?: string; acronym?: string }[] {
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
}
