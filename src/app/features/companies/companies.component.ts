import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { RouterLink} from "@angular/router";
import {ModalDismissReasons, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Company, CompanyForm} from "../../core/interfaces/company";
import {COMPANIES_MOCK} from "../../shared/utils/data/company";

@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  imports: [
    RouterLink,
    NgbInputDatepicker,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{
  private modalService = inject(NgbModal);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  form!: FormGroup<CompanyForm>;
  edit = false;
  protected readonly COMPANIES_MOCK = COMPANIES_MOCK;

  private fb = inject(FormBuilder);

  closeResult = '';

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      companyData: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    })
  }

  open(company: Company) {
    if (company) {
      this.edit = true;
      this.updateForm(company);
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

  getFieldError(field: keyof CompanyForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  saveChanges() {
    this.modalService.dismissAll('save changes')
  }

  updateForm(company: Company) {
    Object.keys(company).forEach((key) => {
      if (company[key as keyof Company] !== 'id') {
        this.form.get(key)?.patchValue(company[key as keyof Company])
      }
    })
  }

}
