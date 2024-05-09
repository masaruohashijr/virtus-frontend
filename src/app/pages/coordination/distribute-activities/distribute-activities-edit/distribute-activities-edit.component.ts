import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DistributeActivitiesDTO } from 'src/app/domain/dto/distribute-activities-dto';
import { DistributeActivitiesTreeDTO } from 'src/app/domain/dto/distrobute-activities-tree-dto';
import { DistributeActivitiesService } from 'src/app/services/coordination/distribute-activities.service';

interface TreeNode {
  name: string | undefined | null;
  objectType: string;
  object: any;
  children: TreeNode[];
}

@Component({
  selector: 'app-distribute-activities-edit',
  templateUrl: './distribute-activities-edit.component.html',
  styleUrls: ['./distribute-activities-edit.component.css']
})
export class DistributeActivitiesEditComponent implements OnInit {

  distributeActivitiesTree: DistributeActivitiesTreeDTO[] = [];
  treeData: TreeNode[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public distributeActivities: DistributeActivitiesDTO,
    private service: DistributeActivitiesService) {

  }

  ngOnInit(): void {
    this.service.getDistributeActivitiesTreeByEntityId(this.distributeActivities.entityId)
      .pipe()
      .subscribe(resp => {
        this.distributeActivitiesTree = resp;
        this.treeData = this.buildTree(resp);
        console.log(this.treeData);
      });
  }

  buildTree(data: DistributeActivitiesTreeDTO[]): TreeNode[] {
    const tree: TreeNode[] = [];

    data.forEach(item => {
      const entityNode: TreeNode = {
        name: item.entity.name,
        objectType: 'Entidade',
        object: item.entity,
        children: []
      };

      item.cycles.forEach(cycle => {
        const cycleNode: TreeNode = {
          name: cycle.name,
          objectType: 'Ciclo',
          object: cycle,
          children: []
        };

        cycle.cyclePillars.forEach(pillar => {
          const pillarNode: TreeNode = {
            name: pillar?.pillar?.name,
            objectType: 'Pilar',
            object: pillar?.pillar,
            children: []
          };

          pillar.pillar?.components.forEach(component => {
            const componentNode: TreeNode = {
              name: component.component?.name,
              objectType: 'Componente',
              object: component.component,
              children: [] // Nenhum filho para componentes
            };
            pillarNode.children.push(componentNode);
          });

          cycleNode.children.push(pillarNode);
        });

        entityNode.children.push(cycleNode);
      });

      tree.push(entityNode);
    });

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
