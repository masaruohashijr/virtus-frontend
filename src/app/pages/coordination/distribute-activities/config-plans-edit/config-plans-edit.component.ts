import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { catchError, tap, throwError } from "rxjs";
import { AlertDialogComponent } from "src/app/components/dialog/alert-dialog/alert-dialog.component";
import { PlainMessageDialogComponent } from "src/app/pages/administration/plain-message/plain-message-dialog.component";
import { PlanDTO } from "src/app/domain/dto/plan.dto";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { DistributeActivitiesService } from "src/app/services/coordination/distribute-activities.service";

@Component({
  selector: "app-config-plans-edit",
  templateUrl: "./config-plans-edit.component.html",
  styleUrls: ["./config-plans-edit.component.css"],
})
export class ConfigPlansComponent implements OnInit {
  configPlansForm!: FormGroup;

  plans: PlanDTO[] = [];
  allPlans: PlanDTO[] = [];

  planInput = new FormControl();
  selectedPlans: PlanDTO[] = [];

  plansChanged = false;

  constructor(
    @Inject(MatDialog) private errorDialog: MatDialog,
    private formBuilder: FormBuilder,
    private _service: DistributeActivitiesService,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ConfigPlansComponent>,
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ProductComponentDTO
  ) {
    console.log(typeof data);
    console.log(data);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.configPlansForm = this.formBuilder.group({
      entity: [this.data.entity.name],
      cycle: [this.data.cycle.cycle?.name],
      pillar: [this.data.pillar.name],
      component: [this.data.component.name],
      plans: [[]],
      motivation: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(400),
        ],
      ],
    });
    this._service
      .listConfigPlans(
        this.data.entity.id,
        this.data.cycle.id,
        this.data.pillar.id,
        this.data.component.id,
        false
      )
      .subscribe((resp) => {
        this.allPlans = resp;
        this.plans = resp;
        this._service
          .listConfiguredPlans(
            this.data.entity.id,
            this.data.cycle.cycle ? this.data.cycle.cycle.id : 0,
            this.data.pillar.id,
            this.data.component.id
          )
          .subscribe((resp) => {
            resp.forEach((obj) => {
              const index = this.plans.findIndex(
                (plan) => plan.id == obj.planId
              );
              if (index >= 0) {
                this.selectedPlans = this.configPlansForm.get("plans")
                  ?.value as PlanDTO[];
                this.selectedPlans.push(this.plans[index]);
                this.configPlansForm.get("plans")?.setValue(this.selectedPlans);
                this.plans = this.allPlans.filter(
                  (item) =>
                    !this.selectedPlans?.some(
                      (selected) => selected.id === item.id
                    )
                );
                this.configPlansForm
                  .get("plans")!
                  .patchValue(this.selectedPlans);
              }
            });
          });
      });
  }

  formatValue(value: number | undefined | null): string {
    if (!value) {
      return "";
    }

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Bilhões`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Milhões`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Mil`;
    } else {
      return value.toLocaleString("pt-BR");
    }
  }

  getTitle() {
    return "Planos de Benefícios";
  }

  compare(object1: PlanDTO, object2: PlanDTO) {
    return object1 && object2 ? object1.id === object2.id : object1 === object2;
  }

  addPlan(event: MatAutocompleteSelectedEvent): void {
    this.selectedPlans = this.configPlansForm.get("plans")?.value as PlanDTO[];
    this.selectedPlans.push(event.option.value);
    this.configPlansForm.get("plans")?.setValue(this.selectedPlans);
    this.plans = this.allPlans.filter(
      (item) => !this.selectedPlans?.some((selected) => selected.id === item.id)
    );
    this.configPlansForm.get("plans")!.patchValue(this.selectedPlans);
    this.plansChanged = true;
  }

  removePlan(chip: PlanDTO): void {
    const confirmDialog = this.errorDialog.open(AlertDialogComponent, {
      width: "400px",
      data: {
        title: "Confirmar remoção",
        message:
          "ATENÇÃO !!!"+
          "\n\nAs avaliações já realizadas neste plano serão permanentemente removidas."+
          "\n\nTem certeza que deseja prosseguir?",
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        this.selectedPlans = this.configPlansForm.get("plans")
          ?.value as PlanDTO[];
        const index = this.selectedPlans.indexOf(chip);

        if (index >= 0) {
          this.selectedPlans.splice(index, 1);
          this.plans = this.allPlans.filter(
            (item) =>
              !this.selectedPlans.some((selected) => selected.id === item.id)
          );
          this.configPlansForm.get("plans")!.patchValue(this.selectedPlans);
          this.plansChanged = true;
        }
      }
    });
  }

  updateConfigPlans() {
    if (
      this.plansChanged &&
      (!this.configPlansForm.get("motivation")?.value ||
        this.configPlansForm.get("motivation")?.value?.lenght < 3)
    ) {
      this.errorDialog.open(AlertDialogComponent, {
        width: "350px",
        data: {
          title: "Erro",
          message: "Você precisa informar o Motivo da Reconfiguração.",
        },
      });
      return;
    }

    const body = {
      entityId: this.data.entity.id,
      cycleId: this.data.cycle.cycle?.id,
      pillarId: this.data.pillar.id,
      componentId: this.data.component.id,
      plans: this.configPlansForm.value.plans,
      motivation: this.configPlansForm.get("motivation")?.value,
    };

    this._service
      .updateConfigPlans(body)
      .pipe(
        tap((resp) => {
          this.data.plans = this.selectedPlans;
          const mensagem = `A configuração dos planos foi atualizada com sucesso.`;
          this.dialog
                    .open(PlainMessageDialogComponent, {
                      width: "400px",
                      data: { message: mensagem },
                    })
                    .afterClosed()
                    .subscribe(() => {
                      // Fecha o modal de motivação após confirmação
                      this.dialogRef.close();
                    });
        }),
        catchError((error) => {
          const errorDialogRef = this.errorDialog.open(AlertDialogComponent, {
            width: "350px",
            data: {
              title: "Erro",
              message: error.error?.message
                ? error.error?.message
                : "Erro interno no servidor.",
            },
          });

          errorDialogRef.afterClosed().subscribe((result) => {});

          return throwError(error);
        })
      )
      .subscribe();
  }
}
