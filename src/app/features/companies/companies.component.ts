import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { RouterLink} from "@angular/router";
import {ModalDismissReasons, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Company, CompanyForm, CompanyInfo, UpdateCompanyPayload} from "../../core/interfaces/company";
// import {COMPANIES_MOCK} from "../../shared/utils/data/company";
import {CompanyService} from "../../core/services/company.service";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";
import {ToastService} from "../../core/services/toast.service";
import {NotificationService} from "../../core/services/notification.service";
import {AuthService} from "../../core/services/auth.service";

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
  updateLoading = false;
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private notificationsService = inject(NotificationService);
  private toastService = inject(ToastService);
  closeResult = '';

  @ViewChild('successToast') successToast! : TemplateRef<any>;
  @ViewChild('dangerToast') dangerToast! : TemplateRef<any>;

  ngOnInit() {
    this.getCompanies();
    this.notificationsService.getNotifications(this.auth.getCurrentUser.mainUser.assetID);
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      companyData: ['', Validators.required],
      zip: [''],
      email: [''],
      phone: ['', Validators.required],
      companyId: [0],
      status: [0],
      officerId: [0],
      updatedBy: [0],
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
        name: company.company_name,
        zip: company.company_zip,
        companyId: company.company_id,
        status: company.company_status,
        officerId: company.company_officer_id,
        updatedBy: company.company_updateby
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
    const payload: UpdateCompanyPayload = {
      company_id:  String(this.form.get('companyId')?.value ?? 0),
      company_add1: this.form.get('address')?.value ?? '',
      company_add2: this.form.get('address')?.value ?? '',
      company_name: this.form.get('name')?.value ?? '',
      company_phone: this.form.get('phone')?.value ?? '',
      company_city: this.form.get('city')?.value ?? '',
      company_zip: this.form.get('zipcode')?.value ?? '',
      company_updateby: String(this.form.get('updatedBy')?.value ?? 0),
      company_status: (this.form.get('status')?.value ?? false) as boolean,
      company_officer_id: this.form.get('officerId')?.value ?? 0,
    }
    this.updateLoading = true;
    this.companyService.updateCompany(payload).subscribe(res => {
      if (!res.hasError) {
        // TODO actualizar tabla
        this.getCompanies()
        this.modalService.dismissAll('save changes');
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light', delay: 10000})
      }
    }, error => {
      console.log(error)
    }, () => {
      this.updateLoading = false;
    })
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
