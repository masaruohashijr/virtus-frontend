import { Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";
import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansTreeNode } from "src/app/domain/dto/eveluate-plans-tree-node";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { UserDTO } from "src/app/domain/dto/user.dto";
import { UsersService } from "src/app/services/administration/users.service";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { MotivarNotaData } from "./../motivar-nota/motivar-nota.component";

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

  constructor(
    private _service: EvaluatePlansService,
    private _usersService: UsersService
  ) {}

  ngOnInit(): void {
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
            this.collapseAllNodes();
          });
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

  onNotaChange(event: Event, rowNode: TreeNode): void {
    const select = event.target as HTMLSelectElement;
    const novaNota = Number(select.value);
    if (!rowNode.data.gradeOriginal) {
      rowNode.data.gradeOriginal = rowNode.data.grade;
    }
    const notaAnterior = rowNode.data.gradeOriginal;

    select.style.textAlign = "center";
    select.style.border = "1px solid red";

    if (novaNota !== notaAnterior) {
      this.motivarNota(rowNode, notaAnterior, novaNota);
    }
  }

  motivarNota(rowNode: TreeNode, notaAnterior: number, novaNota: number): void {
    const entidade = this.subirAtePorNode(rowNode, "Entidade");
    const ciclo = this.subirAtePorNode(rowNode, "Ciclo");
    const pilar = this.subirAtePorNode(rowNode, "Pilar");
    const plano = this.subirAtePorNode(rowNode, "Plano");
    const componente = this.subirAtePorNode(rowNode, "Componente");
    const tipoNota = this.subirAtePorNode(rowNode, "TipoNota");

    this.motivarNotaData = {
      entidade: entidade?.data.name || "",
      ciclo: ciclo?.data.name || "",
      pilar: pilar?.data.name || "",
      plano: plano?.data.name || "",
      componente: componente?.data.name || "",
      tipoNota: tipoNota?.data.name || "",
      elemento: rowNode.data.name || "",
      notaAnterior,
      novaNota,
      texto: "",
    };

    this.modalMotivarNotaVisivel = true;
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

  salvarMotivacaoNota(dados: any) {
    console.log("Salvando nota com motivação:", dados);
    // Aqui você pode chamar um serviço, ou aplicar a lógica de atualização
  }

  private getAncestorName(rowData: any, tipo: string): string | null {
    let current = rowData;
    while (current && current.parent) {
      current = current.parent.data;
      if (current.objectType === tipo) {
        return current.name;
      }
    }
    return null;
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
