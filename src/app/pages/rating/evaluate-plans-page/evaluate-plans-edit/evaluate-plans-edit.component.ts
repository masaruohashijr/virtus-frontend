import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TreeNode } from "primeng/api";
import { TreeTableModule } from "primeng/treetable";
import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
import { CurrentUser } from "src/app/domain/dto/current-user.dto";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";
import { ProductComponentHistoryDTO } from "src/app/domain/dto/product-component-history.dto";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { ProductElementHistoryDTO } from "src/app/domain/dto/product-element-history.dto";
import { ProductPillarHistoryDTO } from "src/app/domain/dto/product-pillar-history.dto";
import { ProductPlanHistoryDTO } from "src/app/domain/dto/product-plan-history.dto";
import { UserDTO } from "src/app/domain/dto/user.dto";
import { UsersService } from "src/app/services/administration/users.service";
import { ProductComponentHistoryService } from "src/app/services/coordination/product-component-history.service";
import { ProductElementHistoryService } from "src/app/services/coordination/product-element-history.service";
import { ProductPillarHistoryService } from "src/app/services/coordination/product-pillar-history.service";
import { ProductPlanHistoryService } from "src/app/services/coordination/product-plan-history.service";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { PlainMessageDialogComponent } from "../../../administration/plain-message/plain-message-dialog.component";
import { ComponentChangeHistoryComponent } from "../component-change-history/component-change-history.component";
import { ElementChangeHistoryComponent } from "../element-change-history/element-change-history.component";
import { EvaluateAutomaticScoreComponent } from "../evaluate-automatic-score/evaluate-automatic-score.component";
import { JustifyPillarWeightComponent } from "../justify-pillar-weight/justify-pillar-weight.component";
import { PlanChangeHistoryComponent } from "../plan-change-history/plan-change-history.component";
import { ShowDescriptionComponent } from "../show-description/show-description.component";
import { AnalyzeTierComponent } from "./../analyze-tier/analyze-tier.component";
import {
  MotivarNotaComponent,
  MotivarNotaData,
} from "./../motivar-nota/motivar-nota.component";
import { MotivarPesoComponent } from "./../motivar-peso/motivar-peso.component";
import { PillarChangeHistoryComponent } from "./../pillar-change-history/pillar-change-history.component";
@Component({
  selector: 'app-evaluate-plans-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,            // para [(ngModel)]
    ReactiveFormsModule,    // para [formGroup]
    MatFormFieldModule,     // <mat-form-field>
    MatInputModule,         // matInput
    MatIconModule,          // <mat-icon>
    MatTooltipModule,       // [matTooltip]
    MatButtonModule,        // mat-button (se usar)
    TreeTableModule,        // PrimeNG TreeTable, se usado no template
  ],
  templateUrl: './evaluate-plans-edit.component.html',
  styleUrls: ['./evaluate-plans-edit.component.css'],
})

export class EvaluatePlansEditComponent implements OnInit {
  @ViewChild("gradeField", { static: true }) gradeField!: ElementRef; // Garantir que seja ElementRef

  @Input() object!: EntityVirtusDTO;
  treeData: TreeNode[] = [];
  treeDataOriginal: TreeNode[] = [];
  allUsers: UserDTO[] = [];
  modalMotivarNotaVisivel: boolean = false;
  pilarPesoAnteriorMap = new Map<number, number>();

  motivarNotaData: MotivarNotaData = {
    entidade: "",
    ciclo: "",
    pilar: "",
    plano: "",
    componente: "",
    tipoNota: "",
    elemento: "",
    notaAnterior: null,
    novaNota: null,
    texto: "",
  };
  notaPendente: { rowNode: TreeNode; novaNota: number } | null = null;
  cicloNota: any;
  elementoPeso: any;

  constructor(
    private _service: EvaluatePlansService,
    private _productPillarHistoryService: ProductPillarHistoryService,
    private _productComponentHistoryService: ProductComponentHistoryService,
    private _productPlanHistoryService: ProductPlanHistoryService,
    private _productElementHistoryService: ProductElementHistoryService,
    @Inject(MatDialog) private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService
  ) {}
  dadosCarregando: boolean = true;
  currentUser: CurrentUser = this._usersService.getCurrentUser();
  curUserRole: string = this.currentUser?.role || "";
  searchForm = this._formBuilder.group({
    filterValue: [""],
  });

