import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { catchError, tap, throwError } from "rxjs";
import { AlertDialogComponent } from "src/app/components/dialog/alert-dialog/alert-dialog.component";
import { AuditorDTO } from "src/app/domain/dto/auditor.dto";
import { DistributeActivitiesDTO } from "src/app/domain/dto/distribute-activities-dto";
import { DistributeActivitiesTreeDTO } from "src/app/domain/dto/distribute-activities-tree-dto";
import { ProductComponentHistoryDTO } from "src/app/domain/dto/product-component-history.dto";
import { ProductComponentDTO } from "src/app/domain/dto/product-component.dto";
import { BaseCrudEditComponent } from "src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component";
import { ComponentChangeHistoryComponent } from "src/app/pages/rating/evaluate-plans-page/component-change-history/component-change-history.component";
import { UsersService } from 'src/app/services/administration/users.service';
import { DistributeActivitiesService } from "src/app/services/coordination/distribute-activities.service";
import { ProductComponentHistoryService } from "src/app/services/coordination/product-component-history.service";
import { ConfigPlansComponent } from "../config-plans-edit/config-plans-edit.component";
import { JustifyAuditorReplacementComponent } from "./justify-auditor-replacement/justify-auditor-replacement.component";
import {
  JustifyReschedulingComponent,
  TipoData,
} from "./justify-rescheduling/justify-rescheduling.component";

