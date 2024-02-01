import {Component, computed, inject, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DirectionService} from "@app/services/dashboard/direction/direction.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {HttpEventType} from "@angular/common/http";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {TableComponent} from "@app/shared/components/table/table.component";
import {DirectionFormComponent} from "@app/shared/components/direction-form/direction-form.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {Station} from "@app/models/dashboard/station";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";

@Component({
  selector: 'app-direction-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    JsonPipe,
    ConfirmDialogModule,
    ToastModule,
    TableComponent,
    FilterPipe,
    SortPipe
  ],
  templateUrl: './direction-list.component.html',
  styleUrl: './direction-list.component.css'
})
export class DirectionListComponent {

  private readonly directionService = inject(DirectionService);
  protected readonly DirectionFormComponent = DirectionFormComponent;
  directions$ = computed(() => this.directionService.directions(this.pageSelected(), this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true, order: ''},
    {field: 'type', isFilter: true, order: ''},
    {field: 'reference', isFilter: true, order: ''},
    {field: 'Nb station', isFilter: false, order: ''},
    {field: 'Station list', isFilter: false, order: ''},
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Direction";
  pageSelected = signal(1);
  perPage = signal(5);

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
    this.directions$ = signal(this.directionService.directions(this.pageSelected(), this.perPage()));
  }

  onDelete(uuid: string) {
    this.directionService
      .delete(uuid)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.messageService.add({severity: 'success', summary: 'Success', detail: `${event.body.message}`});
            this.directions$ = signal(this.directionService.directions(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station: Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.DirectionFormComponent, this.messageService, this.tableName)
      .onClose
      .subscribe((result: any) => {
        if (result) this.directions$ = signal(this.directionService.directions(this.pageSelected(), this.perPage()));
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
}
