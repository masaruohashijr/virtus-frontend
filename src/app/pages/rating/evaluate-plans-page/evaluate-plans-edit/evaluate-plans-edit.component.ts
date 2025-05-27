import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { MotivarPesoPilarComponent } from "./../motivar-peso-pilar/motivar-peso-pilar.component";

import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
import { CurrentUser } from "src/app/domain/dto/current-user.dto";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { UserDTO } from "src/app/domain/dto/user.dto";
import { UsersService } from "src/app/services/administration/users.service";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { ProductItemDTO } from "./../../../../domain/dto/product-item.dto";
import {
  MotivarNotaComponent,
  MotivarNotaData,
} from "./../motivar-nota/motivar-nota.component";
import {
  MotivarPesoComponent,
  MotivarPesoData,
} from "./../motivar-peso/motivar-peso.component";
import { MensagemDialogComponent } from "./../mensagem/mensagem-dialog.component";

@Component({
  selector: "app-evaluate-plans-edit",
  templateUrl: "./evaluate-plans-edit.component.html",
  styleUrls: ["./evaluate-plans-edit.component.css"],
})
export class EvaluatePlansEditComponent implements OnInit {
  @Input() object!: EntityVirtusDTO;
  treeData: TreeNode[] = [];
  allUsers: UserDTO[] = [];
  modalMotivarNotaVisivel: boolean = false;

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
    private _usersService: UsersService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}
  dadosCarregando: boolean = true;
  currentUser: CurrentUser = this._usersService.getCurrentUser();
  curUserRole: string = this.currentUser?.role || "";
  ngOnInit(): void {
    this.carregarDados().then(() => {
      this.dadosCarregando = false;
    });
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

  onNotaChange(novaNota: number, object: ProductItemDTO) {
    if (this.dadosCarregando) return; // Ignora alterações automáticas na carga
    const dialogRef = this.dialog.open(MotivarPesoComponent, {
      width: "600px",
      data: object,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  async carregarDados(): Promise<void> {
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
              this.treeData = this.transformToTreeTableFormat(data);
            });
        }
      });
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    }
  }

  motivarNota(
    rowNode: TreeNode | undefined,
    notaAnterior: number,
    novaNota: number
  ): void {
    if (!rowNode?.data) {
      console.log("rowNode:", rowNode);
      if (rowNode) {
        console.log("rowNode.node:", (rowNode as any).node);
      }
      return;
    }
    const entidade = this.subirAtePorNode(rowNode, "Entidade");
    const ciclo = this.subirAtePorNode(rowNode, "Ciclo");
    const pilar = this.subirAtePorNode(rowNode, "Pilar");
    const tipoNota = this.subirAtePorNode(rowNode, "Tipo Nota");
    const plano = this.subirAtePorNode(rowNode, "Plano");
    const componente = this.subirAtePorNode(rowNode, "Componente");
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
        elemento: elemento?.data || "",
        notaAnterior: notaAnterior,
        novaNota: novaNota,
        texto: "",
      },
    });
  }

  justifyPillarWeight(
    rowNode: TreeNode,
    pesoAnterior: number,
    event: Event
  ): void {
    const novoPeso = (event.target as HTMLInputElement).value;
    const entidade = this.subirAtePorNode(rowNode, "Entidade");
    const ciclo = this.subirAtePorNode(rowNode, "Ciclo");
    const pilar = rowNode.node;
    const dialogRef = this.dialog.open(MotivarPesoPilarComponent, {
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
  }

  subirAtePorNode(node: TreeNode, tipo: string): TreeNode | null {
    let current: TreeNode | undefined = node.parent;
    while (current) {
      if (current.data.objectType === tipo) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  highlightChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    target.style.border = "2px solid red";
  }

  expandirTodos(): void {
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

  storePreviousWeight(rowData: any) {
    rowData.pesoAnterior = rowData.weight;
  }

  canEditWeight(rowData: any): boolean {
    const isSupervisor = rowData.supervisor?.id === this.currentUser?.id;
    const isChefe = this.curUserRole === "Chefe";
    const isAllowedPeriod = rowData.periodoPermitido;

    return (isSupervisor || isChefe) && isAllowedPeriod;
  }

  onWeightBlur(event: Event, rowNode: TreeNode, rowData: any): void {
    const input = event.target as HTMLInputElement;
    const novoPeso = Number(input.value);
    const pesoAnterior = Number(rowData.pesoAnterior);

    // Validação do valor inserido
    if (isNaN(novoPeso) || novoPeso <= 0 || novoPeso > 100) {
      const mensagem = "O peso deve ser um número entre 1 e 100.";

      this.dialog
        .open(MensagemDialogComponent, {
          width: "400px",
          data: { title: "Atenção", message: mensagem },
        })
        .afterClosed()
        .subscribe(() => {
          input.focus();
        });

      input.value = String(pesoAnterior);
      return;
    }

    // Temporariamente aplica o novo peso para cálculo da soma
    rowData.peso = novoPeso;

    const somaTotal = this.somarPesos(this.treeData);
    if (somaTotal > 100) {
      const mensagem = "A soma dos pesos dos pilares não pode ser superior a 100%.";
      this.dialog
        .open(MensagemDialogComponent, {
          width: "400px",
          data: { title: "Atenção", message: mensagem },
        })
        .afterClosed()
        .subscribe(() => {
          input.value = String(pesoAnterior);
          rowData.peso = pesoAnterior; // Reverte o peso para o anterior
          return;
        });
    }
    if (somaTotal < 100) {
      const mensagem = "A soma dos pesos dos pilares não deve ser inferior a 100%.";
      this.dialog
        .open(MensagemDialogComponent, {
          width: "400px",
          data: { title: "Atenção", message: mensagem },
        });
    }
    if (pesoAnterior !== novoPeso) {
      this.justifyPillarWeight(rowNode, pesoAnterior, event);
      rowData.pesoAnterior = novoPeso;
    }
  }

  canEditElementGrade(rowData: any): boolean {
    const isAuditorOrSupervisor =
      rowData.auditor?.id === this.currentUser.id ||
      rowData.supervisor?.id === this.currentUser.id;

    const isChief = this.curUserRole === "Chefe";
    const hasWeight = rowData.weight !== 0;
    const isWithinPeriod = rowData.periodoPermitido;

    return (isAuditorOrSupervisor || isChief) && hasWeight && isWithinPeriod;
  }

  canEditElementWeight(rowData: any) {
    const isSupervisor = rowData.supervisor?.id === this.currentUser.id;

    const isChief = this.curUserRole === "Chefe";
    const hasWeight = rowData.weight !== 0;
    const isWithinPeriod = rowData.periodoPermitido;

    return (isSupervisor || isChief) && hasWeight && isWithinPeriod;
  }

  motivarPeso(
    rowNode: TreeNode | undefined,
    pesoAnterior: number,
    novoPeso: number
  ): void {
    if (!rowNode?.data) {
      console.log("rowNode:", rowNode);
      if (rowNode) {
        console.log("rowNode.node:", (rowNode as any).node);
      }
      return;
    }
    const entidade = this.subirAtePorNode(rowNode, "Entidade");
    const ciclo = this.subirAtePorNode(rowNode, "Ciclo");
    const pilar = this.subirAtePorNode(rowNode, "Pilar");
    const tipoNota = this.subirAtePorNode(rowNode, "Tipo Nota");
    const plano = this.subirAtePorNode(rowNode, "Plano");
    const componente = this.subirAtePorNode(rowNode, "Componente");
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
        elemento: elemento?.data || "",
        pesoAnterior: pesoAnterior,
        novoPeso: novoPeso,
        texto: "",
      },
    });
  }

  checkSomaPesos(treeNodes: TreeNode[]): void {
    const somaTotal = this.somarPesos(treeNodes);
    if (somaTotal < 100) {
      this.dialog.open(MensagemDialogComponent, {
        width: "400px",
        data: {
          title: "Atenção",
          message: "A soma dos pesos dos pilares é inferior a 100%.",
        },
      });
    } else if (somaTotal > 100) {
      this.dialog.open(MensagemDialogComponent, {
        width: "400px",
        data: {
          title: "Atenção",
          message: "A soma dos pesos dos pilares é superior a 100%.",
        },
      });
    } else {
      this.dialog.open(MensagemDialogComponent, {
        width: "400px",
        data: {
          title: "Sucesso",
          message: "A soma dos pesos dos pilares está igual a 100%.",
        },
      });
    }
  }

  private somarPesos(treeNodes: TreeNode[]): number {
    let soma = 0;

    for (const node of treeNodes) {
      const data = node.data;

      if (data?.objectType === "Pilar") {
        const peso = Number(data.peso) || 0;
        soma += peso;
      }

      if (node.children && node.children.length > 0) {
        soma += this.somarPesos(node.children); // Continua buscando pilares nos filhos
      }
    }

    return soma;
  }
}
