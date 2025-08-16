import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { PlainMessageDialogComponent } from "src/app/pages/administration/plain-message/plain-message-dialog.component";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";

@Component({
  selector: "app-evaluate-automatic-score",
  templateUrl: "./evaluate-automatic-score.component.html",
  styleUrls: ["./evaluate-automatic-score.component.css"],
})
export class EvaluateAutomaticScoreComponent implements OnInit {
  evaluateAutomaticScoreForm: FormGroup | undefined;
  errorMessage: string = "";
  canMoveUpFlag: boolean = true;
  canMoveDownFlag: boolean = true;
  isRatifyEnabled: boolean = true; // Controle de habilitação do botão Ratificar
  @ViewChild("motivationInput") motivationInput!: ElementRef;
  
  originalGrade: number = 0; // Nota Original
  newGrade: number = 0; // Nova Nota

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: EvaluatePlansService,
    @Inject(MatDialogRef) private dialog: MatDialog,
    @Inject(MatDialogRef) private dialogRef: MatDialogRef<EvaluateAutomaticScoreComponent>
  ) {}

  ngOnInit(): void {
    // Inicializando o formulário com os dados passados no diálogo
    this.evaluateAutomaticScoreForm = this.fb.group({
      entity: [{ value: this.data.entity.name, disabled: true }],
      cycle: [{ value: this.data.cycle.name, disabled: true }],
      pillar: [{ value: this.data.pillar.name, disabled: true }],
      component: [{ value: this.data.component.name, disabled: true }],
      plan: [{ value: this.data.plan.name, disabled: true }],
      grade: [{ value: this.data.grade, disabled: true }],
      originalGrade: [{ value: this.data.originalGrade, disabled: true }],
      newGrade: [this.originalGrade, Validators.required],
      motivation: ["", [Validators.minLength(4), Validators.maxLength(400)]],
    });

    // Inicializando as variáveis de notas
    this.originalGrade = this.data.grade || 0;
    this.newGrade = this.originalGrade;

    // Monitorando a mudança no campo de nova nota
    this.evaluateAutomaticScoreForm
      .get("newGrade")
      ?.valueChanges.subscribe((value) => {
        this.newGrade = value;
        this.validateNewGrade(value);
        this.toggleRatifyButton();
      });

    // Monitorando a mudança no campo de motivação
    this.evaluateAutomaticScoreForm
      .get("motivation")
      ?.valueChanges.subscribe((value) => {
        this.validateMotivationLength(value); // Validando comprimento da motivação
      });

    // Atualiza a habilitação do botão Ratificar no início
    this.toggleRatifyButton();
  }

  validateMotivationLength(value: string): void {
    // Atualiza o erro de mensagem caso a motivação tenha menos de 4 ou mais de 400 caracteres
    if (value && (value.length < 4 || value.length > 400)) {
      this.errorMessage = "A motivação deve ter entre 4 e 400 caracteres.";
    } else {
      this.errorMessage = "";
    }
  }

  validateNewGrade(value: string): void {
    if (value && isNaN(parseFloat(value))) {
      this.errorMessage = "A nova nota deve ser um número válido.";
    } else {
      this.errorMessage = "";
    }
  }

  moveUp(): void {
    if (this.newGrade < 4) {
      this.newGrade += 0.25;
      if (this.newGrade > 4) {
        this.newGrade = 4;
      }
      this.toggleRatifyButton();
    }
  }

  moveDown(): void {
    if (this.newGrade > 1) {
      this.newGrade -= 0.25;
      if (this.newGrade < 1) {
        this.newGrade = 1;
      }
      this.toggleRatifyButton();
    }
  }

  // Função para habilitar ou desabilitar o botão Ratificar
  toggleRatifyButton(): void {
    if (this.originalGrade === this.newGrade) {
      this.isRatifyEnabled = true;
    } else {
      this.isRatifyEnabled = false;
    }
  }

  rectifyNote(): void {
    if (this.evaluateAutomaticScoreForm?.valid) {
      // Forçar a validação do campo motivação
      this.evaluateAutomaticScoreForm.get("motivation")?.markAsTouched();

      const motivacao =
        this.evaluateAutomaticScoreForm.get("motivation")?.value;

      // Verifica se o campo motivação está preenchido e se tem entre 4 e 400 caracteres
      if (!motivacao || motivacao.length < 4 || motivacao.length > 400) {
        this.errorMessage = "A motivação deve ter entre 4 e 400 caracteres.";
        // Impede a continuação da execução do código
        return;
      }

      // Preparando os dados para a requisição de retificação
      const requestData = {
        entidadeId: this.data.entity?.id,
        cicloId: this.data.cycle?.id,
        pilarId: this.data.pillar?.id,
        componenteId: this.data.component?.id,
        planoId: this.data.plan?.id,
        nota: this.newGrade,
        tipoAvalicao: "RE",
        motivacao: motivacao,
      };

      // Enviar os dados para o backend via serviço
      this._service.rectifyNote(requestData).subscribe({
        next: (response: any) => {
          // Mensagem de sucesso
          const mensagem = `A nota foi retificada de ${this.originalGrade} para ${this.newGrade} com sucesso.`;
          this.originalGrade = this.newGrade;
          // Atualizar as notas via Tree Nodes
          this.atualizarNotasViaTreeNodes(response, {
            ciclo: this.data.cycle,
            pilar: this.data.pillar,
            componente: this.data.component,
            plano: this.data.plan,
            tipoNota: this.data.gradeType,
          });

          // Mostrar a mensagem de sucesso ao usuário
          this.dialog
            .open(PlainMessageDialogComponent, {
              width: "400px",
              data: { message: mensagem },
            })
            .afterClosed()
            .subscribe(() => {
              // Fecha o popup após a confirmação
              this.dialogRef.close();
            });
        },
        error: (error: any) => {
          console.error("Erro ao tentar retificar a nota", error);
          // Exibir uma mensagem de erro, se necessário (por exemplo, via snackbar)
        },
      });
    } else {
      this.errorMessage = "A motivação deve ter entre 4 e 400 caracteres.";
    }
  }

  ratifyNote(): void {
    if (this.evaluateAutomaticScoreForm?.valid) {
      // Forçar a validação do campo motivação
      this.evaluateAutomaticScoreForm.get("motivation")?.markAsTouched();

      const motivacao =
        this.evaluateAutomaticScoreForm.get("motivation")?.value;

      // Verifica se o campo motivação está preenchido e se tem entre 4 e 400 caracteres
      if (!motivacao || motivacao.length < 4 || motivacao.length > 400) {
        this.errorMessage = "A motivação deve ter entre 4 e 400 caracteres.";
        // Impede a continuação da execução do código
        return;
      }

      // Preparando os dados para a requisição
      const requestData = {
        entidadeId: this.data.entity?.id,
        cicloId: this.data.cycle?.id,
        pilarId: this.data.pillar?.id,
        componenteId: this.data.component?.id,
        planoId: this.data.plan?.id,
        nota: this.newGrade,
        tipoAvalicao: "RA",
        motivacao: motivacao,
      };

      // Enviar os dados para o backend via serviço
      this._service.ratifyNote(requestData).subscribe({
        next: (res: any) => {
          const mensagem = `A nota ${this.data.grade} foi ratificada com sucesso.`;

          // Mostrar a mensagem de sucesso
          this.dialog
            .open(PlainMessageDialogComponent, {
              width: "400px",
              data: { message: mensagem },
            })
            .afterClosed()
            .subscribe(() => {
              this.dialogRef.close();
            });
        },
        error: (err) => {
          console.error("Erro ao ratificar a nota:", err);
        },
      });
    } else {
      this.errorMessage = "A motivação deve ter entre 4 e 400 caracteres.";
    }
  }

  fechar(): void {
    console.log("Fechando o formulário");
  }

  getTitle(): string {
    return "Retificar / Ratificar Nota Automática";
  }

  private atualizarNotasViaTreeNodes(
    res: any,
    nodes: {
      ciclo: any;
      pilar: any;
      componente: any;
      plano: any;
      tipoNota: any;
    }
  ): void {
    const cicloNota = this.parseDecimal(res.cicloNota || "0");
    const pilarNota = this.parseDecimal(res.pilarNota || "0");
    const componenteNota = this.parseDecimal(res.componenteNota || "0");
    const planoNota = this.parseDecimal(res.planoNota || "0");
    const tipoNotaNota = this.parseDecimal(res.tipoNotaNota || "0");

    if (nodes.ciclo && !isNaN(cicloNota)) nodes.ciclo.grade = cicloNota;
    if (nodes.pilar && !isNaN(pilarNota)) nodes.pilar.grade = pilarNota;
    if (nodes.componente && !isNaN(componenteNota))
      nodes.componente.grade = componenteNota;
    if (nodes.plano && !isNaN(planoNota)) nodes.plano.grade = planoNota;
    if (nodes.tipoNota && !isNaN(tipoNotaNota))
      nodes.tipoNota.grade = tipoNotaNota;
  }
  private parseDecimal(valor: string | null | undefined): number {
    return parseFloat((valor || "0").replace(",", "."));
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.motivationInput?.nativeElement?.focus({ preventScroll: true });
    }, 200);
    this.evaluateAutomaticScoreForm?.get("motivation")?.markAsUntouched();
  }
}
