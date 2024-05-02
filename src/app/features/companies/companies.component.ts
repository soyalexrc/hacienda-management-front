import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { RouterLink} from "@angular/router";
import {ModalDismissReasons, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Company, CompanyForm, CompanyInfo} from "../../core/interfaces/company";
import {COMPANIES_MOCK} from "../../shared/utils/data/company";
import {CompanyService} from "../../core/services/company.service";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  imports: [
    RouterLink,
    NgbInputDatepicker,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    SpinnerComponent
  ],
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit{
  private modalService = inject(NgbModal);
  private companyService = inject(CompanyService);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  form!: FormGroup<CompanyForm>;
  loading = false;
  edit = false;
  companies: CompanyInfo[] = [];

  private fb = inject(FormBuilder);

  closeResult = '';

  ngOnInit() {
    this.getCompanies();
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      companyData: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
    })
  }

  open(company: CompanyInfo) {
    if (company) {
      this.edit = true;
      const data: Company = {
        id: company.company_id,
        email: company.company_city,
        companyData: company.company_city,
        phone: company.company_phone,
        address: company.company_add1 + ' ' + company.company_add2,
        name: company.company_name
      }
      this.updateForm(data);
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

  getCompanies() {
    this.loading = true;
    this.companyService.getCompanies().subscribe(result => {
      this.companies = result.companyInfo;
    }, () => {

    }, () => {
      this.loading = false;
    })
  }

}
