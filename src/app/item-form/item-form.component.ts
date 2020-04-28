import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Item} from "../app.component";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  providers: [FormBuilder]
})
export class ItemFormComponent {
  formData: any;
  today:any = new Date();
  @Output() added = new EventEmitter<Item>();
  @Output() canceled = new EventEmitter<null>();

  constructor(private formBuilder: FormBuilder,) {
    this.formData = this.formBuilder.group({
      name: '',
      text: '',
      date: ''
    });
  }
}