  filterControl = this.searchForm.get("filterValue");

  ngOnInit(): void {
    this.carregarDados().then(() => {
      this.dadosCarregando = false;
    });
    this.filterControl?.valueChanges.subscribe((termo: string | null) => {
      if (!termo) {
        this.treeData = [...this.treeDataOriginal]; // Sem filtro, restaura tudo
      } else {
        this.treeData = this.applyFilter(
          this.treeDataOriginal,
          termo.toLowerCase()
        );
      }
    });
  }

  private applyFilter(nodes: TreeNode[], term: string): TreeNode[] {
    return nodes
      .map((node) => {
        const nome = (node.data?.name || "").toLowerCase();
        const nivel = (node.data?.objectType || "").toLowerCase();
        const auditor = (node.data?.auditor?.name || "").toLowerCase();
        const supervisor = (node.data?.supervisor?.name || "").toLowerCase();

        const corresponde =
          nome.includes(term) ||
          nivel.includes(term) ||
          auditor.includes(term) ||
          supervisor.includes(term);

        const filhosFiltrados = node.children
          ? this.applyFilter(node.children, term)
          : [];

        if (corresponde || filhosFiltrados.length > 0) {
          return {
            ...node,
            children: filhosFiltrados ?? [],
            expanded: true,
          } as TreeNode;
        }

        return null;
      })
      .filter((n): n is TreeNode => n !== null);
  }

  openMotivacaoNota(rowData: any, novaNota: number): void {
    const dialogRef = this.dialog.open(MotivarPesoComponent, {
      width: "600px",
      data: {
        entidade: rowData.entidade || "",
        ciclo: rowData.ciclo || "",
        plano: rowData.plano || "",
        tipoNota: rowData.tipoNota || "",
        elemento: rowData.elemento || "",
        notaAnterior: rowData.notaAnterior || null,
        novaNota: novaNota || null,
        currentUser: this.currentUser,
        curUserRole: this.currentUser?.role,
        texto: "",
      },
    });
  }

  setAuditor(item: ProductComponentDTO, auditor: AuditorDTO) {
    console.log(item);
    //const index = this.products.findIndex(product => product.id === item.id);
    //if (index !== -1) {
    //  this.products[index].auditor = auditor;
    //}
  }

  compareAuditors(a1: AuditorDTO, a2: AuditorDTO): boolean {
    return a1 && a2 ? a1.userId === a2.userId : a1 === a2;
  }

  transformToTreeTableFormat(
    nodes: EvaluatePlansTreeNode[],
    parent: TreeNode | null = null
  ): TreeNode[] {
    return nodes.map((node) => {
      {
        const treeNode: TreeNode = {
          data: {
            id: node.id,
            name: node.name,
            objectType: node.type,
            object: node,
            key: `${node.type}-${node.id}`,
            supervisor:
              this.allUsers.find((user) => user.id === node.supervisorId) ||
              null,
            auditor:
              this.allUsers.find((user) => user.id === node.auditorId) || null,
            gradeTypeId: node.gradeTypeId,
            weight: node.weight,
            letter: node.letter,
            grade: node.grade,
            gradeOriginal: node.grade,
            periodoPermitido: node.periodoPermitido,
            periodoCiclo: node.periodoCiclo,
            cicloAnalisado: node.cicloAnalisado,
            pilarAnalisado: node.pilarAnalisado,
            componenteAnalisado: node.componenteAnalisado,
            planoAnalisado: node.planoAnalisado,
            tipoNotaAnalisado: node.tipoNotaAnalisado,
            elementoAnalisado: node.elementoAnalisado,
            itemAnalisado: node.itemAnalisado,
            cicloDescrito: node.cicloDescrito,
            pilarDescrito: node.pilarDescrito,
            componenteDescrito: node.componenteDescrito,
            planoDescrito: node.planoDescrito,
            tipoNotaDescrito: node.tipoNotaDescrito,
            elementoDescrito: node.elementoDescrito,
            itemDescrito: node.itemDescrito,
            iniciaEm: node.iniciaEm,
            terminaEm: node.terminaEm,
          },
          children: node.children
            ? this.transformToTreeTableFormat(node.children)
            : [],
          expanded: true,
          parent: parent || undefined,
        };
        if (treeNode.children) {
          treeNode.children.forEach((child) => (child.parent = treeNode));
        }
        return treeNode;
      }
    });
  }
  collapseAllNodes() {
    this.collapseRecursive(this.treeData);
  }

