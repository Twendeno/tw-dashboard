import {Component, inject} from '@angular/core';
import {AsyncPipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {WeatherComponent} from "@app/shared/components/weather/weather.component";
import {DropdownModule} from "primeng/dropdown";
import {TownService} from "@app/services/dashboard/town/town.service";
import {DistrictService} from "@app/services/dashboard/district/district.service";
import {GeometryService} from "@app/services/dashboard/geometry/geometry.service";
import {RouterLink} from "@angular/router";
import {FooterComponent} from "@app/shared/components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    JsonPipe,
    AsyncPipe,
    NgOptimizedImage,
    WeatherComponent,
    DropdownModule,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected readonly town$ = inject(TownService).allTowns();
  protected readonly district$ = inject(DistrictService).allDistricts();
  protected readonly line$ = inject(GeometryService).allGeometries();
}
