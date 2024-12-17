import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from "@angular/forms";
import { NgClass, UpperCasePipe } from "@angular/common";
import { FlightBriefingService, ReportType, REPORT_TYPE_KEYS } from "../../services/flight-briefing.service";
import { ClickEffectDirective } from "../../directives/click-effect.directive";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";

export type IBriefingForm = {
   metar: boolean;
   taf_longtaf: boolean;
   sigmet_all: boolean;
   stations: string;
   countries: string;
};

@Component({
   selector: "app-flight-briefing",
   standalone: true,
  imports: [ReactiveFormsModule, ClickEffectDirective, FormsModule, UpperCasePipe, NgClass],
   templateUrl: "./flight-briefing.component.html",
})
export class FlightBriefingComponent implements OnInit {
   protected submitError: string = "";
   protected briefingForm!: FormGroup;
   protected readonly reportTypeKeys = REPORT_TYPE_KEYS;

   constructor(
      private readonly fb: FormBuilder,
      private readonly flightBriefingService: FlightBriefingService,
   ) {}

   ngOnInit() {
      this.briefingForm = this.fb.group(
         {
            metar: [false],
            taf_longtaf: [false],
            sigmet_all: [false],
            stations: ["", [this.icaoCodeValidator]],
            countries: ["", [this.wmoCodeValidator]],
         },
         { validators: [this.atLeastOneReportValidator, this.atLeastOneLocationValidator] },
      );
   }

   protected atLeastOneReportValidator(group: FormGroup) {
      const metar = group.get("metar")?.value;
      const taf = group.get("taf_longtaf")?.value;
      const sigmet = group.get("sigmet_all")?.value;
      return metar || taf || sigmet ? null : { atLeastOneReportRequired: true };
   }

   protected atLeastOneLocationValidator(group: FormGroup) {
      const stations = group.get("stations")?.value;
      const countries = group.get("countries")?.value;
      return stations.trim() || countries.trim() ? null : { atLeastOneLocationRequired: true };
   }

   protected icaoCodeValidator({ value }: AbstractControl): ValidationErrors | null {
      if (!value) {
         return null;
      }

      const isValidIcao = (icao: string) => /^[A-Z]{4}$/.test(icao);
      const icaos = value.trim().split(/\s+/);
      const validIcaos = icaos.every(isValidIcao);
      return validIcaos ? null : { invalidIcaoCodes: true };
   }

   protected wmoCodeValidator({ value }: AbstractControl): ValidationErrors | null {
      if (!value) {
         return null;
      }
      const isvalidWmo = (wmo: string) => /^[A-Z]{2}$/.test(wmo);
      const wmos = value.trim().split(/\s+/);
      const validWmos = wmos.every(isvalidWmo);
      return validWmos ? null : { invalidWmoCodes: true };
   }

   protected onSubmit() {
      if (!this.briefingForm.valid) {
         return;
      }

      this.flightBriefingService
         .submitBriefingRequest(this.briefingForm.value as IBriefingForm)
         .pipe(
            catchError((error) => {
               console.error("Error submitting briefing request", error);
               this.submitError = error?.message
                  ? error.message
                  : error
                    ? error
                    : "An error occurred while submitting the request. Please try again.";
               return EMPTY;
            }),
         )
         .subscribe();
   }

   protected getReportTypeLabel(reportType: ReportType) {
      switch (reportType) {
         case "metar":
            return "METAR";
         case "taf_longtaf":
            return "TAF";
         case "sigmet_all":
            return "SIGMET";
      }
   }
}
