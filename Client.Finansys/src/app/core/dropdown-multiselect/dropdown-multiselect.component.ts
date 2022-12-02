import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DropdownMultiselectInterface } from './dropdown-multiselect.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dropdown-multiselect',
  templateUrl: './dropdown-multiselect.component.html',
  styleUrls: ['./dropdown-multiselect.component.scss'],
})
export class DropdownMultiselectComponent implements OnInit {
  @Input() showSelectedItens: boolean;
  @Input() statusList: DropdownMultiselectInterface[];
  @Output() statusChange = new EventEmitter();
  @ViewChild('form') form: NgForm;
  selectedItens: string[] = [];
  selectorId: string;

  constructor() {}

  ngOnInit() {
    this.defineSelectorId();
  }

  verifyItensChecked(checkbox) {
    const checkboxKeys = Object.keys(checkbox);
    const selectedCheckboxLength = checkboxKeys.reduce((increment, data) => {
      let sum = increment;
      if (checkbox[data]) {
        sum = increment + 1;
        return sum;
      }

      return sum;
    }, 0);

    if (selectedCheckboxLength > 0) {
      return selectedCheckboxLength;
    }

    return false;
  }

  search(status) {
    const selectedItems = [];
    const checkboxKeys = Object.keys(status);

    checkboxKeys.forEach(data => {
      if (this.form.value[data]) {
        selectedItems.push(data);
      }
    });

    this.selectedItens = selectedItems;
    this.statusChange.emit({ status: selectedItems });
  }

  itemIsSelected(status) {
    return this.selectedItens.includes(status.path[0].id);
  }

  private randstr(prefix) {
    return Math.random()
      .toString(36)
      .replace('0.', prefix || '');
  }

  private defineSelectorId() {
    this.selectorId = this.randstr('dropdown-');
  }
}
