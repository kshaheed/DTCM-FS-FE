import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AttachmentDto, AttachmentService } from './attachment.service';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase {
  title = 'XlsRead';
  file: File
  arrayBuffer: any
  filelist: any
  constructor(injector: Injector, private _attachmentService: AttachmentService) {
    super(injector);
  }

  async fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      let dataURL = await this.readFileAsDataURL(file);
      var x = dataURL + "";

      var attachment = new AttachmentDto({
        fileName: file.name,
        id: 0,
        fileId: "00000000-0000-0000-0000-000000000000",
        type: file.type,
        description: "",
        fileData: x ,
      });

      this._attachmentService
      .create(attachment)
      .pipe(
        finalize(() => {
         // this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
       
      });
    }
  }
  async readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });
    return result_base64;
  }


  


  addfile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var list: any;
      list = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = [];

      var strJson = '[';
      var propList: FSProp[] = [];
      for (var i = 0; i < list.length; ++i) {
        if (list[i].__EMPTY_1) {

          var obj = new FSProp();
          obj.rowNum = list[i].__rowNum__;
          obj.propName = list[i].__EMPTY_1;
          obj.value = list[i].__EMPTY_2;
          if (obj.value) {
            propList.push(obj);
          }
        }
      }

      for (var i = 0; i < propList.length; ++i) {

        // strJson =strJson+prefix;
        if (propList[i].propName) {
          propList[i].propName = this.cleanText(propList[i].propName)
            .replace(propList[i].propName.charAt(0), propList[i].propName.charAt(0).toLowerCase());
          //strJson = strJson + '{"' + propList[i].propName + '" : ' + propList[i].value + '},'
          if(propList[i].value==undefined)
          {
            propList[i].value=0;
          }
          //strJson = strJson + '"' + propList[i].propName + '" : ' + propList[i].value + ','
        
        }
      }
      // strJson = strJson.replace(/undefined/g, '0');
      // strJson = strJson.substring(strJson.length - 1, 1);
      // strJson = '{' + strJson + '}'

       //console.log(strJson)

      let fs: FS = new FS();

      fileByRow(fs, propList);
      FsFromJson(fs,propList);
      console.log(fs);
      //alert('Done!');
    }
  }
  isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
  }
  cleanText(str: string) {
    return str.replace('&', '')
      .replace('/', '')
      .replace('\\', '')
      .replace('(', '')
      .replace(')', '')
      .replace(/\//g, '')
      .replace(/'/g, '')
      .replace(/ /g, '')
      .replace(/&/g, '')
      .replace(/-/g, '')
      .replace(/&/g, '')
      .replace(/,/g, '');
  }







}
export class FSProp {
  propName: string;
  value: number;
  rowNum: number;
}

function fileByRow(fs: FS, list: FSProp[]) {
  fs.OperatingRevenues_otherDepartments = list.filter(k => k.rowNum == 10 - 1).length == 0 ? 0 : fs.OperatingRevenues_otherDepartments = list.filter(k => k.rowNum == 10 - 1)[0].value;
  fs.OperatingExpenses_salariesWages = list.filter(k => k.rowNum == 24 - 1).length == 0 ? 0 : fs.OperatingExpenses_salariesWages = list.filter(k => k.rowNum == 24 - 1)[0].value;
  fs.OperatingExpenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 25 - 1).length == 0 ? 0 : fs.OperatingExpenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 25 - 1)[0].value;
  fs.OperatingExpenses_serviceCharge = list.filter(k => k.rowNum == 26 - 1).length == 0 ? 0 : fs.OperatingExpenses_serviceCharge = list.filter(k => k.rowNum == 26 - 1)[0].value;
  fs.Rooms_OtherExpenses_laundryDryCleaning = list.filter(k => k.rowNum == 31 - 1).length == 0 ? 0 : fs.Rooms_OtherExpenses_laundryDryCleaning = list.filter(k => k.rowNum == 31 - 1)[0].value;
  fs.Rooms_OtherExpenses_guestSupplies = list.filter(k => k.rowNum == 34 - 1).length == 0 ? 0 : fs.Rooms_OtherExpenses_guestSupplies = list.filter(k => k.rowNum == 34 - 1)[0].value;
  fs.Rooms_OtherExpenses_printingStationery = list.filter(k => k.rowNum == 38 - 1).length == 0 ? 0 : fs.Rooms_OtherExpenses_printingStationery = list.filter(k => k.rowNum == 38 - 1)[0].value;
  fs.Rooms_OtherExpenses_others = list.filter(k => k.rowNum == 44 - 1).length == 0 ? 0 : fs.Rooms_OtherExpenses_others = list.filter(k => k.rowNum == 44 - 1)[0].value;
  fs.Rooms_OtherExpenses_totalDepartmentalExpenses = list.filter(k => k.rowNum == 46 - 1).length == 0 ? 0 : fs.Rooms_OtherExpenses_totalDepartmentalExpenses = list.filter(k => k.rowNum == 46 - 1)[0].value;
  fs.PayrollRelatedExpenses_salariesWages = list.filter(k => k.rowNum == 55 - 1).length == 0 ? 0 : fs.PayrollRelatedExpenses_salariesWages = list.filter(k => k.rowNum == 55 - 1)[0].value;
  fs.PayrollRelated_Expenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 56 - 1).length == 0 ? 0 : fs.PayrollRelated_Expenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 56 - 1)[0].value;
  fs.PayrollRelated_serviceCharge = list.filter(k => k.rowNum == 57 - 1).length == 0 ? 0 : fs.PayrollRelated_serviceCharge = list.filter(k => k.rowNum == 57 - 1)[0].value;
  fs.OtherExpenses_laundryDryCleaning = list.filter(k => k.rowNum == 60 - 1).length == 0 ? 0 : fs.OtherExpenses_laundryDryCleaning = list.filter(k => k.rowNum == 60 - 1)[0].value;
  fs.OtherExpenses_printingStationery = list.filter(k => k.rowNum == 64 - 1).length == 0 ? 0 : fs.OtherExpenses_printingStationery = list.filter(k => k.rowNum == 64 - 1)[0].value;
  fs.PayrollRelatedExpenses_others = list.filter(k => k.rowNum == 77 - 1).length == 0 ? 0 : fs.PayrollRelatedExpenses_others = list.filter(k => k.rowNum == 77 - 1)[0].value;
  fs.PayrollRelatedExpenses_totalDepartmentalExpenses = list.filter(k => k.rowNum == 79 - 1).length == 0 ? 0 : fs.PayrollRelatedExpenses_totalDepartmentalExpenses = list.filter(k => k.rowNum == 79 - 1)[0].value;
  fs.OtherDepartments_salariesWages = list.filter(k => k.rowNum == 83 - 1).length == 0 ? 0 : fs.OtherDepartments_salariesWages = list.filter(k => k.rowNum == 83 - 1)[0].value;
  fs.OtherDepartments_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 84 - 1).length == 0 ? 0 : fs.OtherDepartments_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 84 - 1)[0].value;
  fs.OtherDepartments_serviceCharge = list.filter(k => k.rowNum == 85 - 1).length == 0 ? 0 : fs.OtherDepartments_serviceCharge = list.filter(k => k.rowNum == 85 - 1)[0].value;
  fs.OtherDepartments_otherExpenses = list.filter(k => k.rowNum == 88 - 1).length == 0 ? 0 : fs.OtherDepartments_otherExpenses = list.filter(k => k.rowNum == 88 - 1)[0].value;
  fs.OtherDepartments_totalDepartmentalExpenses = list.filter(k => k.rowNum == 90 - 1).length == 0 ? 0 : fs.OtherDepartments_totalDepartmentalExpenses = list.filter(k => k.rowNum == 90 - 1)[0].value;
  fs.GeneralAdministrativeExpenses_salariesWages = list.filter(k => k.rowNum == 97 - 1).length == 0 ? 0 : fs.GeneralAdministrativeExpenses_salariesWages = list.filter(k => k.rowNum == 97 - 1)[0].value;
  fs.GeneralAdministrativeExpenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 98 - 1).length == 0 ? 0 : fs.GeneralAdministrativeExpenses_otherPayrollRelatedExpenses = list.filter(k => k.rowNum == 98 - 1)[0].value;
  fs.GeneralAdministrativeExpenses_serviceCharge = list.filter(k => k.rowNum == 99 - 1).length == 0 ? 0 : fs.GeneralAdministrativeExpenses_serviceCharge = list.filter(k => k.rowNum == 99 - 1)[0].value;
  fs.GeneralAdministrativeExpenses_otherExpenses = list.filter(k => k.rowNum == 113 - 1).length == 0 ? 0 : fs.GeneralAdministrativeExpenses_otherExpenses = list.filter(k => k.rowNum == 113 - 1)[0].value;
  fs.NonOperatingExpenses_otherExpenses = list.filter(k => k.rowNum == 135 - 1).length == 0 ? 0 : fs.NonOperatingExpenses_otherExpenses = list.filter(k => k.rowNum == 135 - 1)[0].value;
  fs.NetProfit_mustbe = list.filter(k => k.rowNum == 146 - 1).length == 0 ? 0 : fs.NetProfit_mustbe = list.filter(k => k.rowNum == 146 - 1)[0].value;
  fs.CurrentAssetShortTerm_others = list.filter(k => k.rowNum == 169 - 1).length == 0 ? 0 : fs.CurrentAssetShortTerm_others = list.filter(k => k.rowNum == 169 - 1)[0].value;
  fs.TradeOtherReceivables_dueFromRelatedParties = list.filter(k => k.rowNum == 176 - 1).length == 0 ? 0 : fs.TradeOtherReceivables_dueFromRelatedParties = list.filter(k => k.rowNum == 176 - 1)[0].value;
  fs.TradeOtherReceivables_investments = list.filter(k => k.rowNum == 177 - 1).length == 0 ? 0 : fs.TradeOtherReceivables_investments = list.filter(k => k.rowNum == 177 - 1)[0].value;
  fs.TradeOtherReceivables_otherReceivables = list.filter(k => k.rowNum == 178 - 1).length == 0 ? 0 : fs.TradeOtherReceivables_otherReceivables = list.filter(k => k.rowNum == 178 - 1)[0].value;
  fs.CashCashEquivalents_restrictedCash = list.filter(k => k.rowNum == 184 - 1).length == 0 ? 0 : fs.CashCashEquivalents_restrictedCash = list.filter(k => k.rowNum == 184 - 1)[0].value;
  fs.NonCurrentAssetLongTerm_dueFromRelatedParties = list.filter(k => k.rowNum == 189 - 1).length == 0 ? 0 : fs.NonCurrentAssetLongTerm_dueFromRelatedParties = list.filter(k => k.rowNum == 189 - 1)[0].value;
  fs.NonCurrentAssetLongTerm_otherReceivables = list.filter(k => k.rowNum == 190 - 1).length == 0 ? 0 : fs.NonCurrentAssetLongTerm_otherReceivables = list.filter(k => k.rowNum == 190 - 1)[0].value;
  fs.NonCurrentAssetLongTerm_investments = list.filter(k => k.rowNum == 191 - 1).length == 0 ? 0 : fs.NonCurrentAssetLongTerm_investments = list.filter(k => k.rowNum == 191 - 1)[0].value;
  fs.NonCurrentAssetLongTerm_restrictedCash = list.filter(k => k.rowNum == 192 - 1).length == 0 ? 0 : fs.NonCurrentAssetLongTerm_restrictedCash = list.filter(k => k.rowNum == 192 - 1)[0].value;
  fs.TotalNonCurrentAssetLongTerm_others = list.filter(k => k.rowNum == 205 - 1).length == 0 ? 0 : fs.TotalNonCurrentAssetLongTerm_others = list.filter(k => k.rowNum == 205 - 1)[0].value;
  fs.nonCurrentLiabilityLongTerm_borrowing = list.filter(k => k.rowNum == 224 - 1).length == 0 ? 0 : fs.nonCurrentLiabilityLongTerm_borrowing = list.filter(k => k.rowNum == 224 - 1)[0].value;
  fs.nonCurrentLiabilityLongTerm_loan = list.filter(k => k.rowNum == 226 - 1).length == 0 ? 0 : fs.nonCurrentLiabilityLongTerm_loan = list.filter(k => k.rowNum == 226 - 1)[0].value;
  fs.TradeOtherReceivables_dueToRelatedParties = list.filter(k => k.rowNum == 176 - 1).length == 0 ? 0 : fs.TradeOtherReceivables_dueToRelatedParties = list.filter(k => k.rowNum == 176 - 1)[0].value;
  fs.currentLiabilityShortTerm_loan = list.filter(k => k.rowNum == 232 - 1).length == 0 ? 0 : fs.currentLiabilityShortTerm_loan = list.filter(k => k.rowNum == 232 - 1)[0].value;
  fs.NonCurrentAssetLongTerm_dueToRelatedParties = list.filter(k => k.rowNum == 189 - 1).length == 0 ? 0 : fs.NonCurrentAssetLongTerm_dueToRelatedParties = list.filter(k => k.rowNum == 189 - 1)[0].value;
  fs.CurrentLiabilityShortTerm_borrowing = list.filter(k => k.rowNum == 239 - 1).length == 0 ? 0 : fs.CurrentLiabilityShortTerm_borrowing = list.filter(k => k.rowNum == 239 - 1)[0].value;
  fs.TotalLiabilities_mustbe = list.filter(k => k.rowNum == 243 - 1).length == 0 ? 0 : fs.TotalLiabilities_mustbe = list.filter(k => k.rowNum == 243 - 1)[0].value;
}

