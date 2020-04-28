import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Observable} from "rxjs";

export interface Item {
  name: string;
  date: string;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items: Observable<any[]>;
  length: number = 0;
  isAddingItemEnabled: boolean = false;
  private itemsCollection: AngularFirestoreCollection<Item>;
  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(firestore: AngularFirestore) {
    this.itemsCollection = firestore.collection<Item>('tasks');
    this.itemsCollection.valueChanges().subscribe((a) => {
      this.length = a.length;
    })
    this.items = this.itemsCollection.valueChanges();
  }

  addElement(item: Item) {
    this.itemsCollection.add(item)
    this.isAddingItemEnabled = false
  }

  convertToDate(date) {
    console.log(date);
  }

  onDeleteClick() {

  }
}
