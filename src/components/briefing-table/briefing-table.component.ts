import { Component, Input } from "@angular/core";
import { DatePipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { ResultQueryGroups } from "../../services/flight-briefing.service";
import { HighlightConditionDirective } from "./directives/highlight-condition.directive";

@Component({
   selector: "app-briefing-table",
   standalone: true,
   imports: [NgForOf, NgIf, HighlightConditionDirective, DatePipe, NgClass],
   templateUrl: "./briefing-table.component.html",
})
export class BriefingTableComponent {
   @Input({ required: true }) results!: ResultQueryGroups;
   protected readonly Object = Object;
}
