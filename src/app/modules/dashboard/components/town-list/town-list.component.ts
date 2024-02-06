import {Component, computed, inject, signal} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableComponent} from "@app/shared/components/table/table.component";
import {ToastModule} from "primeng/toast";
import {TownFormComponent} from "@app/shared/components/town-form/town-form.component";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {TownService} from "@app/services/dashboard/town/town.service";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {HttpEventType} from "@angular/common/http";
import {Station} from "@app/models/dashboard/station";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";

@Component({
  selector: 'app-town-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ConfirmDialogModule,
    TableComponent,
    ToastModule,
    FilterPipe,
    SortPipe,
    TableDataNotFoundComponent
  ],
  templateUrl: './town-list.component.html',
  styleUrl: './town-list.component.css'
})
export class TownListComponent {

  private readonly townService = inject(TownService);
  protected readonly TownFormComponent = TownFormComponent;

  towns$ = computed(()=>this.townService.towns(this.pageSelected(), this.perPage()));

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private confirmDialogService = inject(ConfirmationService);

  private ref: DynamicDialogRef | undefined;

  headers = [
    {field: 'name', isFilter: true,order: ''},
    {field: 'area', isFilter: true,order: ''},
    {field: 'Nb district', isFilter: false,order: ''},
    {field: 'Nb geometry', isFilter: false,order: ''},
  ];
  sortValue = {field: 'name', isFilter: true, order: 'asc'};
  searchValue = "";
  tableName = "Town";
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
    this.towns$ = signal(this.townService.towns(this.pageSelected(), this.perPage()));
  }


  onDelete(uuid:string) {
    this.townService
      .delete(uuid)
      .subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.messageService.add({severity:'success', summary: 'Success', detail: `${event.body.message}`});
            this.towns$ = signal(this.townService.towns(this.pageSelected(), this.perPage()));
            break;
        }
      });
  }

  onShowDialog(station:Station = {} as Station) {
    MethodeUtil
      .onShowDialog(station, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.TownFormComponent, this.messageService, this.tableName)
      .onClose
      .subscribe((result: any) => {
        this.towns$ = signal(this.townService.towns(this.pageSelected(), this.perPage()));
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
