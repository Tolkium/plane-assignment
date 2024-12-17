import { HighlightConditionDirective } from "./highlight-condition.directive";
import { Component, DebugElement, DebugNode } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ComponentFixture, TestBed } from "@angular/core/testing";
@Component({
   standalone: true,
   template: `
      <h2 appHighlightCondition="FEW035">RED</h2>
      <h2 appHighlightCondition="SCT035">RED</h2>
      <h2 appHighlightCondition="BKN035">RED</h2>
      <h2 appHighlightCondition="ADW BKN035 B34">RED</h2>
      <h3 appHighlightCondition="FEW025">BLUE</h3>
      <h3 appHighlightCondition="SCT025">BLUE</h3>
      <h3 appHighlightCondition="BKN025">BLUE</h3>
      <h3 appHighlightCondition="ADW BKN025 B34">BLUE</h3>
      <h4 appHighlightCondition="FES025">None</h4>
   `,
   imports: [HighlightConditionDirective],
})
class TestComponent {}

describe("HighlightCondition Directive", () => {
   let fixture: ComponentFixture<TestComponent>;
   let redH2s: DebugElement[];
   let blueH3s: DebugElement[];
   let h4s: DebugElement[];

   beforeEach(() => {
      fixture = TestBed.configureTestingModule({
         imports: [HighlightConditionDirective, TestComponent],
      }).createComponent(TestComponent);
      fixture.detectChanges();

      redH2s = fixture.debugElement.queryAll(By.css("h2"));
      blueH3s = fixture.debugElement.queryAll(By.css("h3"));
      h4s = fixture.debugElement.queryAll(By.css("h4"));
   });

   it("h2s should have spans with red text", () => {
     redH2s.forEach((h2: DebugNode) => {
       expect(h2.nativeNode.querySelector("span")).toBeTruthy();
       expect(h2.nativeNode.querySelector("span").classList).toContain("text-red-400");
     })
   });

   it("h3s should have spans with blue text", () => {
     blueH3s.forEach((h3: DebugNode) => {
       expect(h3.nativeNode.querySelector("span")).toBeTruthy();
       expect(h3.nativeNode.querySelector("span").classList).toContain("text-sky-300");
     })
   })

   it("h4s should not have spans", () => {
     h4s.forEach((h4: DebugNode) => {
       expect(h4.nativeNode.querySelector("span")).toBeNull();
     })
   })
});
