import { EvaluatePlansEditComponent } from "./evaluate-plans-edit/evaluate-plans-edit.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { CycleDTO } from "src/app/domain/dto/cycle.dto";
import { EntityVirtusDTO } from "src/app/domain/dto/entity-virtus.dto";
import { EvaluatePlansService } from "src/app/services/rating/evaluate-plans.service";
import { CycleId } from "src/app/domain/types/ids";

@Component({
  selector: "app-evaluate-plans-page",
  templateUrl: "./evaluate-plans-page.component.html",
  styleUrls: ["./evaluate-plans-page.component.css"],
})
export class EvaluatePlansPageComponent implements OnInit {
  @ViewChild("evaluatePlansEdit")
  evaluatePlansEditComponent?: EvaluatePlansEditComponent;

  pageObjects: EntityVirtusDTO[] = [];

  objectDataSource: MatTableDataSource<EntityVirtusDTO> =
    new MatTableDataSource();
  objectTableColumns: string[] = ["code", "name", "cycle", "actions"];

  cyclesByEntity = new Map();

  showTree = false;
  selectedObject: any;

  constructor(
    public dialog: MatDialog,
    public deleteDialog: MatDialog,
    private _service: EvaluatePlansService,
    private _formBuilder: FormBuilder
  ) {}

  searchForm = this._formBuilder.group({
    filterValue: [""],
  });
  filterControl = this.searchForm.get("filterValue");

  ngOnInit(): void {
    this.loadContent("");

    if (this.filterControl) {
      this.filterControl.valueChanges
        .pipe(
          debounceTime(300), // Atraso de 300 ms após a última alteração
          distinctUntilChanged() // Filtra apenas valores distintos consecutivos
        )
        .subscribe((filterValue: any) => {
          this.loadContent(filterValue);
        });
    }
  }

  loadContent(filter: any) {
    this._service.listAll(filter).subscribe((response) => {
      this.pageObjects = response;
      this.objectDataSource.data = this.pageObjects;
      this.pageObjects.forEach((obj) => this.setCyclesByEntity(obj));
    });
  }

  handlePageEvent(e: PageEvent) {
    this.loadContent(this.filterControl?.value);
  }

  newObject() {}

  openEvaluatePlans(object: EntityVirtusDTO) {
    this.selectedObject = object;
    this.showTree = true;

    // ESPERAR O Angular renderizar o componente e depois colapsar
    setTimeout(() => {
      this.evaluatePlansEditComponent?.collapseAllNodes();
    }, 0);
  }

  // Exemplo: mapa para resolver IDs -> objetos
  // private cyclesIndex = new Map<CycleId, CycleDTO>();

  setCyclesByEntity(
    entity: EntityVirtusDTO,
    cyclesIndex: Map<CycleId, CycleDTO>
  ) {
    // Se não há IDs, não há o que fazer
    if (!entity.cycleIds || entity.cycleIds.length === 0) {
      this.cyclesByEntity.delete(entity.id);
      entity.cycleSelected = null;
      return;
    }

    // Resolve os IDs para objetos; mantém undefined onde não encontrar
    const cycles: (CycleDTO | undefined | null)[] = entity.cycleIds.map(
      (id) => cyclesIndex.get(id) ?? undefined
    );

    // Atualiza o mapa de ciclos por entidade
    this.cyclesByEntity.set(entity.id, cycles);

    // Define um ciclo “selecionado” (primeiro resolvido com sucesso), ou null se nenhum
    const firstResolved = cycles.find((c) => !!c) as CycleDTO | undefined;
    entity.cycleSelected = firstResolved ?? null;
  }
}
