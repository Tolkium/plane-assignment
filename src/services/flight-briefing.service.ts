import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { groupBy } from "lodash-es";
import { IBriefingForm } from "../components/flight-briefing/flight-briefing.component";

@Injectable({
   providedIn: "root",
})
export class FlightBriefingService {
   private readonly apiUrl = "https://ogcie.iblsoft.com/ria/opmetquery";
   private resultsSubject = new BehaviorSubject<ResultQueryGroups | null>(null);

   readonly results$ = this.resultsSubject.asObservable();

   constructor(private readonly http: HttpClient) {}

   submitBriefingRequest(formData: IBriefingForm): Observable<ResultQueryGroups | null> {
      const params = this.extractRequestParams(formData);
      return this.http.post<ApiResponse>(this.apiUrl, this.formatRequestBody(params)).pipe(
         map(this.processResponse),
         tap((resultQueryGroups) => this.resultsSubject.next(resultQueryGroups)),
      );
   }

   private extractRequestParams(formData: IBriefingForm): BriefingRequestParams {
      const reportTypes: ReportType[] = REPORT_TYPE_KEYS.filter((key) => formData[key as keyof IBriefingForm] === true).map(
         (key: string) => key.toUpperCase() as ReportType,
      );

      const stations = formData.stations ? formData.stations.trim().split(/\s+/) : null;
      const countries = formData.countries ? formData.countries.trim().split(/\s+/) : null;

      return { reportTypes, ...(stations ? { stations } : {}), ...(countries ? { countries } : {}) };
   }

   private formatRequestBody(params: BriefingRequestParams): ApiRequest {
      return {
         id: "test-query",
         method: "query",
         params: [
            {
               id: "briefing01",
               ...params,
            },
         ],
      };
   }

   private processResponse = (response: ApiResponse): ResultQueryGroups | null => {
      if (response?.error) {
         this.handleError(response.error);
         return null;
      }

      if (response?.result) {
         const formattedResults = this.formatResults(response.result);
         return groupBy(formattedResults, "stationId") as ResultQueryGroups;
      }
      return null;
   };

   private formatResults(results: ApiResult[]): ResultQuery[] {
      return results.map(({ stationId, queryType, reportTime, text }) => ({
         stationId,
         queryType,
         reportTime,
         text,
      }));
   }

   private handleError = (error: { message: string }): Observable<never> => {
      const errorMessage = error?.message ? error.message : error ? error : "Unknown error";
      console.error("An error occurred:", errorMessage);
      throw error;
   };
}

export const REPORT_TYPE_KEYS = ["metar", "taf_longtaf", "sigmet_all"] as const;

export type ReportType = (typeof REPORT_TYPE_KEYS)[number];
interface ResultQuery {
   stationId: string;
   queryType: string;
   reportTime: string;
   text: string;
}

export type ResultQueryGroups = Record<string, Omit<ResultQuery, "stationId">[]>;

interface BriefingRequestParams {
   reportTypes: ReportType[];
   stations?: string[];
   countries?: string[];
}

interface ApiRequest {
   id: string;
   method: string;
   params: ({ id: string } & BriefingRequestParams)[];
}

type ApiError = { code: number; message: string };
interface ApiResponse {
   result?: ApiResult[];
   error?: ApiError | null;
   [key: string]: unknown;
}

interface ApiResult {
   stationId: string;
   queryType: string;
   reportTime: string;
   text: string;
   [key: string]: unknown;
}
