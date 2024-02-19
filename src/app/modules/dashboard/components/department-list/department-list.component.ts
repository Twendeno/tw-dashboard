import {Component, computed, inject, OnDestroy, signal} from '@angular/core';
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Department} from "@app/models/dashboard/department";
import {DialogResponse} from "@app/models/dialog-response";
import {ReplaySubject, takeUntil} from "rxjs";

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
    TableDataNotFoundComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnDestroy {

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  private readonly departmentService = inject(DepartmentService);
  protected readonly DepartmentFormComponent = DepartmentFormComponent;

  departments$ = computed(() => this.departmentService.departments(this.pageSelected(), this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true, order: ''},
    {field: 'area', isFilter: true, order: ''},
    {field: 'Nb towns', isFilter: false, order: ''},
    {field: 'Nb geometry', isFilter: false, order: ''}
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Department";
  pageSelected = signal(1);
  perPage = signal(10);

  protected removeList = signal<Department[]>([])
  isCheckOne = signal(false);

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
    this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
  }


  onDelete(uuid: string) {
    this.departmentService
      .delete(uuid)
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
            this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station: Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.DepartmentFormComponent, this.messageService, this.tableName)
      .onClose
      .pipe(takeUntil(this.destroy))
      .subscribe((result: any) => {
        this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
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

  onCheckOneItem(departmentItem: Department, event: any) {
    const isChecked = event.target.checked;
    if (!isChecked) {
      this.removeList.set(
        this.removeList().filter((department: Department) => department.uuid !== departmentItem.uuid)
      )
    }
    if (isChecked) this.removeList.set([...this.removeList(), departmentItem])
  }

  onSelectAllData(departments: any) {
    if (departments == null) {
      this.removeList.set([]);
      this.isCheckOne.set(false);
      return;
    }
    this.removeList.set(departments);
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
    this.departmentService
      .deleteMany(this.removeList())
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            if (event.status == 200) {
              this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
              this.departments$ = signal(this.departmentService.departments(this.pageSelected(), this.perPage()));
              this.removeList.set([]);
              this.isCheckOne.set(false);
            }
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