@Component({
  selector: "app-distribute-activities-edit",
  templateUrl: "./distribute-activities-edit.component.html",
  styleUrls: ["./distribute-activities-edit.component.css"],
})
export class DistributeActivitiesEditComponent
  extends BaseCrudEditComponent<DistributeActivitiesTreeDTO>
  implements OnInit
{
  distributeActivitiesTree!: DistributeActivitiesTreeDTO;
  treeData!: TreeNode[];
  previousAuditor: AuditorDTO = { userId: 0, name: "", roleName: "" };
  previousStartsAt: Date | undefined;
  previousEndsAt: Date | undefined;
  products: ProductComponentDTO[] = [];
  previousDatesMap = new Map<string, { startsAt: Date; endsAt: Date }>();
  currentUser: import("c:/javaworkspace/virtus-frontend/src/app/domain/dto/current-user.dto").CurrentUser;
  curUserRole: string;

  constructor(
    @Inject(MatDialog) public dialog: MatDialog,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<DistributeActivitiesTreeDTO>,
    @Inject(MAT_DIALOG_DATA)
    public distributeActivities: DistributeActivitiesDTO,
    private _service: DistributeActivitiesService,
    private _productComponentHistoryService: ProductComponentHistoryService,
    private _usersService: UsersService,
    @Inject(MatDialog) public errorDialog: MatDialog
  ) {
    super();
    this.currentUser = this._usersService.getCurrentUser();
    this.curUserRole = this.currentUser?.role || "";

  }

  ngOnInit(): void {
    this._service
      .getDistributeActivitiesTreeByEntityAndCycleId(
        this.distributeActivities.entityId,
        this.distributeActivities.cycle?.id
      )
      .pipe()
      .subscribe((resp) => {
        this.distributeActivitiesTree = resp;
        this.products = resp.products;
        const isSupervisor = this.curUserRole === 'Supervisor';

      if (isSupervisor && resp?.auditors?.length) {
        this.distributeActivitiesTree.auditors = resp.auditors.filter(
          (auditor?) => auditor && auditor.roleName !== 'Chefe'
        );
      }
        this.treeData = this.buildTree(resp);
      });
  }

  buildTree(data: DistributeActivitiesTreeDTO): TreeNode[] {
    if (!data || !data.products || data.products.length == 0) {
      return [];
    }

    const entityMap: Map<string, TreeNode> = new Map();

    data.products.forEach((item) => {
      const entityName = item.entity?.name || "Unknown Entity";
      const cycleName = item.cycle?.cycle?.name || "Unknown Cycle";
      const pillarName = item.pillar?.name || "Unknown Pillar";
      const componentName = item.component?.name || "Unknown Component";

      if (!entityMap.has(entityName)) {
        entityMap.set(entityName, {
          data: {
            name: entityName,
            objectType: "Entidade",
            object: item.entity,
          },
          expanded: true,
          children: [],
        });
      }

      const entityNode = entityMap.get(entityName)!;

      let cycleNode = entityNode.children?.find(
        (child) => child.data.name === cycleName
      );
      if (!cycleNode) {
        cycleNode = {
          data: {
            name: cycleName,
            objectType: "Ciclo",
            object: item.cycle,
          },
          expanded: true,
          children: [],
        };
        entityNode.children?.push(cycleNode);
      }

      let pillarNode = cycleNode.children?.find(
        (child) => child.data.name === pillarName
      );
      if (!pillarNode) {
        pillarNode = {
          data: {
            name: pillarName,
            objectType: "Pilar",
            object: item.pillar,
          },
          expanded: true,
          children: [],
        };
        cycleNode.children?.push(pillarNode);
      }

      pillarNode.children?.push({
        data: {
          name: componentName,
          objectType: "Componente",
          object: item,
        },
        children: []
      });
    });

    return Array.from(entityMap.values());
  }

  save() {
    console.log(this.products);
    if (this.isValidToDistribute()) {
      let activities: ActivitiesByProductComponentRequestDto[] = [];
      this.products.forEach((product) => {
        const activityRequest: ActivitiesByProductComponentRequestDto = {
          productComponentId: product?.id,
          supervisorId: product?.supervisor?.userId,
          auditorId: product?.auditor?.userId,
          startsAt: product?.startsAt,
          endsAt: product?.endsAt,
        };
        activities.push(activityRequest);
      });

      this._service
        .distributeActivities(activities)
        .pipe(
          tap((resp) => {
            this.dialogRef.close(resp);
          }),
          catchError((error) => {
            this.mostrarErro(error, this.errorDialog);
            return throwError(error);
          })
        )
        .subscribe();
    } else {
      const errorDialogRef = this.errorDialog.open(AlertDialogComponent, {
        width: "350px",
        data: {
          title: "Erro",
          message: "Todos os campos devem ser preenchidos!",
        },
      });

      errorDialogRef.afterClosed().subscribe((result) => {});
    }
  }

  getTitle() {
    return "Distribuir atividades";
  }

  hasCycles(_: number, node: any): boolean {
    return !!node.cycles && node.cycles.length > 0;
  }

  hasPillars(_: number, node: any): boolean {
    return !!node.cyclePillars && node.cyclePillars.length > 0;
  }

  hasComponents(_: number, node: any): boolean {
    return !!node.components && node.components.length > 0;
  }

  setPreviousAuditor(auditor: AuditorDTO) {
    this.previousAuditor = auditor;
  }

  parseDateBR(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    const dt = new Date(year, month - 1, day);
    return dt;
  }

  private generateKey(
    cicloId: string | number,
    pilarId: string | number,
    componenteId: string | number
  ): string {
    return `${cicloId}-${pilarId}-${componenteId}`;
  }

  setPreviousDates(rowNode: any, startsAt: any, endsAt: any) {
    if (!startsAt || !endsAt) return;
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = rowNode.node.data.object.component;
    const parsedStartsAt =
      typeof startsAt === "string"
        ? this.parseDateBR(startsAt)
        : new Date(startsAt);
    const parsedEndsAt =
      typeof endsAt === "string" ? this.parseDateBR(endsAt) : new Date(endsAt);

    this.previousStartsAt = parsedStartsAt;
    this.previousEndsAt = parsedEndsAt;

    // Extract IDs safely or use fallback
    const cicloId = cicloNode?.data?.object?.cycle?.id;
    const pilarId = pilarNode?.data?.object?.id;
    const componenteId = componentNode.id;

    // Gera chave composta
    const key = this.generateKey(cicloId, pilarId, componenteId);

    // Armazena no mapa
    if (!this.previousDatesMap.get(key)) {
      this.previousDatesMap.set(key, {
        startsAt: parsedStartsAt,
        endsAt: parsedEndsAt,
      });
    }

    // Debug opcional
    const formattedStartsAt = parsedStartsAt.toLocaleDateString("pt-BR");
    const formattedEndsAt = parsedEndsAt.toLocaleDateString("pt-BR");

    console.log(
      `Armazenado para chave ${key}: Início ${formattedStartsAt}, Fim ${formattedEndsAt}`
    );
  }

  getPreviousDates(
    cicloId: string | number,
    pilarId: string | number,
    componenteId: string | number
  ): { startsAt: Date; endsAt: Date } | undefined {
    const key = this.generateKey(cicloId, pilarId, componenteId);
    return this.previousDatesMap.get(key);
  }

  onStartsChange(rowNode: any, dto: ProductComponentDTO, newStart: Date) {
    const index = this.products.findIndex((product) => product.id === dto.id);
    if (index !== -1) {
      this.products[index].startsAt = newStart;

        const previousDates = this.getPreviousDates(
        dto.cycle?.cycle?.id ?? '',
        dto.pillar?.id ?? '',
        dto.component?.id ?? ''
      );

      const currentEndsAt = this.products[index].endsAt;

      const startDate =
        newStart instanceof Date ? newStart : new Date(newStart);
      const endDate =
        currentEndsAt instanceof Date ? currentEndsAt : new Date(currentEndsAt);

      if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
        this.errorDialog.open(AlertDialogComponent, {
          width: "400px",
          data: {
            title: "Datas inválidas",
            message:
              "A data de início não pode ser posterior à data de término.",
          },
        });
        this.products[index].startsAt =
          previousDates?.startsAt ?? this.products[index].startsAt; // Reverte
        return;
      }

      if (
        previousDates?.startsAt &&
        newStart &&
        new Date(previousDates.startsAt).getTime() !==
          new Date(newStart).getTime()
      ) {
        this.justifyReschedulingDateChange(
          rowNode,
          previousDates.startsAt,
          newStart,
          previousDates.endsAt,
          currentEndsAt,
          TipoData.INICIA_EM
        );
      }
    }
  }

  onEndsChange(rowNode: any, dto: ProductComponentDTO, newEnd: Date) {
    const index = this.products.findIndex((product) => product.id === dto.id);
    if (index !== -1) {
      this.products[index].endsAt = newEnd;

      const previousDates = this.getPreviousDates(
        dto.cycle?.cycle?.id ?? '',
        dto.pillar?.id ?? '',
        dto.component?.id ?? ''
      );

      const currentStartsAt = this.products[index].startsAt;
      const startDate =
        currentStartsAt instanceof Date
          ? currentStartsAt
          : new Date(currentStartsAt);
      const endDate = newEnd instanceof Date ? newEnd : new Date(newEnd);

      if (
        startDate instanceof Date &&
        !isNaN(startDate.getTime()) &&
        endDate instanceof Date &&
        !isNaN(endDate.getTime()) &&
        startDate.getTime() > endDate.getTime()
      ) {
        this.errorDialog.open(AlertDialogComponent, {
          width: "400px",
          data: {
            title: "Datas inválidas",
            message:
              "A data de término não pode ser anterior à data de início.",
          },
        });
        this.products[index].endsAt = previousDates?.endsAt ?? new Date(); // Reverte
        return;
      }

      if (
        previousDates?.endsAt &&
        newEnd &&
        new Date(previousDates.endsAt).getTime() !== new Date(newEnd).getTime()
      ) {
        this.justifyReschedulingDateChange(
          rowNode,
          previousDates.startsAt,
          currentStartsAt,
          previousDates.endsAt,
          newEnd,
          TipoData.TERMINA_EM
        );
      }
    }
  }

  justifyReschedulingDateChange(
    rowNode: any,
    iniciaEmAnterior: Date | undefined,
    iniciaEm: Date,
    terminaEmAnterior: Date | undefined,
    terminaEm: Date,
    tipo: TipoData
  ) {
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = rowNode.node;
    const dialogRef = this.dialog.open(JustifyReschedulingComponent, {
      width: "1000px",
      autoFocus: false,
      data: {
        entidade: entidadeNode || "",
        ciclo: cicloNode || "",
        pilar: pilarNode || "",
        componente: componentNode || "",
        iniciaEmAnterior: iniciaEmAnterior,
        iniciaEm: iniciaEm,
        terminaEmAnterior: terminaEmAnterior,
        terminaEm: terminaEm,
        texto: "",
        tipoData: tipo,
      },
    });

    dialogRef.componentInstance.onSave.subscribe(() => {
      const cicloId = cicloNode?.data?.object?.cycle?.id;
      const pilarId = pilarNode?.data?.object?.id;
      const componenteId = componentNode?.data?.object?.component?.id;

      const key = this.generateKey(cicloId, pilarId, componenteId);

      this.previousDatesMap.set(key, {
        startsAt: iniciaEm,
        endsAt: terminaEm,
      });
      console.log(`Mapa atualizado após salvar: ${key}`);
    });
  }

  isValidToDistribute() {
    let isValid = false;

    for (let product of this.products) {
      if (
        product.auditor &&
        product.endsAt &&
        product.startsAt &&
        product.supervisor
      ) {
        isValid = true;
        break;
      }
    }

    return isValid;
  }

  compareAuditors(a1: AuditorDTO, a2: AuditorDTO): boolean {
    return a1 && a2 ? a1.userId === a2.userId : a1 === a2;
  }

  openPlansConfig(object: ProductComponentDTO) {
    const dialogRef = this.dialog.open(ConfigPlansComponent, {
      width: "1000px",
      data: object,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onProductComponentHistoryClick(rowNode: any): void {
    // Retrieve required IDs from the node hierarchy
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = rowNode.node;

    const entidadeId = entidadeNode?.data?.object?.id;
    const cicloId = cicloNode?.data?.object?.cycle?.id;
    const pilarId = pilarNode?.data?.object?.id;
    const componentId = componentNode?.data?.object?.component.id;
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

  justifyAuditorReplacement(rowNode: any, newAuditor: AuditorDTO) {
    const entidadeNode = this.subirAtePorNode(rowNode, "Entidade");
    const cicloNode = this.subirAtePorNode(rowNode, "Ciclo");
    const pilarNode = this.subirAtePorNode(rowNode, "Pilar");
    const componentNode = rowNode.node;

    const dialogRef = this.dialog.open(JustifyAuditorReplacementComponent, {
      width: "1000px",
      autoFocus: false,
      data: {
        entidade: entidadeNode?.data ?? { name: "", object: { id: null } },
        ciclo: cicloNode?.data ?? { name: "", object: { id: null } },
        pilar: pilarNode?.data ?? { name: "", object: { id: null } },
        componente: componentNode?.data ?? {
          name: "",
          object: { component: { id: null } },
        },
        novoAuditor: newAuditor ?? { name: "", userId: null },
        auditorAnterior: this.previousAuditor ?? { name: "", userId: null },
        texto: "",
      },
    });
  }

  parseDecimal(valor: string | null | undefined): number {
    return parseFloat((valor || "0").replace(",", "."));
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
}

export interface ActivitiesByProductComponentRequestDto {
  productComponentId: number;
  supervisorId: number;
  auditorId: number;
  startsAt: Date;
  endsAt: Date;
}
