import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { HttpHeaders, HttpResponseBase, HttpResponse, HttpClient } from '@angular/common/http';

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
@Injectable()
export class ApplicationsService {

    private http: HttpClient;
    //private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        //AppConsts.remoteServiceBaseUrl  = baseUrl ? baseUrl : "";
    }



    getAllCanBeBorrowded(keyword: string | undefined, isActive: boolean | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<EstablishmentDtoPagedResultDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/GetAllCanBeBorrowded?";
        if (keyword === null)
            throw new Error("The parameter 'keyword' cannot be null.");
        else if (keyword !== undefined)
            url_ += "Keyword=" + encodeURIComponent("" + keyword) + "&";
        if (isActive === null)
            throw new Error("The parameter 'isActive' cannot be null.");
        else if (isActive !== undefined)
            url_ += "IsActive=" + encodeURIComponent("" + isActive) + "&";
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAll(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAll(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDtoPagedResultDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDtoPagedResultDto>><any>_observableThrow(response_);
        }));
    }

    getAll(keyword: string | undefined, isActive: boolean | undefined, skipCount: number | undefined, maxResultCount: number | undefined): Observable<EstablishmentDtoPagedResultDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/GetAll?";
        if (keyword === null)
            throw new Error("The parameter 'keyword' cannot be null.");
        else if (keyword !== undefined)
            url_ += "Keyword=" + encodeURIComponent("" + keyword) + "&";
        if (isActive === null)
            throw new Error("The parameter 'isActive' cannot be null.");
        else if (isActive !== undefined)
            url_ += "IsActive=" + encodeURIComponent("" + isActive) + "&";
        if (skipCount === null)
            throw new Error("The parameter 'skipCount' cannot be null.");
        else if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        if (maxResultCount === null)
            throw new Error("The parameter 'maxResultCount' cannot be null.");
        else if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGetAll(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAll(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDtoPagedResultDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDtoPagedResultDto>><any>_observableThrow(response_);
        }));
    }

    protected processGetAll(response: HttpResponseBase): Observable<EstablishmentDtoPagedResultDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = EstablishmentDtoPagedResultDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<EstablishmentDtoPagedResultDto>(<any>null);
    }

    get(id: number | undefined): Observable<EstablishmentDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/Get?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGet(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDto>><any>_observableThrow(response_);
        }));
    }
    getWithAttachmets(id: number | undefined): Observable<EstablishmentDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/GetWithAttachmets?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processGet(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGet(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDto>><any>_observableThrow(response_);
        }));
    }
    protected processGet(response: HttpResponseBase): Observable<EstablishmentDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = EstablishmentDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<EstablishmentDto>(<any>null);
    }


    update(body: EstablishmentDto | undefined): Observable<EstablishmentDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/Update";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processUpdate(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processUpdate(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDto>><any>_observableThrow(response_);
        }));
    }

    protected processUpdate(response: HttpResponseBase): Observable<EstablishmentDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = EstablishmentDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<EstablishmentDto>(<any>null);
    }

    delete(id: number | undefined): Observable<void> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/Delete?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "Id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDelete(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDelete(<any>response_);
                } catch (e) {
                    return <Observable<void>><any>_observableThrow(e);
                }
            } else
                return <Observable<void>><any>_observableThrow(response_);
        }));
    }

    protected processDelete(response: HttpResponseBase): Observable<void> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return _observableOf<void>(<any>null);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<void>(<any>null);
    }

    create(body: EstablishmentDto | undefined): Observable<EstablishmentDto> {
        let url_ = AppConsts.remoteServiceBaseUrl + "/api/services/app/Item/Create";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            })
        };

        return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processCreate(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processCreate(<any>response_);
                } catch (e) {
                    return <Observable<EstablishmentDto>><any>_observableThrow(e);
                }
            } else
                return <Observable<EstablishmentDto>><any>_observableThrow(response_);
        }));
    }

    protected processCreate(response: HttpResponseBase): Observable<EstablishmentDto> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
                (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = EstablishmentDto.fromJS(resultData200);
                return _observableOf(result200);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<EstablishmentDto>(<any>null);
    }


}


export class EstablishmentDtoPagedResultDto implements IEstablishmentDtoPagedResultDto {
    totalCount: number;
    items: EstablishmentDto[] | undefined;