function FsFromJson(fs: FS, data: FSProp[]) {
  fs.particulars=data.filter(k=>k.propName=='particulars').length==0?0:data.filter(k=>k.propName=='particulars')[0].value;
  fs.operatingRevenues=data.filter(k=>k.propName=='operatingRevenues').length==0?0:data.filter(k=>k.propName=='operatingRevenues')[0].value;
  fs.roomsNetRevenueafterTaxesFees=data.filter(k=>k.propName=='roomsNetRevenueafterTaxesFees').length==0?0:data.filter(k=>k.propName=='roomsNetRevenueafterTaxesFees')[0].value;
  fs.foodBeverageInclusiveofTobacco=data.filter(k=>k.propName=='foodBeverageInclusiveofTobacco').length==0?0:data.filter(k=>k.propName=='foodBeverageInclusiveofTobacco')[0].value;
  fs.otherIncomeIncludesForexGainsLoss=data.filter(k=>k.propName=='otherIncomeIncludesForexGainsLoss').length==0?0:data.filter(k=>k.propName=='otherIncomeIncludesForexGainsLoss')[0].value;
  fs.rentalsincome=data.filter(k=>k.propName=='rentalsincome').length==0?0:data.filter(k=>k.propName=='rentalsincome')[0].value;
  fs.serviceChargeRooms=data.filter(k=>k.propName=='serviceChargeRooms').length==0?0:data.filter(k=>k.propName=='serviceChargeRooms')[0].value;
  fs.serviceChargeFB=data.filter(k=>k.propName=='serviceChargeFB').length==0?0:data.filter(k=>k.propName=='serviceChargeFB')[0].value;
  fs.serviceChargeOthers=data.filter(k=>k.propName=='serviceChargeOthers').length==0?0:data.filter(k=>k.propName=='serviceChargeOthers')[0].value;
  fs.totalOperatingrevenue=data.filter(k=>k.propName=='totalOperatingrevenue').length==0?0:data.filter(k=>k.propName=='totalOperatingrevenue')[0].value;
  fs.departmentalExpenses=data.filter(k=>k.propName=='departmentalExpenses').length==0?0:data.filter(k=>k.propName=='departmentalExpenses')[0].value;
  fs.rooms=data.filter(k=>k.propName=='rooms').length==0?0:data.filter(k=>k.propName=='rooms')[0].value;0
  fs.commission=data.filter(k=>k.propName=='commission').length==0?0:data.filter(k=>k.propName=='commission')[0].value;
  fs.reservationfees=data.filter(k=>k.propName=='reservationfees').length==0?0:data.filter(k=>k.propName=='reservationfees')[0].value;
  fs.uniform=data.filter(k=>k.propName=='uniform').length==0?0:data.filter(k=>k.propName=='uniform')[0].value;
  fs.complementaryServices=data.filter(k=>k.propName=='complementaryServices').length==0?0:data.filter(k=>k.propName=='complementaryServices')[0].value;
  fs.guestEntertainment=data.filter(k=>k.propName=='guestEntertainment').length==0?0:data.filter(k=>k.propName=='guestEntertainment')[0].value;
  fs.contractedServices=data.filter(k=>k.propName=='contractedServices').length==0?0:data.filter(k=>k.propName=='contractedServices')[0].value;
  fs.houseKeeping=data.filter(k=>k.propName=='houseKeeping').length==0?0:data.filter(k=>k.propName=='houseKeeping')[0].value;
  fs.operatingSupplies=data.filter(k=>k.propName=='operatingSupplies').length==0?0:data.filter(k=>k.propName=='operatingSupplies')[0].value;
  fs.cableTVRadio=data.filter(k=>k.propName=='cableTVRadio').length==0?0:data.filter(k=>k.propName=='cableTVRadio')[0].value;
  fs.plantFlowers=data.filter(k=>k.propName=='plantFlowers').length==0?0:data.filter(k=>k.propName=='plantFlowers')[0].value;
  fs.newsPapers=data.filter(k=>k.propName=='newsPapers').length==0?0:data.filter(k=>k.propName=='newsPapers')[0].value;
  fs.guestTransportation=data.filter(k=>k.propName=='guestTransportation').length==0?0:data.filter(k=>k.propName=='guestTransportation')[0].value;
  fs.foodBeverage=data.filter(k=>k.propName=='foodBeverage').length==0?0:data.filter(k=>k.propName=='foodBeverage')[0].value;
  fs.payrollRelatedExpenses=data.filter(k=>k.propName=='payrollRelatedExpenses').length==0?0:data.filter(k=>k.propName=='payrollRelatedExpenses')[0].value;
  fs.fBmanagementFee=data.filter(k=>k.propName=='fBmanagementFee').length==0?0:data.filter(k=>k.propName=='fBmanagementFee')[0].value;
  fs.paperSupplies=data.filter(k=>k.propName=='paperSupplies').length==0?0:data.filter(k=>k.propName=='paperSupplies')[0].value;
  fs.musicEntertainment=data.filter(k=>k.propName=='musicEntertainment').length==0?0:data.filter(k=>k.propName=='musicEntertainment')[0].value;
  fs.uniforms=data.filter(k=>k.propName=='uniforms').length==0?0:data.filter(k=>k.propName=='uniforms')[0].value;
  fs.operatingEquipment=data.filter(k=>k.propName=='operatingEquipment').length==0?0:data.filter(k=>k.propName=='operatingEquipment')[0].value;
  fs.guestSupplies=data.filter(k=>k.propName=='guestSupplies').length==0?0:data.filter(k=>k.propName=='guestSupplies')[0].value;
  fs.linenGlasswareSilverWare=data.filter(k=>k.propName=='linenGlasswareSilverWare').length==0?0:data.filter(k=>k.propName=='linenGlasswareSilverWare')[0].value;
  fs.training=data.filter(k=>k.propName=='training').length==0?0:data.filter(k=>k.propName=='training')[0].value;
  fs.commissions=data.filter(k=>k.propName=='commissions').length==0?0:data.filter(k=>k.propName=='commissions')[0].value;
  fs.kitchenFuel=data.filter(k=>k.propName=='kitchenFuel').length==0?0:data.filter(k=>k.propName=='kitchenFuel')[0].value;
  fs.contractCleaningServices=data.filter(k=>k.propName=='contractCleaningServices').length==0?0:data.filter(k=>k.propName=='contractCleaningServices')[0].value;
  fs.cleaningSupplies=data.filter(k=>k.propName=='cleaningSupplies').length==0?0:data.filter(k=>k.propName=='cleaningSupplies')[0].value;
  fs.licensefees=data.filter(k=>k.propName=='licensefees').length==0?0:data.filter(k=>k.propName=='licensefees')[0].value;
  fs.decoration=data.filter(k=>k.propName=='decoration').length==0?0:data.filter(k=>k.propName=='decoration')[0].value;
  fs.transportation=data.filter(k=>k.propName=='transportation').length==0?0:data.filter(k=>k.propName=='transportation')[0].value;
  fs.directCost=data.filter(k=>k.propName=='directCost').length==0?0:data.filter(k=>k.propName=='directCost')[0].value;
  fs.totalOperatingIncome=data.filter(k=>k.propName=='totalOperatingIncome').length==0?0:data.filter(k=>k.propName=='totalOperatingIncome')[0].value;
  fs.generalAdministrativeExpenses=data.filter(k=>k.propName=='generalAdministrativeExpenses').length==0?0:data.filter(k=>k.propName=='generalAdministrativeExpenses')[0].value;
  fs.travellingConveyance=data.filter(k=>k.propName=='travellingConveyance').length==0?0:data.filter(k=>k.propName=='travellingConveyance')[0].value;
  fs.franchiseFee=data.filter(k=>k.propName=='franchiseFee').length==0?0:data.filter(k=>k.propName=='franchiseFee')[0].value;
  fs.salesMarketingExpensesAdvertisementSponsorshipBusinessPromotion=data.filter(k=>k.propName=='salesMarketingExpensesAdvertisementSponsorshipBusinessPromotion').length==0?0:data.filter(k=>k.propName=='salesMarketingExpensesAdvertisementSponsorshipBusinessPromotion')[0].value;
  fs.rentHotelBuilding=data.filter(k=>k.propName=='rentHotelBuilding').length==0?0:data.filter(k=>k.propName=='rentHotelBuilding')[0].value;
  fs.energyCostUtilitiesExpensesCommunicationInternetcharges=data.filter(k=>k.propName=='energyCostUtilitiesExpensesCommunicationInternetcharges').length==0?0:data.filter(k=>k.propName=='energyCostUtilitiesExpensesCommunicationInternetcharges')[0].value;
  fs.postageCourier=data.filter(k=>k.propName=='postageCourier').length==0?0:data.filter(k=>k.propName=='postageCourier')[0].value;
  fs.securityExpenses=data.filter(k=>k.propName=='securityExpenses').length==0?0:data.filter(k=>k.propName=='securityExpenses')[0].value;
  fs.trainingRecruitmentExpenses=data.filter(k=>k.propName=='trainingRecruitmentExpenses').length==0?0:data.filter(k=>k.propName=='trainingRecruitmentExpenses')[0].value;
  fs.propertyOperationMaintenance=data.filter(k=>k.propName=='propertyOperationMaintenance').length==0?0:data.filter(k=>k.propName=='propertyOperationMaintenance')[0].value;
  fs.iTHardwareSoftwareExpenses=data.filter(k=>k.propName=='iTHardwareSoftwareExpenses').length==0?0:data.filter(k=>k.propName=='iTHardwareSoftwareExpenses')[0].value;
  fs.communityCharges=data.filter(k=>k.propName=='communityCharges').length==0?0:data.filter(k=>k.propName=='communityCharges')[0].value;
  fs.sharedServiceCharges=data.filter(k=>k.propName=='sharedServiceCharges').length==0?0:data.filter(k=>k.propName=='sharedServiceCharges')[0].value;
  fs.totalGeneralAdministrativeExpenses=data.filter(k=>k.propName=='totalGeneralAdministrativeExpenses').length==0?0:data.filter(k=>k.propName=='totalGeneralAdministrativeExpenses')[0].value;
  fs.grossOperatingProfit=data.filter(k=>k.propName=='grossOperatingProfit').length==0?0:data.filter(k=>k.propName=='grossOperatingProfit')[0].value;
  fs.nonOperatingExpenses=data.filter(k=>k.propName=='nonOperatingExpenses').length==0?0:data.filter(k=>k.propName=='nonOperatingExpenses')[0].value;
  fs.rentStaffAccommodation=data.filter(k=>k.propName=='rentStaffAccommodation').length==0?0:data.filter(k=>k.propName=='rentStaffAccommodation')[0].value;
  fs.depreciation=data.filter(k=>k.propName=='depreciation').length==0?0:data.filter(k=>k.propName=='depreciation')[0].value;
  fs.legalprofessionalExpenses=data.filter(k=>k.propName=='legalprofessionalExpenses').length==0?0:data.filter(k=>k.propName=='legalprofessionalExpenses')[0].value;
  fs.visaImmigrationFees=data.filter(k=>k.propName=='visaImmigrationFees').length==0?0:data.filter(k=>k.propName=='visaImmigrationFees')[0].value;
  fs.amortizationofPreOpeningexpenses=data.filter(k=>k.propName=='amortizationofPreOpeningexpenses').length==0?0:data.filter(k=>k.propName=='amortizationofPreOpeningexpenses')[0].value;
  fs.managementFeesIncentiveDirectorsFees=data.filter(k=>k.propName=='managementFeesIncentiveDirectorsFees').length==0?0:data.filter(k=>k.propName=='managementFeesIncentiveDirectorsFees')[0].value;
  fs.sponsorfee=data.filter(k=>k.propName=='sponsorfee').length==0?0:data.filter(k=>k.propName=='sponsorfee')[0].value;
  fs.licenseFee=data.filter(k=>k.propName=='licenseFee').length==0?0:data.filter(k=>k.propName=='licenseFee')[0].value;
  fs.governmentTaxes=data.filter(k=>k.propName=='governmentTaxes').length==0?0:data.filter(k=>k.propName=='governmentTaxes')[0].value;
  fs.finesPenalties=data.filter(k=>k.propName=='finesPenalties').length==0?0:data.filter(k=>k.propName=='finesPenalties')[0].value;
  fs.gainLossonsaleofInvestmentsAssets=data.filter(k=>k.propName=='gainLossonsaleofInvestmentsAssets').length==0?0:data.filter(k=>k.propName=='gainLossonsaleofInvestmentsAssets')[0].value;
  fs.profitLossonRevaluationofInvestmentsAssets=data.filter(k=>k.propName=='profitLossonRevaluationofInvestmentsAssets').length==0?0:data.filter(k=>k.propName=='profitLossonRevaluationofInvestmentsAssets')[0].value;
  fs.financeChargeBankCharge=data.filter(k=>k.propName=='financeChargeBankCharge').length==0?0:data.filter(k=>k.propName=='financeChargeBankCharge')[0].value;
  fs.creditCardCommission=data.filter(k=>k.propName=='creditCardCommission').length==0?0:data.filter(k=>k.propName=='creditCardCommission')[0].value;
  fs.insurance=data.filter(k=>k.propName=='insurance').length==0?0:data.filter(k=>k.propName=='insurance')[0].value;
  fs.totalNonOperatingExpenses=data.filter(k=>k.propName=='totalNonOperatingExpenses').length==0?0:data.filter(k=>k.propName=='totalNonOperatingExpenses')[0].value;
  fs.netProfit=data.filter(k=>k.propName=='netProfit').length==0?0:data.filter(k=>k.propName=='netProfit')[0].value;
  fs.reserves=data.filter(k=>k.propName=='reserves').length==0?0:data.filter(k=>k.propName=='reserves')[0].value;
  fs.netProfitAfterReservesForROICalculation=data.filter(k=>k.propName=='netProfitAfterReservesForROICalculation').length==0?0:data.filter(k=>k.propName=='netProfitAfterReservesForROICalculation')[0].value;
  fs.netProfitCheckPleaseentermanually=data.filter(k=>k.propName=='netProfitCheckPleaseentermanually').length==0?0:data.filter(k=>k.propName=='netProfitCheckPleaseentermanually')[0].value;
  fs.financialStatementCoveringMonths=data.filter(k=>k.propName=='financialStatementCoveringMonths').length==0?0:data.filter(k=>k.propName=='financialStatementCoveringMonths')[0].value;
  fs.numberofOccupiedRoomsPeryear=data.filter(k=>k.propName=='numberofOccupiedRoomsPeryear').length==0?0:data.filter(k=>k.propName=='numberofOccupiedRoomsPeryear')[0].value;
  fs.locationofEstablishment=data.filter(k=>k.propName=='locationofEstablishment').length==0?0:data.filter(k=>k.propName=='locationofEstablishment')[0].value;
  fs.typeofEstablishment=data.filter(k=>k.propName=='typeofEstablishment').length==0?0:data.filter(k=>k.propName=='typeofEstablishment')[0].value;
  fs.assets=data.filter(k=>k.propName=='assets').length==0?0:data.filter(k=>k.propName=='assets')[0].value;0
  fs.currentAssetShortTerm=data.filter(k=>k.propName=='currentAssetShortTerm').length==0?0:data.filter(k=>k.propName=='currentAssetShortTerm')[0].value;
  fs.inventories=data.filter(k=>k.propName=='inventories').length==0?0:data.filter(k=>k.propName=='inventories')[0].value;
  fs.food=data.filter(k=>k.propName=='food').length==0?0:data.filter(k=>k.propName=='food')[0].value;0
  fs.beverages=data.filter(k=>k.propName=='beverages').length==0?0:data.filter(k=>k.propName=='beverages')[0].value;
  fs.tobacco=data.filter(k=>k.propName=='tobacco').length==0?0:data.filter(k=>k.propName=='tobacco')[0].value;
  fs.generalStores=data.filter(k=>k.propName=='generalStores').length==0?0:data.filter(k=>k.propName=='generalStores')[0].value;
  fs.linen=data.filter(k=>k.propName=='linen').length==0?0:data.filter(k=>k.propName=='linen')[0].value;0
  fs.kitchenware=data.filter(k=>k.propName=='kitchenware').length==0?0:data.filter(k=>k.propName=='kitchenware')[0].value;
  fs.totalCurrentAssetShortTerm=data.filter(k=>k.propName=='totalCurrentAssetShortTerm').length==0?0:data.filter(k=>k.propName=='totalCurrentAssetShortTerm')[0].value;
  fs.tradeOtherReceivables=data.filter(k=>k.propName=='tradeOtherReceivables').length==0?0:data.filter(k=>k.propName=='tradeOtherReceivables')[0].value;
  fs.tradeReceivables=data.filter(k=>k.propName=='tradeReceivables').length==0?0:data.filter(k=>k.propName=='tradeReceivables')[0].value;
  fs.prepaidExpense=data.filter(k=>k.propName=='prepaidExpense').length==0?0:data.filter(k=>k.propName=='prepaidExpense')[0].value;
  fs.refundableDeposits=data.filter(k=>k.propName=='refundableDeposits').length==0?0:data.filter(k=>k.propName=='refundableDeposits')[0].value;
  fs.totalTradeOtherReceivables=data.filter(k=>k.propName=='totalTradeOtherReceivables').length==0?0:data.filter(k=>k.propName=='totalTradeOtherReceivables')[0].value;
  fs.cashCashEquivalents=data.filter(k=>k.propName=='cashCashEquivalents').length==0?0:data.filter(k=>k.propName=='cashCashEquivalents')[0].value;
  fs.cashinHand=data.filter(k=>k.propName=='cashinHand').length==0?0:data.filter(k=>k.propName=='cashinHand')[0].value;
  fs.cashatBank=data.filter(k=>k.propName=='cashatBank').length==0?0:data.filter(k=>k.propName=='cashatBank')[0].value;
  fs.fixedDeposits=data.filter(k=>k.propName=='fixedDeposits').length==0?0:data.filter(k=>k.propName=='fixedDeposits')[0].value;
  fs.totalCashCashEquivalents=data.filter(k=>k.propName=='totalCashCashEquivalents').length==0?0:data.filter(k=>k.propName=='totalCashCashEquivalents')[0].value;
  fs.nonCurrentAssetLongTerm=data.filter(k=>k.propName=='nonCurrentAssetLongTerm').length==0?0:data.filter(k=>k.propName=='nonCurrentAssetLongTerm')[0].value;
  fs.totalNonCurrentAssetLongTerm=data.filter(k=>k.propName=='totalNonCurrentAssetLongTerm').length==0?0:data.filter(k=>k.propName=='totalNonCurrentAssetLongTerm')[0].value;
  fs.fixedAsset=data.filter(k=>k.propName=='fixedAsset').length==0?0:data.filter(k=>k.propName=='fixedAsset')[0].value;
  fs.landBuilding=data.filter(k=>k.propName=='landBuilding').length==0?0:data.filter(k=>k.propName=='landBuilding')[0].value;
  fs.furnitureFixture=data.filter(k=>k.propName=='furnitureFixture').length==0?0:data.filter(k=>k.propName=='furnitureFixture')[0].value;
  fs.officeEquipments=data.filter(k=>k.propName=='officeEquipments').length==0?0:data.filter(k=>k.propName=='officeEquipments')[0].value;
  fs.vehicles=data.filter(k=>k.propName=='vehicles').length==0?0:data.filter(k=>k.propName=='vehicles')[0].value;
  fs.otherOperationalEquipments=data.filter(k=>k.propName=='otherOperationalEquipments').length==0?0:data.filter(k=>k.propName=='otherOperationalEquipments')[0].value;
  fs.totalFixedAsset=data.filter(k=>k.propName=='totalFixedAsset').length==0?0:data.filter(k=>k.propName=='totalFixedAsset')[0].value;
  fs.intangibleAsset=data.filter(k=>k.propName=='intangibleAsset').length==0?0:data.filter(k=>k.propName=='intangibleAsset')[0].value;
  fs.franchise=data.filter(k=>k.propName=='franchise').length==0?0:data.filter(k=>k.propName=='franchise')[0].value;
  fs.goodwill=data.filter(k=>k.propName=='goodwill').length==0?0:data.filter(k=>k.propName=='goodwill')[0].value;
  fs.software=data.filter(k=>k.propName=='software').length==0?0:data.filter(k=>k.propName=='software')[0].value;
  fs.totalIntangibleAsset=data.filter(k=>k.propName=='totalIntangibleAsset').length==0?0:data.filter(k=>k.propName=='totalIntangibleAsset')[0].value;
  fs.totalAssets=data.filter(k=>k.propName=='totalAssets').length==0?0:data.filter(k=>k.propName=='totalAssets')[0].value;
  fs.equityLiabilities=data.filter(k=>k.propName=='equityLiabilities').length==0?0:data.filter(k=>k.propName=='equityLiabilities')[0].value;
  fs.equity=data.filter(k=>k.propName=='equity').length==0?0:data.filter(k=>k.propName=='equity')[0].value;0
  fs.ownersFundsShareCapital=data.filter(k=>k.propName=='ownersFundsShareCapital').length==0?0:data.filter(k=>k.propName=='ownersFundsShareCapital')[0].value;
  fs.shareholdersCurrentAccountDrawings=data.filter(k=>k.propName=='shareholdersCurrentAccountDrawings').length==0?0:data.filter(k=>k.propName=='shareholdersCurrentAccountDrawings')[0].value;
  fs.retainedEarnings=data.filter(k=>k.propName=='retainedEarnings').length==0?0:data.filter(k=>k.propName=='retainedEarnings')[0].value;
  fs.reserveforFurnitureFixture=data.filter(k=>k.propName=='reserveforFurnitureFixture').length==0?0:data.filter(k=>k.propName=='reserveforFurnitureFixture')[0].value;
  fs.statutoryReserveLegalReserve=data.filter(k=>k.propName=='statutoryReserveLegalReserve').length==0?0:data.filter(k=>k.propName=='statutoryReserveLegalReserve')[0].value;
  fs.otherReserves=data.filter(k=>k.propName=='otherReserves').length==0?0:data.filter(k=>k.propName=='otherReserves')[0].value;
  fs.netEquity=data.filter(k=>k.propName=='netEquity').length==0?0:data.filter(k=>k.propName=='netEquity')[0].value;
  fs.liabilities=data.filter(k=>k.propName=='liabilities').length==0?0:data.filter(k=>k.propName=='liabilities')[0].value;
  fs.nonCurrentLiabilityLongTerm=data.filter(k=>k.propName=='nonCurrentLiabilityLongTerm').length==0?0:data.filter(k=>k.propName=='nonCurrentLiabilityLongTerm')[0].value;
  fs.provision=data.filter(k=>k.propName=='provision').length==0?0:data.filter(k=>k.propName=='provision')[0].value;
  fs.employeesendofservicebenefits=data.filter(k=>k.propName=='employeesendofservicebenefits').length==0?0:data.filter(k=>k.propName=='employeesendofservicebenefits')[0].value;
  fs.totalNonCurrentLiabilityLongTerm=data.filter(k=>k.propName=='totalNonCurrentLiabilityLongTerm').length==0?0:data.filter(k=>k.propName=='totalNonCurrentLiabilityLongTerm')[0].value;
  fs.currentLiabilityShortTerm=data.filter(k=>k.propName=='currentLiabilityShortTerm').length==0?0:data.filter(k=>k.propName=='currentLiabilityShortTerm')[0].value;
  fs.tradePayables=data.filter(k=>k.propName=='tradePayables').length==0?0:data.filter(k=>k.propName=='tradePayables')[0].value;
  fs.bankOverdraft=data.filter(k=>k.propName=='bankOverdraft').length==0?0:data.filter(k=>k.propName=='bankOverdraft')[0].value;
  fs.deferredIncome=data.filter(k=>k.propName=='deferredIncome').length==0?0:data.filter(k=>k.propName=='deferredIncome')[0].value;
  fs.advancesfromCustomer=data.filter(k=>k.propName=='advancesfromCustomer').length==0?0:data.filter(k=>k.propName=='advancesfromCustomer')[0].value;
  fs.accruedExpenses=data.filter(k=>k.propName=='accruedExpenses').length==0?0:data.filter(k=>k.propName=='accruedExpenses')[0].value;
  fs.otherPayables=data.filter(k=>k.propName=='otherPayables').length==0?0:data.filter(k=>k.propName=='otherPayables')[0].value;
  fs.totalCurrentLiabilityShortTerm=data.filter(k=>k.propName=='totalCurrentLiabilityShortTerm').length==0?0:data.filter(k=>k.propName=='totalCurrentLiabilityShortTerm')[0].value;
  fs.totalLiabilities=data.filter(k=>k.propName=='totalLiabilities').length==0?0:data.filter(k=>k.propName=='totalLiabilities')[0].value;
  fs.waterfront=data.filter(k=>k.propName=='waterfront').length==0?0:data.filter(k=>k.propName=='waterfront')[0].value;
  fs.beachside=data.filter(k=>k.propName=='beachside').length==0?0:data.filter(k=>k.propName=='beachside')[0].value;
  fs.cityHotels=data.filter(k=>k.propName=='cityHotels').length==0?0:data.filter(k=>k.propName=='cityHotels')[0].value;
  fs.heritage=data.filter(k=>k.propName=='heritage').length==0?0:data.filter(k=>k.propName=='heritage')[0].value;
  fs.desert=data.filter(k=>k.propName=='desert').length==0?0:data.filter(k=>k.propName=='desert')[0].value;0}
