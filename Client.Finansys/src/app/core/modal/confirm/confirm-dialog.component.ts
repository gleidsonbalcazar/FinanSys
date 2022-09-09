import { Component, Input, OnInit } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: 'confirm-dialog.component.html',
    styleUrls: ['confirm-dialog.component.css']
})

export class ConfirmDialogComponent implements OnInit {
    message: any;
    constructor(
        private confirmDialogService: ConfirmDialogService
    ) { }

    ngOnInit(): any {
        this.confirmDialogService.getMessage().subscribe(message => {
            this.message = message;
        });
    }
}
