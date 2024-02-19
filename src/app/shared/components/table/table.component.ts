import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {AsyncPipe, JsonPipe, NgStyle} from "@angular/common";
import {FilterPipe} from "@app/shared/utils/filter/filter.pipe";
import {FormsModule} from "@angular/forms";
import {SortPipe} from "@app/shared/utils/sort/sort.pipe";
import {MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MethodeUtil} from "@app/shared/utils/methode.util";
import {TableDataNotFoundComponent} from "@app/shared/components/table-data-not-found/table-data-not-found.component";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PaginationComponent} from "@app/shared/components/pagination/pagination.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AsyncPipe,
    FilterPipe,
    FormsModule,
    SortPipe,
    NgStyle,
    JsonPipe,
    TableDataNotFoundComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    PaginationComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  protected readonly Array = Array;
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  private ref: DynamicDialogRef | undefined;

  @Input() pageSelected = signal(1);
  @Input() perPage = signal(10);
  @Input() dynamicComponent: any;

  @Input() sortColumnSelected = {field: 'name', isFilter: true, order: 'asc'}
  @Input() searchValue = "";
  @Input() tableName: string = "Table name";
  @Input() myService$: any;
  @Input() headers: any;
  @Input() nbItemToDelete: any;

  @Output() perPageOutput = new EventEmitter<number>();
  @Output() pageSelectedOutput = new EventEmitter<number>();
  @Output() searchValueOutput = new EventEmitter<string>();
  @Output() sortValueOutput = new EventEmitter<any>();
  @Output() reloadTableData = new EventEmitter<any>();
  @Output() selectAllData = new EventEmitter<any>();
  @Output() multipleDeleteData = new EventEmitter<any>();

  onSearchValueChange(searchValue: string) {
    this.searchValueOutput.emit(searchValue);
  }

  onChangeEntryPerPage(event: any) {
    this.perPage.set(event.target.value);
    this.perPageOutput.emit(this.perPage());
  }

  onPagination(page: number) {
    this.pageSelected.set(page);
    this.pageSelectedOutput.emit(this.pageSelected());
  }

  onShowDialog(data: any = {}) {
    MethodeUtil
      .onShowDialog(data, this.perPage(), this.pageSelected(), this.ref!, this.dialogService, this.dynamicComponent, this.messageService, this.tableName)
      .onClose
      .subscribe((res) => {
        if (res) this.reloadTableData.emit();
      });
  }

  onSortColumn(field: any) {
    field.order = this.filterAction(field.order);
    this.sortValueOutput.emit(field);
  }

  private filterAction(orderBy: string): string {
    switch (orderBy) {
      case '':
        return 'asc';
      case 'asc':
        return 'desc';
      case 'desc':
        return '';
      default:
        return '';
    }
  }

  onSelectAll($event: any) {
    if ($event.target.checked){}
      this.selectAllData.emit(this.myService$.data);

    if (!$event.target.checked)
      this.selectAllData.emit(null);


  }

  onMultipleDelete() {
    this.multipleDeleteData.emit(true)
  }
}
