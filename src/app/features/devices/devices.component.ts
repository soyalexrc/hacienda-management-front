import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  Device,
  DeviceForm,
  DeviceInfo,
  UpdateCreateDevicePayload
} from "../../core/interfaces/device";
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";
import {DeviceService} from "../../core/services/device.service";
import {LoginResult} from "../../core/interfaces/auth";
import {AuthService} from "../../core/services/auth.service";
import {ToastService} from "../../core/services/toast.service";

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    SpinnerComponent
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnInit {
  private modalService = inject(NgbModal);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  @ViewChild('successToast') successToast!: TemplateRef<any>;
  @ViewChild('dangerToast') dangerToast!: TemplateRef<any>;
  form!: FormGroup<DeviceForm>;
  devices: DeviceInfo[] = [];
  edit = false;
  loading = false;
  updateLoading = false;
  user!: LoginResult;
  status = 'Activar';

  modelsByBrand: { model: string }[] = []
  brands: { compMake: string }[] = []

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private auth = inject(AuthService);
  private devicesService = inject(DeviceService);

  closeResult = '';
  showSometerButton = false;
  deviceId = 0;
  assetId = 0;

  ngOnInit() {
    this.devicesService.getBrands().subscribe(result => {
      this.brands = result.makeInfo
    })
    this.user = this.auth.getCurrentUser;
    this.assetId = this.user.mainUser.assetID;
    this.getDevices();
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      series: ['', Validators.required],
      registerDate: [''],
      checkIn_status: [''],
      alternateStatus: [''],
      deviceType: ['', Validators.required],
      color: ['', Validators.required],
    })
  }

  open(device?: DeviceInfo) {
    if (device) {
      const data: Device = {
        id: device.propid,
        deviceType: device.propapprovalperson,
        registerDate: device.propregistrationdate,
        brand: device.propmake,
        color: device.propcolor,
        model: device.propmodel,
        series: device.propserial
      }
      this.edit = true;
      this.deviceId = device.propid;
      this.updateForm(data);
      this.getModelsByBrand(device.propmake);
    } else {
      this.form.reset();
      this.edit = false;
    }
    this.modalService.open(this.editModal, {ariaLabelledBy: 'modal-basic-title'}).result.then(
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

  getFieldError(field: keyof DeviceForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  saveChanges() {
    this.updateLoading = true;
    const payload: UpdateCreateDevicePayload = {
      action: this.edit ? 'UPDATE' : 'INSERT',
      color: this.form.get('color')?.value ?? '',
      modelo: this.form.get('model')?.value ?? '',
      marca: this.form.get('brand')?.value ?? '',
      tipo: this.form.get('deviceType')?.value ?? '',
      fechaDeRegistro: this.form.get('fechaDeRegistro')?.value ?? '',
      checkIn_status: this.form.get('checkIn_status')?.value ?? '',
      approval_person: this.form.get('approval_person')?.value ?? '',
      approval_status: this.form.get('approval_status')?.value ?? '',
      assetId: this.assetId,
      deviceid: this.deviceId,
      updatedBy: this.auth.getCurrentUser.mainUser.name,
      status: '1'
    }
    if (this.edit) {
      payload.updatedBy = this.auth.getCurrentUser.mainUser.name;
    }
    this.devicesService.manageDevices(payload).subscribe(res => {
      if (!res.hasError) {
        // TODO actualizar tabla
        this.getDevices(false);
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light', delay: 10000})
        this.modalService.dismissAll('save changes')

      }
    }, (e) => {
      console.log(e);
    }, () => {
      this.updateLoading = false;
    })
  }

  updateCheckInStatus(event: any, id: number) {
    this.devicesService.manageDevices({deviceid: id, action: event.target.value}).subscribe(res => {
      if (!res.hasError) {
        this.getDevices(false);
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light'})
      }
    })
  }

  updateForm(company: Device) {
    Object.keys(company).forEach((key) => {
      if (company[key as keyof Device] !== 'id') {
        this.form.get(key)?.patchValue(company[key as keyof Device])
      }
    })
  }

  getDevices(showLoader = true) {
    if (showLoader) {
      this.loading = true;
    }
    this.devicesService.getDevices().subscribe(result => {
      this.devices = result.deviceInfo;
    }, () => {

    }, () => {
      this.loading = false;
    })
  }

  getModelsByBrand(brand: string) {
    this.devicesService.getModels(brand).subscribe(result => {
      this.modelsByBrand = result.modelInfo
    })
  }

  get model() {
    return this.form.get('model')?.value
  }

  get brand() {
    return this.form.get('brand')?.value
  }

  handleChangeBrand(event: any) {
    this.getModelsByBrand(event.target.value)
  }

  handleChangeState(event: any) {
    this.showSometerButton = true;
  }

  handleChangeStatus() {
    let action = '';
    switch (this.status) {
      case 'Activar':
        action = 'Submitted CO';
        break;
      case 'Desactivar':
        action = 'Submitted CI';
        break;
      case 'Aprobado':
        action = 'Approved';
        break;
      case 'Declinado':
        action = 'Declined';
        break;
    }

    const payload: UpdateCreateDevicePayload = {
      action,
      deviceid: this.deviceId,
      assetId: this.assetId,
      updatedBy: this.auth.getCurrentUser.mainUser.name,
    }
    this.devicesService.manageDevices(payload).subscribe(res => {
      if (!res.hasError) {
        // TODO actualizar tabla
        this.getDevices(false);
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light', delay: 10000})
        this.modalService.dismissAll('save changes')
      } else {
        console.log(res);
        this.toastService.show({template: this.dangerToast, classname: 'bg-danger text-light', delay: 10000})
      }
    }, (e) => {
      console.log(e);
    }, () => {
      this.updateLoading = false;
    })
  }
}
