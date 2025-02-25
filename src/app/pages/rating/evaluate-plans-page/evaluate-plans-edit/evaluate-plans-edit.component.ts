import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuditorDTO } from 'src/app/domain/dto/auditor.dto';
import { EntityVirtusDTO } from 'src/app/domain/dto/entity-virtus.dto';
import { EvaluatePlansTreeNode } from 'src/app/domain/dto/eveluate-plans-tree-node';
import { ProductComponentDTO } from 'src/app/domain/dto/product-component.dto';
import { UserDTO } from 'src/app/domain/dto/user.dto';
import { UsersService } from 'src/app/services/administration/users.service';
import { EvaluatePlansService } from 'src/app/services/rating/evaluate-plans.service';

@Component({
  selector: 'app-evaluate-plans-edit',
  templateUrl: './evaluate-plans-edit.component.html',
  styleUrls: ['./evaluate-plans-edit.component.css']
})
export class EvaluatePlansEditComponent implements OnInit {

  @Input() object!: EntityVirtusDTO;

  treeData!: TreeNode[];

  allUsers: UserDTO[] = [];

  constructor(private _service: EvaluatePlansService,
    private _usersService: UsersService
  ) { }

  ngOnInit(): void {
    this._usersService.getAll('', 0, 1000).subscribe(resp => {
      this.allUsers = resp.content;
      if (this.object.cycleSelected) {
        this._service.getEvaluatePlansTreeByEntityAndCycleId(this.object.id, this.object.cycleSelected.id)
          .subscribe(data => {
            this.treeData = this.transformToTreeTableFormat(data);
          });
      }
    });
  }

  setAuditor(item: ProductComponentDTO, auditor: AuditorDTO) {
    console.log(item)
    //const index = this.products.findIndex(product => product.id === item.id);
    //if (index !== -1) {
    //  this.products[index].auditor = auditor;
    //}
  }

  compareAuditors(a1: AuditorDTO, a2: AuditorDTO): boolean {
    return a1 && a2 ? a1.userId === a2.userId : a1 === a2;
  }

  transformToTreeTableFormat(nodes: EvaluatePlansTreeNode[], parent: TreeNode | null = null): TreeNode[] {
    return nodes.map(node => {
      {
        const treeNode: TreeNode = {
          data: {
            id: node.id,
            name: node.name,
            objectType: node.type,
            object: node,
            key: `${node.type}-${node.id}`,
            supervisor: this.allUsers.find(user => user.id === node.supervisorId) || null,
            auditor: this.allUsers.find(user => user.id === node.auditorId) || null,
            gradeTypeId: node.gradeTypeId,
            weight: node.weight,
            letter: node.letter,
            grade: node.grade
          },
          children: node.children ? this.transformToTreeTableFormat(node.children) : [],
          expanded: true,
          parent: parent || undefined
        };
        if (treeNode.children) {
          treeNode.children.forEach(child => (child.parent = treeNode));
        }
        return treeNode;
      }
    });
  }

}
