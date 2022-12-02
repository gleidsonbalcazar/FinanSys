import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownMultiselectComponent } from './dropdown-multiselect.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, NgbModule, FormsModule],
  declarations: [DropdownMultiselectComponent],
  exports: [DropdownMultiselectComponent],
})
export class DropdownMultiselectModule {}
