import {Component, HostBinding, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ApiService} from '../api.service';
import {WeatherPopupComponent} from './weather-popup/weather-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskInterface} from './models/task.interface';
import {WeeklyForecastInterface} from './models/weekly-forecast.interface';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public tasks: Observable<any[]>;
  public length = 0;
  public isTaskFormShown = false;
  public editItem: any = null;
  @HostBinding('class') componentCssClass;
  private itemsCollection: AngularFirestoreCollection<TaskInterface>;
  private $weeklyForecast: Observable<WeeklyForecastInterface[]> = this.serverApi.getWeeklyForecast();
  private themeClicked: number = 0;
  private themeClasses: string[] = [
    'purple-theme', 'yellow-theme'
  ];

  constructor(private tasksBd: AngularFirestore, private serverApi: ApiService,
              public dialog: MatDialog,
              public overlayContainer: OverlayContainer) {
    this.itemsCollection = tasksBd.collection<TaskInterface>('tasks');
    this.itemsCollection.valueChanges().subscribe((a) => this.length = a.length);
    this.tasks = this.itemsCollection.valueChanges({idField: 'taskId'});
  }

  public onThemeChange() {
    this.themeClicked = this.themeClicked + 1;
    this.themeClicked = this.themeClicked % this.themeClasses.length;
    const theme = this.themeClasses[this.themeClicked];
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  public ngOnInit() {
    this.serverApi.getAdminToken().subscribe(() => {
    });
    //
    // this.serverApi.getWeeklyForecast().subscribe((a) => {
    //   this.weeklyForecast
    //   console.log('getWeeklyForecast', a);
    // })
  }

  public onAdditionClick() {
    this.isTaskFormShown = true;
    this.editItem = null;
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
      this.tasksBd.doc<TaskInterface>('tasks/' + item.taskId).update(item);
    } else {
      this.itemsCollection.add(item);
    }
    this.isTaskFormShown = false;
  }

  public onDeleteClick(id: number) {
    this.tasksBd.doc<TaskInterface>('tasks/' + id).delete();
  }

  public onEditClick(task) {
    this.editItem = {...task};
    this.isTaskFormShown = true;
  }
}
