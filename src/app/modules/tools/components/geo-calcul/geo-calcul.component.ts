import {Component, computed, inject, input, signal} from '@angular/core';
import * as geolib from 'geolib';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {StationService} from "@app/services/dashboard/station/station.service";

@Component({
  selector: 'app-geo-calcul',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './geo-calcul.component.html',
  styleUrl: './geo-calcul.component.css'
})
export class GeoCalculComponent {

  protected readonly geolib = geolib;

  readonly stationService = inject(StationService);
  stations$ = signal(this.stationService.coordinates(1,10));
  departureSelected = signal("");
  arrivalSelected = signal("");

  geoCalculatorForm = this.fb.group({
    departure: this.fb.group({
      latitude: ['',[Validators.required,Validators.pattern('^(-?\\d{1,10}|-?\\d+\\.\\d{1,10})$|^(\\d{1,3})°\\s(\\d{1,2})\'\\s([NSEO])$')] ],
      longitude: ['', [Validators.required,Validators.pattern('^(-?\\d{1,10}|-?\\d+\\.\\d{1,10})$|^(\\d{1,3})°\\s(\\d{1,2})\'\\s([NSEO])$')] ],
    }),
    arrival: this.fb.group({
      latitude: ["",[Validators.required,Validators.pattern('^(-?\\d{1,10}|-?\\d+\\.\\d{1,10})$|^(\\d{1,3})°\\s(\\d{1,2})\'\\s([NSEO])$')] ],
      longitude: ["", [Validators.required,Validators.pattern('^(-?\\d{1,10}|-?\\d+\\.\\d{1,10})$|^(\\d{1,3})°\\s(\\d{1,2})\'\\s([NSEO])$')] ],
    }),
    times: this.fb.group({
      departureTime:['',[Validators.required,Validators.pattern("^([01]\\d|2[0-3]):[0-5]\\d$")] ],
      arrivalTime:['',[Validators.required,Validators.pattern("^([01]\\d|2[0-3]):[0-5]\\d$")] ]
    }),
    address: this.fb.group({
      departureName:[''],
      ArrivalName:[''],
    })
  });

  pointsList: any[] = []
  departureTimeValue = signal(1)
  arrivalTimeValue = signal(1)

  unitsDistances=[
    {name:'meter',symbol:'m'},
    {name:'kilometers',symbol:'km'},
    {name:'centimeters',symbol:'cm'},
    {name:'millimeters',symbol:'mm'},
    {name:'miles',symbol:'mi'},
    {name:'seamiles',symbol:'sm'},
    {name:'feet',symbol:'ft'},
    {name:'inches',symbol:'in'},
    {name:'yards',symbol:'yd'},
  ]

  unitSelected = signal(this.unitsDistances[0].symbol);

  distanceValue = computed(() =>geolib.convertDistance(geolib.getPreciseDistance(this.pointsList[0],this.pointsList[1]), this.unitSelected()))

  unitSpeeds=[
    {name:'m/s',symbol:'mps'},
    {name:'m/h',symbol:'mph'},
    {name:'km/h',symbol:'kmh'},
  ]
  unitSpeedSelected = signal(this.unitSpeeds[0].symbol);
  speedValue = computed(() =>{
    const startPointWithTime = {...this.pointsList[0],time: this.departureTimeValue()}
    const endPointWithTime = {...this.pointsList[1],time:this.convertToTimestamp(this.geoCalculatorForm.controls['times'].value.arrivalTime!)}

    return this.unitSpeedSelected() === 'mps'?geolib.getSpeed(startPointWithTime,endPointWithTime): geolib.convertSpeed(geolib.getSpeed(startPointWithTime,endPointWithTime), this.unitSpeedSelected())
  });

  constructor(private fb: FormBuilder) { }

  onSubmit() {

    if (this.geoCalculatorForm.controls['address'].invalid || this.geoCalculatorForm.controls['address'].invalid) {
      return;
    }

    this.geoCalculatorForm.controls['departure'].patchValue(
      {
        latitude: this.departureSelected().split(',')[0],
        longitude: this.departureSelected().split(',')[1]
      }
    );

    this.geoCalculatorForm.controls['arrival'].patchValue(
      {
        latitude: this.arrivalSelected().split(',')[0],
        longitude: this.arrivalSelected().split(',')[1]
      }
    );

    if (!this.geoCalculatorForm.controls['departure'].value || !this.geoCalculatorForm.controls['arrival'].value) {
      return;
    }
    this.pointsList = [this.geoCalculatorForm.controls['departure'].value, this.geoCalculatorForm.controls['arrival'].value];
    this.departureTimeValue.set(this.convertToTimestamp(this.geoCalculatorForm.controls['times'].value.departureTime!))
    this.arrivalTimeValue.set(this.convertToTimestamp(this.geoCalculatorForm.controls['times'].value.arrivalTime!))

    // this.geoCalculatorForm.controls['departure'].reset();
    // this.geoCalculatorForm.controls['arrival'].reset();
    // this.geoCalculatorForm.controls['times'].reset();


  }

  onReset() {
    this.geoCalculatorForm.reset();
    this.pointsList = [];
  }

  get latitudeDeparture() { return this.geoCalculatorForm.controls['departure'].get('latitude')!; }
  get longitudeDeparture() { return this.geoCalculatorForm.controls['departure'].get('longitude')!; }
  get latitudeArrival() { return this.geoCalculatorForm.controls['arrival'].get('latitude')!; }
  get longitudeArrival() { return this.geoCalculatorForm.controls['arrival'].get('longitude')!; }
  get departureTime() { return this.geoCalculatorForm.controls['times'].get('departureTime')!; }
  get arrivalTime() { return this.geoCalculatorForm.controls['times'].get('arrivalTime')!; }
  get departureAddressName() { return this.geoCalculatorForm.controls['address'].get('departureName')!; }
  get arrivalAddressName() { return this.geoCalculatorForm.controls['address'].get('ArrivalName')!; }

  onChangeUnitDistance($event: any) {
    this.unitSelected.set($event.target.value)
  }
  onChangeUnitSpeed($event: any) {
    this.unitSpeedSelected.set($event.target.value)
  }

  onChangesDepartureSelect($event: any) {
    this.departureSelected.set($event.target.value)
  }

  onChangesArrivalSelect($event: any) {
    this.arrivalSelected.set($event.target.value)
  }

  private convertToTimestamp(timeString: string): number {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.getTime();
  }
}
