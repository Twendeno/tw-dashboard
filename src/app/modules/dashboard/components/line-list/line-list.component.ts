import {
  Component, computed,
  inject,
  signal
} from '@angular/core';
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
    DatePipe
  ],
  templateUrl: './line-list.component.html',
  styleUrl: './line-list.component.css'
})
export class LineListComponent {

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
  perPage = signal(5);

  onDelete(uuid: string) {
    this.geometryService
      .delete(uuid)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${event.body.message}`});
            this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(geometry: Geometry = {} as Geometry) {
    MethodeUtil
      .onShowDialog(geometry, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.GeometryFormComponent, this.messageService, this.tableName)
      .onClose
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
  onReloadTableData(reloadTableData:any){
    this.geometries$ = signal(this.geometryService.geometries(this.pageSelected(), this.perPage()));
  }

}
