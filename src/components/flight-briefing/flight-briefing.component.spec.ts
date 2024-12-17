import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FlightBriefingComponent } from "./flight-briefing.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { AbstractControl } from "@angular/forms";

describe("AppFlightBriefingComponent", () => {
   let component: FlightBriefingComponent;
   let fixture: ComponentFixture<FlightBriefingComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [FlightBriefingComponent],
         providers: [provideHttpClient(), provideHttpClientTesting()],
      }).compileComponents();

      fixture = TestBed.createComponent(FlightBriefingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });

   describe("atLeastOneReportRequired validator", () => {
      it("should validate when at least one report (METAR, TAF, SIGMET) is provided", () => {
         component["briefingForm"].patchValue({
            metar: false,
            taf_longtaf: false,
            sigmet_all: false,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeTruthy();

         component["briefingForm"].patchValue({
            metar: true,
            taf_longtaf: false,
            sigmet_all: false,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();

         component["briefingForm"].patchValue({
            metar: false,
            taf_longtaf: true,
            sigmet_all: false,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();

         component["briefingForm"].patchValue({
            metar: false,
            taf_longtaf: false,
            sigmet_all: true,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();

         component["briefingForm"].patchValue({
            metar: true,
            taf_longtaf: true,
            sigmet_all: false,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();

         component["briefingForm"].patchValue({
            metar: false,
            taf_longtaf: true,
            sigmet_all: true,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();

         component["briefingForm"].patchValue({
            metar: true,
            taf_longtaf: true,
            sigmet_all: true,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeFalsy();
      });

      it("should not validate when no reports are provided", () => {
         component["briefingForm"].patchValue({
            metar: false,
            taf_longtaf: false,
            sigmet_all: false,
         });
         expect(component["briefingForm"].errors?.["atLeastOneReportRequired"]).toBeTruthy();
      });
   });

   describe("location validator", () => {
      it("should not validate when neither stations nor countries are provided", () => {
         component["briefingForm"].patchValue({
            stations: "",
            countries: "",
         });
         expect(component["briefingForm"].errors?.["atLeastOneLocationRequired"]).toBeTruthy();
      });

      it("should validate when only stations are provided", () => {
         component["briefingForm"].patchValue({
            stations: "KORD",
            countries: "",
         });
         expect(component["briefingForm"].errors?.["atLeastOneLocationRequired"]).toBeFalsy();
      });

      it("should validate when only countries are provided", () => {
         component["briefingForm"].patchValue({
            stations: "",
            countries: "AB",
         });
         expect(component["briefingForm"].errors?.["atLeastOneLocationRequired"]).toBeFalsy();
      });

      it("should validate when both stations and countries are provided", () => {
         component["briefingForm"].patchValue({
            stations: "KORD ABCD",
            countries: "AB",
         });
         expect(component["briefingForm"].errors?.["atLeastOneLocationRequired"]).toBeFalsy();
      });
   });

   describe("icaoCodeValidator", () => {
      it("should validate when multiple ICAO codes are provided separated by spaces", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KORD LAXA MCOV" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeFalsy();
      });

      it("should not validate when an invalid ICAO code is provided", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KORD LAX MCO123" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeTruthy();
      });

      it("should not validate when an ICAO code contains numbers", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KOR1" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeTruthy();
      });

      it("should not validate when an ICAO code contains special characters", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KOR@" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeTruthy();
      });

      it("should not validate when an ICAO code is less than 4 characters long", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KOR" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeTruthy();
      });

      it("should not validate when an ICAO code is more than 4 characters long", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "KORDE" } as AbstractControl);
         expect(icaoCodeValidator?.["invalidIcaoCodes"]).toBeTruthy();
      });

      it("should not validate when no ICAO codes are provided", () => {
         const icaoCodeValidator = component["icaoCodeValidator"]({ value: "" } as AbstractControl);
         expect(icaoCodeValidator).toBeNull();
      });
   });

   describe("wmoCodeValidator", () => {
      it("should validate when multiple WMO codes are provided separated by spaces", () => {
         const wmoCodeValidator = component["wmoCodeValidator"]({ value: "AB EF" } as AbstractControl);
         expect(wmoCodeValidator?.["invalidWmoCodes"]).toBeFalsy();
      });

      it("should not validate when an invalid WMO code is provided", () => {
         const wmoCodeValidator = component["wmoCodeValidator"]({ value: "12" } as AbstractControl);
         expect(wmoCodeValidator?.["invalidWmoCodes"]).toBeTruthy();
         const wmoCodeValidator1 = component["wmoCodeValidator"]({ value: "A1" } as AbstractControl);
         expect(wmoCodeValidator1?.["invalidWmoCodes"]).toBeTruthy();
         const wmoCodeValidator2 = component["wmoCodeValidator"]({ value: "aa" } as AbstractControl);
         expect(wmoCodeValidator2?.["invalidWmoCodes"]).toBeTruthy();
         const wmoCodeValidator3 = component["wmoCodeValidator"]({ value: "@a" } as AbstractControl);
         expect(wmoCodeValidator3?.["invalidWmoCodes"]).toBeTruthy();
      });

     it("should not validate when no ICAO codes are provided", () => {
       const wmoCodeValidator = component["wmoCodeValidator"]({ value: "" } as AbstractControl);
       expect(wmoCodeValidator).toBeNull();
     });
   });

});
