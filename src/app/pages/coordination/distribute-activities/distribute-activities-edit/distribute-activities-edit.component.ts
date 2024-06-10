import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { DistributeActivitiesDTO } from 'src/app/domain/dto/distribute-activities-dto';
import { DistributeActivitiesTreeDTO } from 'src/app/domain/dto/distrobute-activities-tree-dto';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';

@Component({
  selector: 'app-distribute-activities-edit',
  templateUrl: './distribute-activities-edit.component.html',
  styleUrls: ['./distribute-activities-edit.component.css']
})
export class DistributeActivitiesEditComponent implements OnInit {

  distributeActivitiesTree!: DistributeActivitiesTreeDTO;
  treeData!: TreeNode[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public distributeActivities: DistributeActivitiesDTO,
    private service: DistributeActivitiesService) {

  }

  ngOnInit(): void {
    this.service.getDistributeActivitiesTreeByEntityAndCycleId(this.distributeActivities.entityId, this.distributeActivities.cycle?.id)
      .pipe()
      .subscribe(resp => {
        this.distributeActivitiesTree = resp;
        this.treeData = this.buildTree(resp);
        console.log('Building tree with data:', JSON.stringify(this.treeData, null, 2));
      });
  }

  buildTree(data: DistributeActivitiesTreeDTO): TreeNode[] {
    if (!data || !data.cycle || !data.entity) {
      return [];
    }
  
    const tree: TreeNode[] = [];
  
    const entityNode: TreeNode = {
      data: {
        name: data.entity?.name || 'Unknown Entity',
        objectType: 'Entidade',
        object: data.entity
      },
      expanded: true,
      children: []
    };
  
    const cycleNode: TreeNode = {
      data: {
        name: data.cycle?.cycle?.name || 'Unknown Cycle',
        objectType: 'Ciclo',
        object: data.cycle
      },
      expanded: true,
      children: []
    };
  
    data.cycle.cycle?.cyclePillars.forEach(pillar => {
      const pillarNode: TreeNode = {
        data: {
          name: pillar?.pillar?.name || 'Unknown Pillar',
          objectType: 'Pilar',
          object: pillar?.pillar
        },
        expanded: true,
        children: []
      };
  
      pillar.pillar?.components.forEach(component => {
        const componentNode: TreeNode = {
          data: {
            name: component.component?.name || 'Unknown Component',
            objectType: 'Componente',
            object: component.component
          },
          expanded: true,
          children: [] // Nenhum filho para componentes
        };
        pillarNode.children?.push(componentNode);
      });
  
      cycleNode.children?.push(pillarNode);
    });
  
    entityNode.children?.push(cycleNode);
  
    tree.push(entityNode);
  
    return tree;
  }

  save() {

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
}
