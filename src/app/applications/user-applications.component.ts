import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/paged-listing-component-base';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ApplicationsService, EstablishmentDto, EstablishmentDtoPagedResultDto } from './Applications.service';
//import { EstablishmentDto, EstablishmentDtoPagedResultDto, SubItemService } from '@app/establishments/establishments.service';
class PagedItemsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './user-applications.component.html',
  animations: [appModuleAnimation()]
})
export class UserApplicationsComponent extends PagedListingComponentBase<EstablishmentDto> {
  establishments: EstablishmentDto[] = [];
  establishment: EstablishmentDto;
  statusList: StatusDto[] = [
    {
      id: 1,
      nameAr: "موقت",
      nameEn: "As Draft"
    },
    {
      id: 2,
      nameAr: "تم الارسال",
      nameEn: "Submited"
    },
    {
      id: 3,
      nameAr: "مرفوض",
      nameEn: "Rejected"
    },
    {
      id: 4,
      nameAr: "الرجوع للتعجيل",
      nameEn: "Returned for Modification"
    }
  ];
  years: number[] = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]
  keyword = '';
  isActive: boolean | null;
  statusId: number | null;
  yearId: number | null;
  advancedFiltersVisible = false;
  public currentLanguage = abp.localization.currentLanguage.name;
  constructor(
    injector: Injector,
    private _ItemService: ApplicationsService,
    private _modalService: BsModalService
  ) {
    super(injector);

    this.establishment =new EstablishmentDto ();
    this.establishment.id= 1;
    this.establishment.nameAr= '';
    this.establishment.nameEn= '';
    this.establishment.classification= '';
    this.establishment.licenseNumber= '';
    this.establishment.financialYearFrom= '';
    this.establishment. financialYearTo= '';
    this.establishment.noOfRooms= 0;
    this.establishment.reportStatus= 0;
    this.establishment.financialYear= 0;
   
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
      this.establishments = result.items;
      this.showPaging(result, pageNumber);
    });
}

delete (Item: EstablishmentDto): void {
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
          .subscribe(() => { });
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

showCreateOrEditItemDialog(id ?: number): void {
  let createOrEditItemDialog: BsModalRef;
  if(!id) {
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

export class StatusDto {
  id: number | undefined;
  nameAr: string | undefined;
  nameEn: string | undefined;

}