export class FS {
  particulars: number;
  operatingRevenues: number;
  roomsNetRevenueafterTaxesFees: number;
  foodBeverageInclusiveofTobacco: number;
  OperatingRevenues_otherDepartments: number;//10
  otherIncomeIncludesForexGainsLoss: number;
  rentalsincome: number;
  serviceChargeRooms: number;
  serviceChargeFB: number;
  serviceChargeOthers: number;
  totalOperatingrevenue: number;
  departmentalExpenses: number;
  rooms: number;
  OperatingExpenses_salariesWages: number;//24
  OperatingExpenses_otherPayrollRelatedExpenses: number;//25
  OperatingExpenses_serviceCharge: number;//26
  //otherExpenses : number;
  commission: number;
  reservationfees: number;
  Rooms_OtherExpenses_laundryDryCleaning: number;//31
  uniform: number;
  complementaryServices: number;
  Rooms_OtherExpenses_guestSupplies: number;//34
  guestEntertainment: number;
  contractedServices: number;
  houseKeeping: number;
  Rooms_OtherExpenses_printingStationery: number;//38
  operatingSupplies: number;
  cableTVRadio: number;
  plantFlowers: number;
  newsPapers: number;
  guestTransportation: number;
  Rooms_OtherExpenses_others: number;//44
  Rooms_OtherExpenses_totalDepartmentalExpenses: number;//46
  // directCost : number;
  foodBeverage: number;
  payrollRelatedExpenses: number;
  PayrollRelatedExpenses_salariesWages: number;//55
  PayrollRelated_Expenses_otherPayrollRelatedExpenses: number;//56
  PayrollRelated_serviceCharge: number;//57
  //otherExpenses : number;
  OtherExpenses_laundryDryCleaning: number;//60
  fBmanagementFee: number;
  paperSupplies: number;
  musicEntertainment: number;
  OtherExpenses_printingStationery: number;//64
  uniforms: number;
  operatingEquipment: number;
  guestSupplies: number;
  linenGlasswareSilverWare: number;
  training: number;
  commissions: number;
  kitchenFuel: number;
  contractCleaningServices: number;
  cleaningSupplies: number;
  licensefees: number;
  decoration: number;
  transportation: number;
  PayrollRelatedExpenses_others: number;//77
  PayrollRelatedExpenses_totalDepartmentalExpenses: number;//79

