import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Consultant, ConsultantForm, UpdateConsultantPayload} from "../../core/interfaces/consultant";
import {CONSULTANTS_MOCK} from "../../shared/utils/data/consultant";
import {NgClass} from "@angular/common";
import {ConsultantService} from "../../core/services/consultant.service";
import {AuthService} from "../../core/services/auth.service";
import {ToastService} from "../../core/services/toast.service";
import {LoginResult, User} from "../../core/interfaces/auth";
import {NotificationService} from "../../core/services/notification.service";
import {DeviceService} from "../../core/services/device.service";
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import {NgIcon, provideIcons} from "@ng-icons/core";

@Component({
  selector: 'app-consultants',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIcon,
  ],
  templateUrl: './consultants.component.html',
  styleUrl: './consultants.component.scss',
  viewProviders: [provideIcons({ heroArrowLeft })]
})
export class ConsultantsComponent implements OnInit{
  private modalService = inject(NgbModal);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private devicesService = inject(DeviceService);
  private notificationsService = inject(NotificationService);
  private router = inject(Router);
  private consultantService = inject(ConsultantService);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  @ViewChild('successToast') successToast! : TemplateRef<any>;
  @ViewChild('dangerToast') dangerToast! : TemplateRef<any>;
  form!: FormGroup<ConsultantForm>;
  consultants: User[] = []
  user!: LoginResult;
  searchCriteria = "Todos";
  // protected readonly CONSULTANTS_MOCK = CONSULTANTS_MOCK;

  private fb = inject(FormBuilder);
  edit = false;
  closeResult = '';
  updateLoading = false;

  ngOnInit() {
    this.user = this.authService.getCurrentUser;
    // this.notificationsService.getNotifications(this.authService.getCurrentUser.mainUser.assetID);
    this.consultants = this.authService.getCurrentUser.secondaryUser;
    this.form = this.fb.group({
      name: [''],
      lastname: [''],
      address: [''],
      address2: [''],
      city: [''],
      country: ['PUERTO RICO'],
      state: [''],
      zipCode: [''],
      company: [''],
      email: [''],
      phone: [''],
    })

    this.form.get('name')?.disable();
    this.form.get('email')?.disable();
    this.form.get('country')?.disable();
    this.form.get('company')?.disable();
  }

  open(consultant?: User) {
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
    const payload: UpdateConsultantPayload = {
      address1: this.form.get('address1')?.value ?? '',
      address2: this.form.get('address2')?.value ?? '',
      city: this.form.get('city')?.value ?? '',
      zipcode: this.form.get('zipcode')?.value ?? '',
      phone: this.form.get('phone')?.value ?? '',
      roleid: this.authService.getCurrentUser.mainUser.roleID,
      assetid: 1, // TODO ajustar
    }
    this.updateLoading = true;
    this.consultantService.updateConsultant(payload).subscribe(res => {
      if (!res.hasError) {
        // TODO actualizar tabla
        this.modalService.dismissAll('save changes');
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light', delay: 10000})
      }
    }, error => {
      console.log(error)
    }, () => {
      this.updateLoading = false;
    })

  }

  updateForm(consultant: User) {
    console.log(consultant);
    this.form.get('name')?.setValue(consultant.name);
    this.form.get('lastname')?.setValue(consultant.lastname);
    this.form.get('address')?.setValue(consultant.add1);
    this.form.get('address2')?.setValue(consultant.add2);
    this.form.get('email')?.setValue(consultant.email);
    this.form.get('phone')?.setValue(consultant.phone);
    this.form.get('company')?.setValue(consultant.company_name);
    this.form.get('city')?.setValue(consultant.city);
    this.form.get('zipCode')?.setValue(consultant.zip);
    // Object.keys(consultant).forEach((key) => {
    //   if (consultant[key as keyof User] !== 'id') {
    //     this.form.get(key)?.patchValue(consultant[key as keyof User])
    //   }
    // })
  }

  applyFilters() {
    const searchTextLowerCase = this.searchCriteria.toLowerCase();

    this.consultants = this.authService.getCurrentUser.secondaryUser;


      if (searchTextLowerCase.trim() === '') {
        this.consultants = this.authService.getCurrentUser.secondaryUser;
        return;
      } else {
        this.consultants = this.authService.getCurrentUser.secondaryUser.filter(consultant => {
          return consultant.email.toLowerCase().includes(searchTextLowerCase) ||
            consultant.phone.toLowerCase().includes(searchTextLowerCase) ||
            consultant.company.toString().toLowerCase().includes(searchTextLowerCase) ||
            consultant.name.toLowerCase().includes(searchTextLowerCase) ||
            consultant.lastname.toLowerCase().includes(searchTextLowerCase) ||
            consultant.lastname2.toLowerCase().includes(searchTextLowerCase)
        })
      }
  }

  filterDevicesByConsultant(assetId: number) {
    this.devicesService.updateAssetIdFilter(assetId);
    this.router.navigate(['/devices'])
  }

}
