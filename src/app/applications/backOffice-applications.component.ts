import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/paged-listing-component-base';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ApplicationsService, EstablishmentDto, EstablishmentDtoPagedResultDto } from './Applications.service';
//import { EstablishmentDto, EstablishmentDtoPagedResultDto, SubItemService } from '@app/items/items.service';
class PagedItemsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './backOffice-applications.component.html',
  animations: [appModuleAnimation()]
})
export class BackOfficeApplicationsComponent extends PagedListingComponentBase<EstablishmentDto> {
  items: EstablishmentDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  public currentLanguage =abp.localization.currentLanguage.name;
  constructor(
    injector: Injector,
    private _ItemService: ApplicationsService,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedItemsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;

    this._ItemService
      .getAll(
        request.keyword,
        request.isActive,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: EstablishmentDtoPagedResultDto) => {
        this.items = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(Item: EstablishmentDto): void {
    abp.message.confirm(
      this.l('ItemDeleteWarningMessage', Item.nameEn),
      undefined,
      (result: boolean) => {
        if (result) {
          this._ItemService
            .delete(Item.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createItem(): void {
    this.showCreateOrEditItemDialog();
  }

  editItem(Item: EstablishmentDto): void {
    this.showCreateOrEditItemDialog(Item.id);
  }

  showCreateOrEditItemDialog(id?: number): void {
    let createOrEditItemDialog: BsModalRef;
    if (!id) {
     // createOrEditItemDialog = this._modalService.show(
        // CreateItemDialogComponent,
        // {
        //   class: 'modal-xl',
        // }
     // );
    } else {
      //createOrEditItemDialog = this._modalService.show(
        // EditItemDialogComponent,
        // {
        //   class: 'modal-xl',
        //   initialState: {
        //     id: id,
        //   },
        // }
      //);
    }

    createOrEditItemDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }
}

