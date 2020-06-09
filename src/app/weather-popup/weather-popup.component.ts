import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {WeeklyForecastInterface} from "../models/weekly-forecast.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-weather-popup',
  templateUrl: './weather-popup.component.html',
  styleUrls: ['./weather-popup.component.scss']
})
export class WeatherPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { $weeklyForecast: Observable<WeeklyForecastInterface> }) {
  }

  ngOnInit() {
  }

}