    constructor(data?: IEstablishmentDtoPagedResultDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.totalCount = data["totalCount"];
            if (Array.isArray(data["items"])) {
                this.items = [] as any;
                for (let item of data["items"])
                    this.items.push(EstablishmentDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): EstablishmentDtoPagedResultDto {
        data = typeof data === 'object' ? data : {};
        let result = new EstablishmentDtoPagedResultDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        return data;
    }

    clone(): EstablishmentDtoPagedResultDto {
        const json = this.toJSON();
        let result = new EstablishmentDtoPagedResultDto();
        result.init(json);
        return result;
    }
}

export interface IEstablishmentDtoPagedResultDto {
    totalCount: number;
    items: EstablishmentDto[] | undefined;
}

export class EstablishmentDto implements IEstablishmentDto {

    id: number | undefined;
    nameAr: string | undefined;
    nameEn: string | undefined;
    classification: string | undefined;
    licenseNumber: string | undefined;
    financialYearFrom: string | undefined;
    financialYearTo: string | undefined;
    noOfRooms: number | undefined;
    reportStatus: number | undefined;
    financialYear: number | undefined;


    constructor(data?: IEstablishmentDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.nameEn = data["nameEn"];
            this.nameAr = data["nameAr"];
            this.classification = data["classification"];
            this.licenseNumber = data["licenseNumber"];
            this.financialYearFrom = data["financialYearFrom"];
            this.financialYearTo = data["financialYearTo"];
            this.noOfRooms = data["noOfRooms"];
            this.reportStatus = data["reportStatus"];
            this.financialYear = data["financialYear"];
        }
    }

    static fromJS(data: any): EstablishmentDto {
        data = typeof data === 'object' ? data : {};
        let result = new EstablishmentDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["nameEn"] = this.nameEn;
        data["nameAr"] = this.nameAr;
        data["classification"] = this.classification;
        data["licenseNumber"] = this.licenseNumber;
        data["financialYearFrom"] = this.financialYearFrom;
        data["financialYearTo"] = this.financialYearTo;
        data["noOfRooms"] = this.noOfRooms;
        data["reportStatus"] = this.reportStatus;
        data["financialYear"] = this.financialYear;
        data["id"] = this.id;
        return data;
    }

    clone(): EstablishmentDto {
        const json = this.toJSON();
        let result = new EstablishmentDto();
        result.init(json);
        return result;
    }
}

export interface IEstablishmentDto {
    id: number | undefined;
    nameAr: string | undefined;
    nameEn: string | undefined;
    classification: string | undefined;
    licenseNumber: string | undefined;
    financialYearFrom: string | undefined;
    financialYearTo: string | undefined;
    noOfRooms: number | undefined;
    reportStatus: number | undefined;
    financialYear: number | undefined;

}
export class AttachmentDto implements IAttachmentDto {
    id: number | undefined;
    fileId: string | undefined;
    type: string | undefined;
    fileName: string | undefined;
    description: string | undefined;
    itemId: string | undefined;
    item: string | undefined;
    fileData: string | undefined;
    isItemPhoto: boolean | undefined;
    constructor(data?: IAttachmentDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            
            this.fileData = data["fileData"];
            this.fileId = data["fileId"];
            this.type = data["type"];
            this.fileName = data["fileName"];
            this.description = data["description"];
            this.itemId = data["itemId"];
            this.item = data["item"];
            this.id = data["id"];
            this.isItemPhoto = data["isItemPhoto"];
        }
    }

    static fromJS(data: any): AttachmentDto {
        data = typeof data === 'object' ? data : {};
        let result = new AttachmentDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["fileData"] = this.fileData;
        data["fileId"] = this.fileId;
        data["type"] = this.type;
        data["fileName"] = this.fileName;
        data["description"] = this.description;
        data["itemId"] = this.itemId;
        data["item"] = this.item;
        data["isItemPhoto"] = this.isItemPhoto;
        data["id"] = this.id;
        return data;
    }

    clone(): AttachmentDto {
        const json = this.toJSON();
        let result = new AttachmentDto();
        result.init(json);
        return result;
    }
}

export interface IAttachmentDto {
    id: number | undefined;
    fileId: string | undefined;
    type: string | undefined;
    fileName: string | undefined;
    description: string | undefined;
    itemId: string | undefined;
    item: string | undefined;
    fileData: string | undefined;
    isItemPhoto: boolean | undefined;
}


// export class UserInfoDtoPagedResultDto implements IUserInfoDtoPagedResultDto {
//     totalCount: number;
//     items: UserInfoDto[] | undefined;

//     constructor(data?: IUserInfoDtoPagedResultDto) {
//       if (data) {
//         for (var property in data) {
//           if (data.hasOwnProperty(property))
//             (<any>this)[property] = (<any>data)[property];
//         }
//       }
//     }

//     init(data?: any) {
//       if (data) {

//         if (data["totalCount"] === undefined) {
//           this.totalCount = data.length;
//         }
//         if (Array.isArray(data)) {
//           this.items = [] as any;
//           for (let item of data)
//             this.items.push(UserInfoDto.fromJS(item));
//         }
//       }
//     }

//     static fromJS(data: any): UserInfoDtoPagedResultDto {
//       data = typeof data === 'object' ? data : {};
//       let result = new UserInfoDtoPagedResultDto();
//       result.init(data);
//       return result;
//     }

//     toJSON(data?: any) {
//       data = typeof data === 'object' ? data : {};
//       data["totalCount"] = this.totalCount;
//       if (Array.isArray(this.items)) {
//         data["items"] = [];
//         for (let item of this.items)
//           data["items"].push(item.toJSON());
//       }
//       return data;
//     }

//     clone(): UserInfoDtoPagedResultDto {
//       const json = this.toJSON();
//       let result = new UserInfoDtoPagedResultDto();
//       result.init(json);
//       return result;
//     }
//   }

//   export interface IUserInfoDtoPagedResultDto {
//     totalCount: number;
//     items: UserInfoDto[] | undefined;
//   }


export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    if (result !== null && result !== undefined)
        return _observableThrow(result);
    else
        return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader();
            reader.onload = event => {
                observer.next((<any>event.target).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}