import {Component, computed, inject, OnDestroy, signal} from '@angular/core';
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {AsyncPipe, DatePipe, JsonPipe, NgStyle} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpEventType} from "@angular/common/http";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {Geometry} from "@app/models/dashboard/geometry";
import {ToastModule} from "primeng/toast";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {GeometryFormComponent} from "@app/shared/components/geometry-form/geometry-form.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {TableComponent} from "@app/shared/components/table/table.component";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";
import {TruncatePipe} from "@app/shared/utils/truncate/truncate.pipe";
import {DialogResponse} from "@app/models/dialog-response";
import {ReplaySubject, takeUntil} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-line-list',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    ReactiveFormsModule,
    NgStyle,
    FormsModule,
    FilterPipe,
    ToastModule,
    ConfirmDialogModule,
    SortPipe,
    TableComponent,
    TableDataNotFoundComponent,
    DatePipe,
    TruncatePipe,
    RouterLink
  ],
  templateUrl: './line-list.component.html',
  styleUrl: './line-list.component.css'
})
export class LineListComponent implements OnDestroy {

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  private readonly geometryService = inject(GeometryService);
  geometries$ = computed(() => this.geometryService.geometries(this.pageSelected(), this.perPage()));

  protected readonly GeometryFormComponent = GeometryFormComponent;

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true, order: ''},
    {field: 'reference', isFilter: true, order: ''},
    {field: 'color', isFilter: false, order: ''},
    {field: 'type', isFilter: false, order: ''},
    {field: 'Nb station', isFilter: true, order: ''},
    {field: 'Station list', isFilter: false, order: ''},
    {field: 'Create by', isFilter: false, order: ''},
    {field: 'Last update', isFilter: false, order: ''},
    {field: 'Updated at', isFilter: false, order: ''},
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Geometry";
  pageSelected = signal(1);
  perPage = signal(10);

  protected removeList = signal<Geometry[]>([])
  isCheckOne = signal(false);

  onDelete(uuid: string) {
    this.geometryService
      .delete(uuid)
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
            this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(geometry: Geometry = {} as Geometry) {
    MethodeUtil
      .onShowDialog(geometry, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.GeometryFormComponent, this.messageService, this.tableName)
      .onClose
      .pipe(takeUntil(this.destroy))
      .subscribe((result: any) => {
        if (result) this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
      });
  }

  onConfirmDelete(uuid: string) {
    this.confirmDialogService.confirm({
      message: 'Are you sure that you want to perform this action?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      defaultFocus: 'reject',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.onDelete(uuid);
      },
      reject: () => {
        //reject action
      }
    });

  }

  onChangeEntryPerPage(perPageSelected: number) {
    this.perPage.set(perPageSelected);
  }

  onPaginationChanged(pageValueSelected: number) {
    this.pageSelected.set(pageValueSelected);
  }

  onSearchChanged(searchValueChanged: string) {
    this.searchValue = searchValueChanged;
  }

  onSortChanged(sortValueChanged: any) {
    this.sortValue = sortValueChanged;
  }

  onReloadTableData(reloadTableData: any) {
    this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
  }


  onCheckOneItem(geometryItem: Geometry, event: any) {
    const isChecked = event.target.checked;
    if (!isChecked) {
      this.removeList.set(
        this.removeList().filter((geometry: Geometry) => geometry.uuid !== geometryItem.uuid)
      )
    }
    if (isChecked) this.removeList.set([...this.removeList(), geometryItem])
  }

  onSelectAllData(geometries: any) {
    if (geometries == null) {
      this.removeList.set([]);
      this.isCheckOne.set(false);
      return;
    }
    this.removeList.set(geometries);
    this.isCheckOne.set(true);
  }

  onMultipleDeleteData($event: boolean) {
    if ($event) {
      this.confirmDialogService.confirm({
        message: 'Are you sure that you want to perform this action?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'pi pi-trash',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        defaultFocus: 'reject',
        rejectIcon: 'pi pi-times',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.onDeleteMultiple();
        },
        reject: () => {
          //reject action
        }
      });
    }
  }

  onDeleteMultiple() {
    this.geometryService
      .deleteMany(this.removeList())
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            if (event.status == 200) {
              this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
              this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
              this.removeList.set([]);
              this.isCheckOne.set(false);
            }
            break;
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
