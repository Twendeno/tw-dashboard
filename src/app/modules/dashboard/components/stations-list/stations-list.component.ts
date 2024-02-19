import {Component, computed, inject, OnDestroy, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StationService} from "@app/services/dashboard/station/station.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {TableComponent} from "@app/shared/components/table/table.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {Station} from "@app/models/dashboard/station";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {StationFormComponent} from "@app/shared/components/station-form/station-form.component";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";
import {TruncatePipe} from "@app/shared/utils/truncate/truncate.pipe";
import {DialogResponse} from "@app/models/dialog-response";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ReplaySubject, takeUntil} from "rxjs";

@Component({
  selector: 'app-stations-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe,
    ConfirmDialogModule,
    ToastModule,
    TableComponent,
    FilterPipe,
    SortPipe,
    TableDataNotFoundComponent,
    TruncatePipe,
    FormsModule
  ],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.css'
})
export class StationsListComponent implements OnDestroy{

  private readonly destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  private readonly stationService = inject(StationService);
  protected readonly StationFormComponent = StationFormComponent;
  stations$ = computed(() => this.stationService.coordinates(this.pageSelected(), this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true, order: ''},
    {field: 'address', isFilter: true, order: ''},
    {field: 'LatLng', isFilter: false, order: ''},
    {field: 'Nb Line', isFilter: false, order: ''},
    {field: 'Line list', isFilter: false, order: ''},
    {field: '', isFilter: false, order: ''}
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Station";
  pageSelected = signal(1);
  perPage = signal(10);

  protected removeList = signal<Station[]>([])
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
    this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
  }

  onDelete(uuid: string) {
    this.stationService
      .delete(uuid)
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
            this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station: Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.StationFormComponent, this.messageService, this.tableName)
      .onClose
      .pipe(takeUntil(this.destroy))
      .subscribe((result: any) => {
        if (result) this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
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

  onCheckOneItem(stationItem: Station, event: any) {
    const isChecked = event.target.checked;
    if (!isChecked) {
      this.removeList.set(
        this.removeList().filter((station: Station) => station.uuid !== stationItem.uuid)
      )
    }
    if (isChecked) this.removeList.set([...this.removeList(), stationItem])
  }

  onSelectAllData(stations: any) {
    if (stations == null) {
      this.removeList.set([]);
      this.isCheckOne.set(false);
      return;
    }
    this.removeList.set(stations);
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
    this.stationService
      .deleteMany(this.removeList())
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.Response:
            if (event.status == 200) {
              this.messageService.add({severity: 'success', summary: 'Success', detail: `${DialogResponse.DELETE}`});
              this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
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
