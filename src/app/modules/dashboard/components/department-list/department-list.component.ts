import {Component, computed, inject, signal} from '@angular/core';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {AsyncPipe} from "@angular/common";
import {TableComponent} from "@app/shared/components/table/table.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {DepartmentFormComponent} from "@app/shared/components/department-form/department-form.component";
import {DepartmentService} from "@app/services/dashboard/department/department.service";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {HttpEventType} from "@angular/common/http";
import {Station} from "@app/models/dashboard/station";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";

@Component({
  selector: 'app-department-list',
  standalone: true,
    imports: [
        ConfirmDialogModule,
        ToastModule,
        AsyncPipe,
        TableComponent,
        FilterPipe,
        SortPipe,
        TableDataNotFoundComponent
    ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent {

  private readonly departmentService = inject(DepartmentService);
  protected readonly DepartmentFormComponent = DepartmentFormComponent;

  departments$ = computed(()=>this.departmentService.departments(this.pageSelected(),this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true,order: ''},
    {field: 'area', isFilter: true,order: ''},
    {field: 'Nb towns', isFilter: false,order: ''},
    {field: 'Nb geometry', isFilter: false,order: ''}
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Department";
  pageSelected = signal(1);
  perPage = signal(5);

  onChangeEntryPerPage(perPageSelected: number) {
    this.perPage.set(perPageSelected);
  }
  onPaginationChanged(pageValueSelected:number){
    this.pageSelected.set(pageValueSelected);
  }

  onSearchChanged(searchValueChanged:string){
    this.searchValue = searchValueChanged;
  }

  onSortChanged(sortValueChanged:any){
    this.sortValue = sortValueChanged;
  }
  onReloadTableData(reloadTableData:any){
    this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
  }


  onDelete(uuid:string) {
    this.departmentService
      .delete(uuid)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.messageService.add({severity:'success', summary: 'Success', detail: `${event.body.message}`});
            this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station:Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.DepartmentFormComponent, this.messageService, this.tableName)
      .onClose
      .subscribe((result: any) => {
        this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
      });
  }

  onConfirmDelete(uuid:string) {
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

}
