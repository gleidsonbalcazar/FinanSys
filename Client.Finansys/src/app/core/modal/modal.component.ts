import { Component, EventEmitter, Injectable, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core'
import { ModalConfig } from './modal.config'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ConfirmDialogService } from './confirm/confirm-dialog.service'
@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
@Injectable()
export class ModalComponent implements OnInit {
  @Input() public modalConfig: ModalConfig;
  @ViewChild("modal") private modalContent: TemplateRef<ModalComponent>;
  @Output() clickSave: EventEmitter<any> = new EventEmitter();

  private modalRef: NgbModalRef

  constructor(private modalService: NgbModal,private confirmDialogService: ConfirmDialogService) { }


  ngOnInit(): void { }

  open(classCss:string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent,  { windowClass : classCss });
      this.modalRef.result.then(resolve, resolve)
    })
  }

  async close(): Promise<void> {
    if (this.modalConfig.shouldClose === undefined || (await this.modalConfig.shouldClose())) {
      const result = this.modalConfig.onClose === undefined || (await this.modalConfig.onClose())
      this.modalRef.close(result)
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.shouldDismiss === undefined || (await this.modalConfig.shouldDismiss())) {
      const result = this.modalConfig.onDismiss === undefined || (await this.modalConfig.onDismiss())
      this.modalRef.dismiss(result)
    }
  }

  save(){
    this.clickSave.emit(null);
  }

  saveAndToBe(){
    this.clickSave.emit(true);
  }
}