  OtherDepartments_salariesWages: number;//83
  OtherDepartments_otherPayrollRelatedExpenses: number;//84
  OtherDepartments_serviceCharge: number;//85
  directCost: number;
  OtherDepartments_otherExpenses: number;//88
  OtherDepartments_totalDepartmentalExpenses: number;//90
  totalOperatingIncome: number;
  generalAdministrativeExpenses: number;
  GeneralAdministrativeExpenses_salariesWages: number;//97
  GeneralAdministrativeExpenses_otherPayrollRelatedExpenses: number;//98
  GeneralAdministrativeExpenses_serviceCharge: number;//99
  travellingConveyance: number;
  franchiseFee: number;
  salesMarketingExpensesAdvertisementSponsorshipBusinessPromotion: number;
  rentHotelBuilding: number;
  energyCostUtilitiesExpensesCommunicationInternetcharges: number;
  postageCourier: number;
  securityExpenses: number;
  trainingRecruitmentExpenses: number;
  propertyOperationMaintenance: number;
  iTHardwareSoftwareExpenses: number;
  communityCharges: number;
  sharedServiceCharges: number;
  GeneralAdministrativeExpenses_otherExpenses: number;//113
  totalGeneralAdministrativeExpenses: number;
  grossOperatingProfit: number;
  nonOperatingExpenses: number;
  rentStaffAccommodation: number;
  depreciation: number;
  legalprofessionalExpenses: number;
  visaImmigrationFees: number;
  amortizationofPreOpeningexpenses: number;
  managementFeesIncentiveDirectorsFees: number;
  sponsorfee: number;
  licenseFee: number;
  governmentTaxes: number;
  finesPenalties: number;
  gainLossonsaleofInvestmentsAssets: number;
  profitLossonRevaluationofInvestmentsAssets: number;
  financeChargeBankCharge: number;
  creditCardCommission: number;
  insurance: number;
  NonOperatingExpenses_otherExpenses: number;//135
  totalNonOperatingExpenses: number;
  netProfit: number;
  reserves: number;
  netProfitAfterReservesForROICalculation: number;
  netProfitCheckPleaseentermanually: number;
  NetProfit_mustbe: number;//146
  financialStatementCoveringMonths: number;
  numberofOccupiedRoomsPeryear: number;
  locationofEstablishment: number;
  typeofEstablishment: number;
  assets: number;
  currentAssetShortTerm: number;
  inventories: number;
  food: number;
  beverages: number;
  tobacco: number;
  generalStores: number;
  linen: number;
  kitchenware: number;
  CurrentAssetShortTerm_others: number;//169
  totalCurrentAssetShortTerm: number;
  tradeOtherReceivables: number;
  tradeReceivables: number;
  prepaidExpense: number;
  refundableDeposits: number;
  TradeOtherReceivables_dueFromRelatedParties: number;//176
  TradeOtherReceivables_investments: number;//177
  TradeOtherReceivables_otherReceivables: number;//178
  totalTradeOtherReceivables: number;
  cashCashEquivalents: number;
  cashinHand: number;
  cashatBank: number;
  CashCashEquivalents_restrictedCash: number;//184
  fixedDeposits: number;
  totalCashCashEquivalents: number;
  nonCurrentAssetLongTerm: number;
  NonCurrentAssetLongTerm_dueFromRelatedParties: number;//189
  NonCurrentAssetLongTerm_otherReceivables: number;//190
  NonCurrentAssetLongTerm_investments: number;//191
  NonCurrentAssetLongTerm_restrictedCash: number;//192
  totalNonCurrentAssetLongTerm: number;
  fixedAsset: number;
  landBuilding: number;
  furnitureFixture: number;
  officeEquipments: number;
  vehicles: number;
  otherOperationalEquipments: number;
  totalFixedAsset: number;
  intangibleAsset: number;
  franchise: number;
  goodwill: number;
  software: number;
  TotalNonCurrentAssetLongTerm_others: number;//205
  totalIntangibleAsset: number;
  totalAssets: number;
  equityLiabilities: number;
  equity: number;
  ownersFundsShareCapital: number;
  shareholdersCurrentAccountDrawings: number;
  retainedEarnings: number;
  reserveforFurnitureFixture: number;
  statutoryReserveLegalReserve: number;
  otherReserves: number;
  netEquity: number;
  liabilities: number;
  nonCurrentLiabilityLongTerm: number;
  nonCurrentLiabilityLongTerm_borrowing: number;//224
  provision: number;
  nonCurrentLiabilityLongTerm_loan: number;//226
  TradeOtherReceivables_dueToRelatedParties: number;//176
  employeesendofservicebenefits: number;
  totalNonCurrentLiabilityLongTerm: number;
  currentLiabilityShortTerm: number;
  tradePayables: number;
  currentLiabilityShortTerm_loan: number;//232
  bankOverdraft: number;
  deferredIncome: number;
  advancesfromCustomer: number;
  accruedExpenses: number;
  otherPayables: number;
  NonCurrentAssetLongTerm_dueToRelatedParties: number;//189
  CurrentLiabilityShortTerm_borrowing: number;//239
  totalCurrentLiabilityShortTerm: number;
  totalLiabilities: number;
  TotalLiabilities_mustbe: number;//243
  waterfront: number;
  beachside: number;
  cityHotels: number;
  heritage: number;
  desert: number;
}