import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {ApiService} from "../api.service";

export interface TaskInterface {
  name: string;
  date: Date;
  text: string;
  taskId?: string
}

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

  constructor(private tasksBd: AngularFirestore, private serverApi: ApiService) {
    this.itemsCollection = tasksBd.collection<TaskInterface>('tasks');
    this.itemsCollection.valueChanges().subscribe((a) => {
      console.log(a);
      this.length = a.length;
    })
    this.tasks = this.itemsCollection.valueChanges({idField: 'taskId'});
  }

  public ngOnInit() {
    this.serverApi.getAdminToken().subscribe((a) => {
      console.log('getAdminToken', a);
    })
    this.serverApi.getForecast().subscribe((a) => {
      console.log('getForecast', a);
    })
    this.serverApi.getToken().subscribe((a) => {
      console.log('getToken', a);
    })
    this.serverApi.getWeeklyForecast().subscribe((a) => {
      console.log('getWeeklyForecast', a);
    })
  }

  public onAdditionClick() {
    this.isTaskFormShown = true
    this.editItem = null
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