  private collapseRecursive(nodes: TreeNode[] | undefined) {
    if (!nodes) return;
    for (const node of nodes) {
      node.expanded = false;
      if (node.children && node.children.length > 0) {
        this.collapseRecursive(node.children);
      }
    }
  }

  private async carregarDados(): Promise<void> {
    try {
      this.treeData.forEach((node) => {
        if (node.data.objectType === "Elemento") {
          node.data.gradeOriginal = node.data.grade;
        }
      });
      this._usersService.getAll("", 0, 1000).subscribe((resp) => {
        this.allUsers = resp.content;
        if (this.object.cycleSelected) {
          this._service
            .getEvaluatePlansTreeByEntityAndCycleId(
              this.object.id,
              this.object.cycleSelected.id
            )
            .subscribe((data) => {
              console.log("Dados recebidos:", data);
              this.treeData = this.transformToTreeTableFormat(data);
              this.treeDataOriginal = [...this.treeData]; // <- salva a estrutura original
            });
        }
      });
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    }
  }

  private justifyGrade(
    rowNode: TreeNode | undefined,
    notaAnterior: number,
    novaNota: number
  ): void {
    if (!rowNode?.data) {
      console.log("rowNode:", rowNode);
      if (rowNode) {
        console.log("rowNode.node:", (rowNode as any).node);
      }
    }
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode ? this.subirAtePorNode(rowNode, "Pilar") : null;
    const tipoNota = rowNode
      ? this.subirAtePorNode(rowNode, "Tipo Nota")
      : null;
    const plano = rowNode ? this.subirAtePorNode(rowNode, "Plano") : null;
    const componente = rowNode
      ? this.subirAtePorNode(rowNode, "Componente")
      : null;
    const elemento = rowNode;

    const dialogRef = this.dialog.open(MotivarNotaComponent, {
      width: "1000px",
      data: {
        rowNode: rowNode,
        entidade: entidade?.data || "",
        ciclo: ciclo?.data || "",
        pilar: pilar?.data || "",
        plano: plano?.data || "",
        componente: componente?.data || "",
        tipoNota: tipoNota?.data || "",
        elemento: elemento?.node?.data || "",
        notaAnterior: notaAnterior,
        novaNota: novaNota,
        texto: "",
      },
    });
  }

  private justifyPillarWeight(rowNode: TreeNode, event: Event): void {
    const novoPeso = (event.target as HTMLInputElement).value;
    const entidade = this.subirAtePorNode(rowNode, "Entidade");
    const ciclo = this.subirAtePorNode(rowNode, "Ciclo");
    const pilar = rowNode.node;
    const pesoAnterior = pilar?.data.weight;
    const dialogRef = this.dialog.open(JustifyPillarWeightComponent, {
      width: "1000px",
      data: {
        rowNode: rowNode,
        entidade: entidade?.data || "",
        ciclo: ciclo?.data || "",
        pilar: pilar?.data || "",
        pesoAnterior: pesoAnterior,
        novoPeso: novoPeso,
        texto: "",
      },
    });
    dialogRef.afterClosed().subscribe((foiSalvo: boolean) => {
      if (foiSalvo) {
        rowNode.data.peso = novoPeso;
        rowNode.data.weight = novoPeso;
        (event.target as HTMLInputElement).value = String(novoPeso);
      } else {
        (event.target as HTMLInputElement).value = String(rowNode.data.weight);
      }
    });
  }

