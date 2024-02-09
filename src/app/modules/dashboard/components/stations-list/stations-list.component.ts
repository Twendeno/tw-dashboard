import {Component, computed, inject, signal} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
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
        TruncatePipe
    ],
  templateUrl: './stations-list.component.html',
  styleUrl: './stations-list.component.css'
})
export class StationsListComponent {

  private readonly stationService = inject(StationService);
  protected readonly StationFormComponent = StationFormComponent;
  stations$ = computed(()=>this.stationService.coordinates(this.pageSelected(),this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true,order: ''},
    {field: 'address', isFilter: true,order: ''},
    {field: 'LatLng', isFilter: false,order: ''},
    {field: 'Nb Line', isFilter: false,order: ''},
    {field: 'Line list', isFilter: false,order: ''},
    {field: '', isFilter: false,order: ''}
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Station";
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
    this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
  }

  onDelete(uuid:string) {
    this.stationService
      .delete(uuid)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.messageService.add({severity:'success', summary: 'Success', detail: `${event.body.message}`});
            this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station:Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.StationFormComponent, this.messageService, this.tableName)
      .onClose
      .subscribe((result: any) => {
        if (result) this.stations$ = signal(this.stationService.coordinates(this.pageSelected(), this.perPage()));
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
