import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Consultant, ConsultantForm} from "../../core/interfaces/consultant";
import {CONSULTANTS_MOCK} from "../../shared/utils/data/consultant";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-consultants',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './consultants.component.html',
  styleUrl: './consultants.component.scss'
})
export class ConsultantsComponent implements OnInit{
  private modalService = inject(NgbModal);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  form!: FormGroup<ConsultantForm>;
  protected readonly CONSULTANTS_MOCK = CONSULTANTS_MOCK;

  private fb = inject(FormBuilder);
  edit = false;
  closeResult = '';

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    })
  }

  open(consultant?: Consultant) {
    if (consultant) {
      this.edit = true;
      this.updateForm(consultant);
    } else {
      this.form.reset();
      this.edit = false;
    }
    this.modalService.open(this.editModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  getFieldError(field: keyof ConsultantForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  saveChanges() {
    this.modalService.dismissAll('save changes')
  }

  updateForm(consultant: Consultant) {
    Object.keys(consultant).forEach((key) => {
      if (consultant[key as keyof Consultant] !== 'id') {
        this.form.get(key)?.patchValue(consultant[key as keyof Consultant])
      }
    })
  }

}