  private subirAtePorNode(node: TreeNode, tipo: string): TreeNode | null {
    let current: TreeNode | undefined = node.parent;
    while (current) {
      if (current.data.objectType === tipo) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  public highlightChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    target.style.border = "2px solid red";
  }

  public expandirTodos(): void {
    this.expandirRecursivo(this.treeData);
  }

  private expandirRecursivo(nodes: TreeNode[]): void {
    for (const node of nodes) {
      node.expanded = true;
      if (node.children && node.children.length > 0) {
        this.expandirRecursivo(node.children);
      }
    }
  }

  public canEditPillarWeight(rowData: any): boolean {
    const isSupervisor = rowData.supervisor?.id === this.currentUser?.id;
    const isChefe = this.curUserRole === "Chefe";
    const isAllowedPeriod = rowData.periodoCiclo;

    return (isSupervisor || isChefe) && isAllowedPeriod;
  }

  public onPillarWeightBlur(
    event: Event,
    rowNode: TreeNode,
    rowData: any
  ): void {
    const input = event.target as HTMLInputElement;
    const novoPeso = Number(input.value);
    const pesoAnterior = rowData.peso || 0;
    // Validação do valor inserido
    if (isNaN(novoPeso) || novoPeso <= 0 || novoPeso > 100) {
      const mensagem = "O peso deve ser um número entre 1 e 100.";

      this.dialog
        .open(PlainMessageDialogComponent, {
          width: "400px",
          data: { title: "Atenção", message: mensagem },
        })
        .afterClosed()
        .subscribe(() => {
          input.focus();
        });

      return;
    }

    // Temporariamente aplica o novo peso para cálculo da soma
    rowData.peso = novoPeso;

    const somaTotal = this.somarPesos(this.treeData);
    if (somaTotal > 100) {
      const mensagem =
        "A soma dos pesos dos pilares não pode ser superior a 100%.";
      this.dialog
        .open(PlainMessageDialogComponent, {
          width: "400px",
          data: { title: "Atenção", message: mensagem },
        })
        .afterClosed()
        .subscribe(() => {
          return;
        });
    }
    if (somaTotal < 100) {
      const mensagem =
        "A soma dos pesos dos pilares deve totalizar exatamente 100%.";
      this.dialog.open(PlainMessageDialogComponent, {
        width: "400px",
        data: { title: "Atenção", message: mensagem },
      });
    }
    if (pesoAnterior != novoPeso) {
      this.justifyPillarWeight(rowNode, event);
    }
  }

  public canEditElementGrade(rowData: any): boolean {
    const isAuditorOrSupervisor =
      rowData.auditor?.id === this.currentUser.id ||
      rowData.supervisor?.id === this.currentUser.id;

    const isChief = this.curUserRole === "Chefe";
    const hasWeight = rowData.weight !== 0;
    const isWithinPeriod = rowData.periodoPermitido;

    return (isAuditorOrSupervisor || isChief) && hasWeight && isWithinPeriod;
  }

  public canEditElementWeight(rowData: any) {
    const isSupervisor = rowData.supervisor?.id === this.currentUser.id;

    const isChief = this.curUserRole === "Chefe";
    const hasWeight = rowData.weight !== 0;
    const isWithinPeriod = rowData.periodoPermitido;

    return (isSupervisor || isChief) && hasWeight && isWithinPeriod;
  }

  private justifyWeight(
    rowNode: TreeNode | undefined,
    pesoAnterior: number,
    novoPeso: number
  ): void {
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode ? this.subirAtePorNode(rowNode, "Pilar") : null;
    const tipoNota = rowNode
      ? this.subirAtePorNode(rowNode, "Tipo Nota")
      : null;
    const plano = rowNode ? this.subirAtePorNode(rowNode, "Plano") : null;
    const componente = rowNode
      ? this.subirAtePorNode(rowNode, "Componente")
      : null;
    const elemento = rowNode;

    const dialogRef = this.dialog.open(MotivarPesoComponent, {
      width: "1000px",
      data: {
        rowNode: rowNode,
        entidade: entidade?.data || "",
        ciclo: ciclo?.data || "",
        pilar: pilar?.data || "",
        plano: plano?.data || "",
        componente: componente?.data || "",
        tipoNota: tipoNota?.data || "",
        elemento: elemento?.node?.data || "",
        pesoAnterior: pesoAnterior,
        novoPeso: novoPeso,
        texto: "",
      },
    });
  }

  private somarPesos(treeNodes: TreeNode[]): number {
    let soma = 0;

    for (const node of treeNodes) {
      const data = node.data;

      if (data?.objectType === "Pilar") {
        this.pilarPesoAnteriorMap.set(data.id, data.weight);
        const peso = Number(data.peso) || 0;
        soma += peso;
      }

      if (node.children && node.children.length > 0) {
        soma += this.somarPesos(node.children); // Continua buscando pilares nos filhos
      }
    }

    return soma;
  }
  public storePreviousGrade(rowData: any) {
    rowData.pesoAnterior = rowData.weight;
  }

  public onGradeChange(
    novaNota: number,
    rowNode: TreeNode,
    rowData: any
  ): void {
    const notaAnterior = Number(rowData.grade);

    rowData.nota = novaNota;

    if (notaAnterior !== novaNota) {
      rowData.notaAnterior = novaNota;
      rowData.grade = novaNota;
      this.justifyGrade(rowNode, notaAnterior, novaNota);
    }
  }

  public storePreviousWeight(rowData: any) {
    rowData.pesoAnterior = rowData.weight;
  }

  public onWeightChange(
    novoPeso: number,
    rowNode: TreeNode,
    rowData: any
  ): void {
    const pesoAnterior = Number(rowData.weight);

    rowData.weight = novoPeso;

    if (pesoAnterior !== novoPeso) {
      rowData.notaAnterior = novoPeso;
      rowData.weight = novoPeso;
      this.justifyWeight(rowNode, pesoAnterior, novoPeso);
    }
  }

  onProductPillarHistoryClick(rowNode: any): void {
    // Retrieve required IDs from the node hierarchy
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = rowNode.node;

    const entidadeId = entidadeNode?.data?.id;
    const cicloId = cicloNode?.data?.id;
    const pilarId = pilarNode?.data?.id;
    this._productPillarHistoryService
      .getHistory(entidadeId, cicloId, pilarId)
      .subscribe((logs) => {
        this.showPillarChangeHistory(rowNode, logs);
      });
  }

  showPillarChangeHistory(rowNode: any, logs: ProductPillarHistoryDTO[]) {
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode?.node;
    const dialogRef = this.dialog.open(PillarChangeHistoryComponent, {
      width: "1000px",
      height: "90%",
      data: {
        entidade: entidade || "",
        ciclo: ciclo || "",
        pilar: pilar || "",
        peso: rowNode.node.data.weight || null,
        pesoAnterior: rowNode.node.data.pesoAnterior || null,
        nota: rowNode.node.data.grade || null,
        notaAnterior: rowNode.node.data.notaAnterior || null,
        historicoDataSource: logs,
        metodo: rowNode.node.data.idTipoPontuacao || null,
      },
    });
  }

  onAnalysisButtonClick(rowNode: any): void {
    const LEVEL_ID = rowNode?.node?.data?.id;
    const objectType = rowNode?.node?.data?.objectType;
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");

    let cicloNode: any =
      objectType === "Ciclo"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Ciclo");
    let pilarNode: any =
      objectType === "Pilar"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Pilar");
    let componenteNode: any =
      objectType === "Componente"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Componente");
    let planoNode: any =
      objectType === "Plano"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Plano");
    let tipoNotaNode: any =
      objectType === "Tipo Nota"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Tipo Nota");
    let elementoNode: any =
      objectType === "Elemento"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Elemento");
    let itemNode: any =
      objectType === "Item"
        ? rowNode?.node
        : this.subirAtePorNode(rowNode, "Item");

    const grade = rowNode?.node?.data?.grade;
    const weight = rowNode?.node?.data?.weight;

    if (!LEVEL_ID || !objectType) {
      console.warn("ID ou objectType ausente:", { LEVEL_ID, objectType });
      return;
    }

    this._service
      .getAnalysis(
        objectType,
        entidadeNode?.data.id,
        cicloNode?.data?.id,
        pilarNode?.data?.id,
        componenteNode?.data?.id,
        planoNode?.data?.id,
        tipoNotaNode?.data?.id,
        elementoNode?.data?.id,
        itemNode?.data?.id
      )
      .subscribe({
        next: (response) => {
          const analysis = response.analysis;

          const dialogRef = this.dialog.open(AnalyzeTierComponent, {
            width: "1000px",
            data: {
              objectType: objectType,
              analysis: analysis,
              entidade: entidadeNode?.data || null,
              ciclo: cicloNode?.data || null,
              pilar: pilarNode?.data || null,
              componente: componenteNode?.data || null,
              plano: planoNode?.data || null,
              tipoNota: tipoNotaNode?.data || null,
              elemento: elementoNode?.data || null,
              item: itemNode?.data || null,
              grade: grade || null,
              weight: weight || null,
            },
          });

          // OUVIR evento de sucesso após salvar
          dialogRef.componentInstance.onSave.subscribe(() => {
            // Atualiza o flag "analisado" visualmente
            const analysisValue =
              dialogRef.componentInstance.analyzeTierForm?.get("analysis")
                ?.value || "";
            const isFilled = analysisValue?.trim().length > 0;
            if (objectType === "Ciclo") {
              rowNode.node.data.cicloAnalisado = isFilled;
            } else if (objectType === "Pilar") {
              rowNode.node.data.pilarAnalisado = isFilled;
            } else if (objectType === "Componente") {
              rowNode.node.data.componenteAnalisado = isFilled;
            } else if (objectType === "Plano") {
              rowNode.node.data.planoAnalisado = isFilled;
            } else if (objectType === "Tipo Nota") {
              rowNode.node.data.tipoNotaAnalisado = isFilled;
            } else if (objectType === "Elemento") {
              rowNode.node.data.elementoAnalisado = isFilled;
            } else if (objectType === "Item") {
              rowNode.node.data.itemAnalisado = isFilled;
            }
          });
        },
        error: (err) => {
          console.error("Erro ao carregar a análise:", err);
          this.dialog.open(AnalyzeTierComponent, {
            width: "500px",
            data: { analysis: "Erro ao carregar a análise." },
          });
        },
      });
  }

  onDescriptionButtonClick(rowNode: any): void {
    const LEVEL_ID = rowNode?.node?.data?.id;
    const objectType = rowNode?.node?.data?.objectType;
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    let pilarNode: any = null;
    if (objectType === "Pilar") {
      pilarNode = rowNode?.node;
    } else {
      pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    }
    let componenteNode: any = null;
    if (objectType === "Componente") {
      componenteNode = rowNode?.node;
    } else {
      componenteNode = this.subirAtePorNode(rowNode, "Componente");
    }
    let planoNode: any = null;
    if (objectType === "Plano") {
      planoNode = rowNode?.node;
    } else {
      planoNode = this.subirAtePorNode(rowNode, "Plano");
    }
    let tipoNotaNode: any = null;
    if (objectType === "Tipo Nota") {
      tipoNotaNode = rowNode?.node;
    } else {
      tipoNotaNode = this.subirAtePorNode(rowNode, "Tipo Nota");
    }
    let elementoNode: any = null;
    if (objectType === "Elemento") {
      elementoNode = rowNode?.node;
    } else {
      elementoNode = this.subirAtePorNode(rowNode, "Elemento");
    }
    let itemNode: any = null;
    if (objectType === "Item") {
      itemNode = rowNode?.node;
    } else {
      itemNode = this.subirAtePorNode(rowNode, "Item");
    }
    const grade = rowNode?.node?.data?.grade;
    const weight = rowNode?.node?.data?.weight;
    if (!LEVEL_ID || !objectType) {
      console.warn("ID ou objectType ausente:", { LEVEL_ID, objectType });
      return;
    }

    this._service.getDescription(LEVEL_ID, objectType).subscribe({
      next: (response) => {
        const description = response.description;
        this.dialog.open(ShowDescriptionComponent, {
          width: "1000px",
          data: {
            id: LEVEL_ID,
            objectType: objectType,
            description: description,
            entidade: entidadeNode?.data || null,
            ciclo: cicloNode?.data || null,
            pilar: pilarNode?.data || null,
            componente: componenteNode?.data || null,
            plano: planoNode?.data || null,
            tipoNota: tipoNotaNode?.data || null,
            elemento: elementoNode?.data || null,
            item: itemNode?.data || null,
            grade: grade || null,
            weight: weight || null,
          },
        });
      },
      error: (err) => {
        console.error("Erro ao carregar descrição:", err);
        this.dialog.open(ShowDescriptionComponent, {
          width: "500px",
          data: { description: "Erro ao carregar descrição." },
        });
      },
    });
  }

  onProductComponentHistoryClick(rowNode: any): void {
    // Retrieve required IDs from the node hierarchy
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = rowNode.node;

    const entidadeId = entidadeNode?.data?.id;
    const cicloId = cicloNode?.data?.id;
    const pilarId = pilarNode?.data?.id;
    const componentId = componentNode?.data?.id;
    this._productComponentHistoryService
      .getHistory(entidadeId, cicloId, pilarId, componentId)
      .subscribe((dtoHistory) => {
        this.showComponentChangeHistory(rowNode, dtoHistory);
      });
  }

  showComponentChangeHistory(
    rowNode: any,
    dtoHistory: ProductComponentHistoryDTO[]
  ) {
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode ? this.subirAtePorNode(rowNode, "Pilar") : null;
    const componente = rowNode?.node;
    const dialogRef = this.dialog.open(ComponentChangeHistoryComponent, {
      width: "1000px",
      height: "600px",
      data: {
        entidade: entidade || "",
        ciclo: ciclo || "",
        pilar: pilar || "",
        componente: componente || "",
        peso: rowNode.node.data.weight || null,
        nota: rowNode.node.data.grade || null,
        historicoDataSource: dtoHistory,
      },
    });
  }

  onProductElementHistoryClick(rowNode: any): void {
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = this.subirAtePorNode(rowNode, "Componente");
    const planNode = this.subirAtePorNode(rowNode, "Plano");
    const elementNode = rowNode.node;

    const entidadeId = entidadeNode?.data?.id;
    const cicloId = cicloNode?.data?.id;
    const pilarId = pilarNode?.data?.id;
    const componenteId = componentNode?.data?.id;
    const planoId = planNode?.data?.id;
    const elementoId = elementNode?.data?.id;
    this._productElementHistoryService
      .getHistory(
        entidadeId,
        cicloId,
        pilarId,
        componenteId,
        planoId,
        elementoId
      )
      .subscribe((dtoHistory) => {
        this.showElementChangeHistory(rowNode, dtoHistory);
      });
  }

  showElementChangeHistory(
    rowNode: any,
    dtoHistory: ProductElementHistoryDTO[]
  ) {
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode ? this.subirAtePorNode(rowNode, "Pilar") : null;
    const componente = rowNode
      ? this.subirAtePorNode(rowNode, "Componente")
      : null;
    const plano = rowNode ? this.subirAtePorNode(rowNode, "Plano") : null;
    const tipoNota = rowNode
      ? this.subirAtePorNode(rowNode, "Tipo Nota")
      : null;
    const elemento = rowNode?.node;
    const dialogRef = this.dialog.open(ElementChangeHistoryComponent, {
      width: "1000px",
      height: "750px",
      data: {
        entidade: entidade || "",
        ciclo: ciclo || "",
        pilar: pilar || "",
        componente: componente || "",
        plano: plano || "",
        tipoNota: tipoNota || "",
        elemento: elemento || "",
        peso: rowNode.node.data.weight || null,
        nota: rowNode.node.data.grade || null,
        historicoDataSource: dtoHistory,
      },
    });
  }

  // Quem pode realizar uma Análise?
  // A Análise de qualquer nível (Ciclo, Pilar, Componente, etc.) somente poderá ser realizada se atender a todos os critérios abaixo:
  //
  // 1 - Ser Auditor ou o Supervisor responsável por esse nível e o período de avaliação estiver permitido
  // OU
  // 2 - Ser Chefe e o período do ciclo estiver permitido.
  // Além disso:
  //
  // 3 - Sempre deve haver um peso para o item do nível que não pode ser igual a zero.
  //
  // Exemplo de bloqueio:
  // Mesmo que o usuário seja Auditor, não conseguirá analisar se o item tiver peso 0 ou estiver fora do período de avaliação permitido.
  // Mesmo que o usuário seja Chefe só poderá alterar a análise, se estiver dentro do período do ciclo.
  canAnalyseTier(rowData: any) {
    const isAuditorOrSupervisor =
      rowData.auditor?.id === this.currentUser.id ||
      rowData.supervisor?.id === this.currentUser.id;

    const isChief = this.curUserRole === "Chefe";
    const hasWeight = rowData.weight !== 0;
    const isWithinPeriod = rowData.periodoPermitido;
    const isCyclePeriod = rowData.periodoCiclo;
    const resultado =
      ((isAuditorOrSupervisor && isWithinPeriod) ||
        (isChief && isCyclePeriod)) &&
      hasWeight;
    return resultado;
  }

  onEvaluateAutomaticScoreButtonClick(rowNode: any) {
    // Retrieve required IDs from the node hierarchy
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = this.subirAtePorNode(rowNode, "Componente");
    const planNode = rowNode.node;

    const dialogRef = this.dialog.open(EvaluateAutomaticScoreComponent, {
      width: "1000px", // Largura do diálogo
      data: {
        originalGrade: rowNode?.node?.data?.grade,
        grade: rowNode?.node?.data?.grade,
        weight: rowNode?.node?.data?.weight,
        entity: entidadeNode?.data, // Entidade
        cycle: cicloNode?.data, // Ciclo
        pillar: pilarNode?.data, // Pilar
        component: componentNode?.data, // Componente
        plan: planNode?.data, // Plano
      },
    });

    // Fecha o diálogo após ser fechado
    dialogRef.afterClosed().subscribe((result) => {
      console.log("O diálogo foi fechado");
    });
  }

  onProductPlanHistoryClick(rowNode: any): void {
    // Recupera os IDs necessários a partir da hierarquia do nó
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componenteNode = this.subirAtePorNode(rowNode, "Componente");
    const planoNode = rowNode.node;

    // Extraí os IDs de cada nível
    const entidadeId = entidadeNode?.data?.id;
    const cicloId = cicloNode?.data?.id;
    const pilarId = pilarNode?.data?.id;
    const componenteId = componenteNode?.data?.id;
    const planoId = planoNode?.data?.id;

    // Chama o serviço para buscar os históricos do plano
    this._productPlanHistoryService
      .getHistory(entidadeId, cicloId, pilarId, componenteId, planoId)
      .subscribe((logs) => {
        // Exibe os históricos de alteração em um modal ou componente
        this.showPlanChangeHistory(rowNode, logs);
      });
  }

  showPlanChangeHistory(rowNode: any, logs: ProductPlanHistoryDTO[]): void {
    // Recupera os dados necessários da hierarquia do nó
    const entidade = rowNode ? this.subirAtePorNode(rowNode, "Entidade") : null;
    const ciclo = rowNode ? this.subirAtePorNode(rowNode, "Ciclo") : null;
    const pilar = rowNode ? this.subirAtePorNode(rowNode, "Pilar") : null;
    const componente = rowNode
      ? this.subirAtePorNode(rowNode, "Componente")
      : null;
    const plano = rowNode?.node;

    // Abre o diálogo com os detalhes do histórico
    const dialogRef = this.dialog.open(PlanChangeHistoryComponent, {
      width: "1000px",
      height: "90%",
      data: {
        entidade: entidade || "",
        ciclo: ciclo || "",
        pilar: pilar || "",
        componente: componente || "",
        plano: plano || "",
        peso: rowNode.node.data.weight || null,
        pesoAnterior: rowNode.node.data.pesoAnterior || null,
        nota: rowNode.node.data.grade || null,
        notaAnterior: rowNode.node.data.notaAnterior || null,
        historicoDataSource: logs,
        metodo: rowNode.node.data.idTipoPontuacao || null,
      },
    });
  }
}
