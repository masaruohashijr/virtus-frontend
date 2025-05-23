import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { HttpClient } from "@angular/common/http";

import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
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
import { CurrentUser } from "src/app/domain/dto/current-user.dto";

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
  currentUser: CurrentUser | undefined;
  curUserRole: any;

  constructor(
    private _service: EvaluatePlansService,
    private _usersService: UsersService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}
  dadosCarregando: boolean = true;
  ngOnInit(): void {
    this.carregarDados().then(() => {
      this.dadosCarregando = false;
    });
  }

  openMotivacaoNota(rowData: any, novaNota: number): void {
    const dialogRef = this.dialog.open(MotivarNotaComponent, {
      width: "600px",
      data: {
        entidade: rowData.entidade || "",
        ciclo: rowData.ciclo || "",
        plano: rowData.plano || "",
        tipoNota: rowData.tipoNota || "",
        elemento: rowData.elemento || "",
        notaAnterior: rowData.notaAnterior || null,
        novaNota: novaNota || null,
        currentUser: this._usersService.getCurrentUser(),
        curUserRole: this._usersService.getCurrentUser().role,        
        texto: "",
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.salvarMotivacaoNota(resultado);
      }
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
    const dialogRef = this.dialog.open(MotivarNotaComponent, {
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
    // Borda vermelha no campo de nota (select) após abrir o diálogo
    // Aguarda o DOM estar renderizado
    setTimeout(() => {
      const selects = document.querySelectorAll("select.grade-select");

      selects.forEach((select) => {
        // Adiciona ouvinte de evento para mudança no select
        select.addEventListener("change", (event: Event) => {
          // Aplica borda vermelha apenas no select alterado
          (event.target as HTMLElement).style.border = "2px solid red";
        });
      });
    }, 300);

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        const user = this._usersService.getCurrentUser();
        alert("Usuário corrente: " + user.id + " - " + user.name);
        this.salvarMotivacaoNota(resultado);
      }
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

  sinalizarAlteracao(event: Event) {
    const target = event.target as HTMLSelectElement;
    target.style.textAlign = "center";
    target.style.width = target.style.width || "100%";
    target.style.border = "1px solid red";
  }

  salvarMotivacaoNota(dadosMotivacao: any) {
    console.log("Motivação recebida:", dadosMotivacao);
    this.http.post("/api/grade-changes", dadosMotivacao).subscribe({
      next: (res: any) => console.log("Nota salva com sucesso", res),
      error: (err: any) => console.error("Erro ao salvar nota:", err),
    });
    this.modalMotivarNotaVisivel = false;
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
}
