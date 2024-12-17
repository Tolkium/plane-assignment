import {Component} from '@angular/core';
import {FlightBriefingComponent} from "../components/flight-briefing/flight-briefing.component";
import {BriefingTableComponent} from "../components/briefing-table/briefing-table.component";
import { AsyncPipe, NgClass, NgIf } from "@angular/common";
import { FlightBriefingService } from "../services/flight-briefing.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlightBriefingComponent, BriefingTableComponent, NgClass, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(protected readonly flightBriefingService: FlightBriefingService) {
  }
}
