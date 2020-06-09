import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";
import {WeatherPopupComponent} from "./weather-popup/weather-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {TaskInterface} from "./models/task.interface";
import {WeeklyForecastInterface} from "./models/weekly-forecast.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public tasks: Observable<any[]>;
  public length: number = 0;
  public isTaskFormShown: boolean = false;
  public editItem: any = null;
  private itemsCollection: AngularFirestoreCollection<TaskInterface>;
  private $weeklyForecast: Observable<WeeklyForecastInterface[]> = this.serverApi.getWeeklyForecast();

  constructor(private tasksBd: AngularFirestore, private serverApi: ApiService, public dialog: MatDialog) {
    this.itemsCollection = tasksBd.collection<TaskInterface>('tasks');
    this.itemsCollection.valueChanges().subscribe((a) => {
      console.log(a);
      this.length = a.length;
    })
    this.tasks = this.itemsCollection.valueChanges({idField: 'taskId'});
  }

  public ngOnInit() {
    this.serverApi.getAdminToken().subscribe(() => {
    })
    //
    // this.serverApi.getWeeklyForecast().subscribe((a) => {
    //   this.weeklyForecast
    //   console.log('getWeeklyForecast', a);
    // })
  }

  public onAdditionClick() {
    this.isTaskFormShown = true
    this.editItem = null
  }

  public onSettingsButtonClick() {
    this.dialog.open(WeatherPopupComponent, {
      data: {
        $weeklyForecast: this.$weeklyForecast
      }
    });
  }

  public addElement(item: TaskInterface) {
    if (this.editItem) {
      this.tasksBd.doc<TaskInterface>('tasks/' + item.taskId).update(item)
    } else {
      this.itemsCollection.add(item)
    }
    this.isTaskFormShown = false
  }

  public onDeleteClick(id: number) {
    this.tasksBd.doc<TaskInterface>('tasks/' + id).delete()
  }

  public onEditClick(task) {
    this.editItem = {...task}
    this.isTaskFormShown = true
  }
}
