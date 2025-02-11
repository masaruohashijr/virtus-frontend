import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { catchError, tap, throwError } from 'rxjs';
import { AlertDialogComponent } from 'src/app/components/dialog/alert-dialog/alert-dialog.component';
import { AuditorDTO } from 'src/app/domain/dto/auditor.dto';
import { DistributeActivitiesDTO } from 'src/app/domain/dto/distribute-activities-dto';
import { DistributeActivitiesTreeDTO } from 'src/app/domain/dto/distribute-activities-tree-dto';
import { ProductComponentDTO } from 'src/app/domain/dto/product-component.dto';
import { BaseCrudEditComponent } from 'src/app/pages/common/base-crud-page/base-crud-edit/base-crud-edit.component';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';
import { ConfigPlansComponent } from '../config-plans-edit/config-plans-edit.component';
import { HistoryViewComponent } from '../history-view/history-view.component';
import { HistoryService } from 'src/app/services/coordination/history.service';
import { History } from 'src/app/domain/dto/history.dto';

@Component({
  selector: 'app-distribute-activities-edit',
  templateUrl: './distribute-activities-edit.component.html',
  styleUrls: ['./distribute-activities-edit.component.css']
})
export class DistributeActivitiesEditComponent extends BaseCrudEditComponent<DistributeActivitiesTreeDTO> implements OnInit {

  distributeActivitiesTree!: DistributeActivitiesTreeDTO;
  treeData!: TreeNode[];

  products: ProductComponentDTO[] = [];

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    public dialogRef: MatDialogRef<DistributeActivitiesTreeDTO>,
    @Inject(MAT_DIALOG_DATA) public distributeActivities: DistributeActivitiesDTO,
    private service: DistributeActivitiesService,
    private _historyService: HistoryService,
    private errorDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.service.getDistributeActivitiesTreeByEntityAndCycleId(this.distributeActivities.entityId, this.distributeActivities.cycle?.id)
      .pipe()
      .subscribe(resp => {
        this.distributeActivitiesTree = resp;
        this.products = resp.products;
        console.log(resp)
        this.treeData = this.buildTree(resp);
      });
  }

  buildTree(data: DistributeActivitiesTreeDTO): TreeNode[] {
    if (!data || !data.products || data.products.length == 0) {
      return [];
    }

    const entityMap: Map<string, TreeNode> = new Map();

    data.products.forEach(item => {
      const entityName = item.entity?.name || 'Unknown Entity';
      const cycleName = item.cycle?.cycle?.name || 'Unknown Cycle';
      const pillarName = item.pillar?.name || 'Unknown Pillar';
      const componentName = item.component?.name || 'Unknown Component';

      if (!entityMap.has(entityName)) {
        entityMap.set(entityName, {
          data: {
            name: entityName,
            objectType: 'Entidade',
            object: item.entity
          },
          expanded: true,
          children: []
        });
      }

      const entityNode = entityMap.get(entityName)!;

      let cycleNode = entityNode.children?.find(child => child.data.name === cycleName);
      if (!cycleNode) {
        cycleNode = {
          data: {
            name: cycleName,
            objectType: 'Ciclo',
            object: item.cycle
          },
          expanded: true,
          children: []
        };
        entityNode.children?.push(cycleNode);
      }

      let pillarNode = cycleNode.children?.find(child => child.data.name === pillarName);
      if (!pillarNode) {
        pillarNode = {
          data: {
            name: pillarName,
            objectType: 'Pilar',
            object: item.pillar
          },
          expanded: true,
          children: []
        };
        cycleNode.children?.push(pillarNode);
      }

      pillarNode.children?.push({
        data: {
          name: componentName,
          objectType: 'Componente',
          object: item
        }
      });
    });

    return Array.from(entityMap.values());
  }

  save() {
    console.log(this.products);
    if (this.isValidToDistribute()) {

      let activities: ActivitiesByProductComponentRequestDto[] = [];
      this.products.forEach(product => {
        const activityRequest: ActivitiesByProductComponentRequestDto = {
          productComponentId: product?.id,
          supervisorId: product?.supervisor?.userId,
          auditorId: product?.auditor?.userId,
          startsAt: product?.startsAt,
          endsAt: product?.endsAt
        };
        activities.push(activityRequest);
      });

      this.service.distributeActivities(activities).pipe(
        tap(resp => {
          this.dialogRef.close(resp);
        }),
        catchError(error => {
          this.mostrarErro(error, this.errorDialog);

          return throwError(error);
        })
      ).subscribe();
    } else {
      const errorDialogRef = this.errorDialog.open(AlertDialogComponent, {
        width: '350px',
        data: {
          title: "Erro",
          message: "Todos os campos devem ser preenchidos!"
        },
      });

      errorDialogRef.afterClosed().subscribe(result => {

      });

    }
  }

  getTitle() {
    return "Distribuir atividades"
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

  setAuditor(item: ProductComponentDTO, auditor: AuditorDTO) {
    console.log(item)
    const index = this.products.findIndex(product => product.id === item.id);
    if (index !== -1) {
      this.products[index].auditor = auditor;
    }
  }

  onStartsChange(item: ProductComponentDTO, startsAt: Date) {
    const index = this.products.findIndex(product => product.id === item.id);
    if (index !== -1) {
      this.products[index].startsAt = startsAt;
    }
  }

  onEndsChange(item: ProductComponentDTO, endsAt: Date) {

    const index = this.products.findIndex(product => product.id === item.id);
    if (index !== -1) {
      this.products[index].endsAt = endsAt;
    }
  }

  isValidToDistribute() {
    let isValid = false;

    for (let product of this.products) {
      if (product.auditor && product.endsAt && product.startsAt && product.supervisor) {
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
      width: '600px',
      data: object,
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openHistory(object: ProductComponentDTO) {
    if (object.cycle.cycle) {
      this._historyService.getHistory(object.entity.id, object.cycle.cycle.id, object.pillar.id, object.component.id)
        .pipe()
        .subscribe(resp => {
          const obj: History = {
            historic: resp,
            productComponent: object
          }
          const dialogRef = this.dialog.open(HistoryViewComponent, {
            width: '100%',
            data: obj,
          });
        });

    }
    //dialogRef.afterClosed().subscribe(result => {

    //});
  }
}


export interface ActivitiesByProductComponentRequestDto {
  productComponentId: number;
  supervisorId: number;
  auditorId: number;
  startsAt: Date;
  endsAt: Date;
}
