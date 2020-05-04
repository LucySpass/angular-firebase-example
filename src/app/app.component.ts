import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";

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
export class AppComponent {
  public tasks: Observable<any[]>;
  public length: number = 0;
  public isTaskFormShown: boolean = false;
  public editItem: any = null;
  private itemsCollection: AngularFirestoreCollection<TaskInterface>;

  constructor(private tasksBd: AngularFirestore) {
    this.itemsCollection = tasksBd.collection<TaskInterface>('tasks');
    this.itemsCollection.valueChanges().subscribe((a) => {
      console.log(a);
      this.length = a.length;
    })
    this.tasks = this.itemsCollection.valueChanges({idField: 'taskId'});
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

  public convertToDate(date) {
    console.log(date);
    return new Date(date.seconds)
  }

  public onDeleteClick(id: number) {
    this.tasksBd.doc<TaskInterface>('tasks/' + id).delete()
  }

  public onEditClick(task) {
    this.editItem = {...task}
    this.isTaskFormShown = true
  }
}
