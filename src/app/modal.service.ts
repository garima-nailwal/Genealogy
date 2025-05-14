import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // private modalVisibilitySource = new Subject<boolean>();
  private modalVisibilitySubject = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibilitySubject.asObservable();

  openModal() {
    console.log('Modal opened');
    this.modalVisibilitySubject.next(true); // Emit true to show the modal
  }

  closeModal() {
    console.log('Modal closed');
    this.modalVisibilitySubject.next(false); // Emit false to close the modal
  }
}