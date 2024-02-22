import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";

export class MethodeUtil{

  /**
   *
   * @param dynamicData
   * @param perPage
   * @param pageSelected
   * @param ref
   * @param dialogService
   * @param component
   * @param messageService
   * @param formName
   */
  public static onShowDialog(
    dynamicData:any={},
    perPage: number=5,
    pageSelected: number=1,
    ref: DynamicDialogRef,
    dialogService: DialogService,
    component: any,
    messageService: MessageService,
    formName: string = "Form"
  ) {
    ref=dialogService.open(component, {
      header: `${formName}`,
      width: '50%',
      contentStyle: {"max-height": "100%", "overflow": "auto"},
      baseZIndex: 11000,
      maximizable: true,
      closable: true,
      draggable: true,
      resizable: true,
      transitionOptions: '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      data: {
        dynamicData,
        isEdit: !!dynamicData.uuid,
        pageSelected: pageSelected,
        perPage: perPage
      },
    });

    ref.onClose.subscribe((result: any) => {
      if (result) {
        messageService.add({severity:'success', summary: 'Success', detail: result});
      }
    });

    return ref;

  }

}
