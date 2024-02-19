import {Component, computed, inject, OnDestroy, signal} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableComponent} from "@app/shared/components/table/table.component";
import {ToastModule} from "primeng/toast";
import {DistrictFormComponent} from "@app/shared/components/district-form/district-form.component";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpEventType} from "@angular/common/http";
import {Station} from "@app/models/dashboard/station";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {DistrictService} from "@app/services/dashboard/district/district.service";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";
import {District} from "@app/models/dashboard/district";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DialogResponse} from "@app/models/dialog-response";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ConfirmDialogModule,
    TableComponent,
    ToastModule,
    FilterPipe,
    SortPipe,
    TableDataNotFoundComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './district-list.component.html',
  styleUrl: './district-list.component.css'
})
export class DistrictListComponent implements OnDestroy {

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  protected readonly DistrictFormComponent = DistrictFormComponent;
  private readonly districtService = inject(DistrictService);

  districts$ = computed(() => this.districtService.districts(this.pageSelected(), this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true, order: ''},
    {field: 'area', isFilter: true, order: ''}
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "District";
  pageSelected = signal(1);
  perPage = signal(10);

  protected removeList = signal<District[]>([])
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
    this.districts$ = signal(this.districtService.districts(this.pageSelected(), this.perPage()));
  }

  onDelete(uuid: string) {
    this.districtService
      .delete(uuid)
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
            this.districts$ = signal(this.districtService.districts(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station: Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.DistrictFormComponent, this.messageService, this.tableName)
      .onClose
      .pipe(takeUntil(this.destroy))
      .subscribe((result: any) => {
        this.districts$ = signal(this.districtService.districts(this.pageSelected(), this.perPage()));
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

  onCheckOneItem(districtItem: District, event: any) {
    const isChecked = event.target.checked;
    if (!isChecked) {
      this.removeList.set(
        this.removeList().filter((district: District) => district.uuid !== districtItem.uuid)
      )
    }
    if (isChecked) this.removeList.set([...this.removeList(), districtItem])
  }

  onSelectAllData(directions: any) {
    if (directions == null) {
      this.removeList.set([]);
      this.isCheckOne.set(false);
      return;
    }
    this.removeList.set(directions);
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
    this.districtService
      .deleteMany(this.removeList())
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            if (event.status == 200) {
              this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
              this.districts$ = signal(this.districtService.districts(this.pageSelected(), this.perPage()));
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
