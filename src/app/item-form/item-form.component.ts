import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TaskInterface} from "../models/task.interface";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  providers: [FormBuilder]
})
export class ItemFormComponent implements OnInit {
  taskForm: FormGroup;
  today: any = new Date();
  @Output() added = new EventEmitter<TaskInterface>();
  @Output() canceled = new EventEmitter<null>();
  @Input() item: any;
  private initialState: TaskInterface = {
    name: '',
    text: '',
    date: new Date(),
    taskId: ''
  }

  constructor(private formBuilder: FormBuilder,) {
    this.taskForm = this.formBuilder.group(this.initialState);
  }

  public ngOnInit() {
    if (this.item && typeof this.item !== 'undefined') {
      this.taskForm.setValue(this.item)
    }
  }

  public onCancelClick() {
    this.taskForm.reset()
    this.canceled.emit()
  }
}
