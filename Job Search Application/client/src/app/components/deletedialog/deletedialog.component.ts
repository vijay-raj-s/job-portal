import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployerInterviewsComponent } from '../employer-interviews/employer-interviews.component';

@Component({
  selector: 'app-deletedialog',
  templateUrl: './deletedialog.component.html',
  styleUrls: ['./deletedialog.component.sass']
})
export class DeletedialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EmployerInterviewsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  close(): void {
    this.dialogRef.close();
  }

  delete(){ 
    this.close();
  }

}
