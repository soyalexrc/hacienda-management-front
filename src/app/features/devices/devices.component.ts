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
import {NotificationService} from "../../core/services/notification.service";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroArrowLeft} from "@ng-icons/heroicons/outline";

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    SpinnerComponent,
    NgIcon
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
  viewProviders: [provideIcons({ heroArrowLeft })]

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
  searchCriteria = "";
  status = '';
  approvalStatus = '';
  checkStatus = ''

  modelsByBrand: { model: string }[] = []
  brands: { compMake: string }[] = []

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private auth = inject(AuthService);
  private devicesService = inject(DeviceService);
  private notificationsService = inject(NotificationService);

  closeResult = '';
  showSometerButton = false;
  deviceId = 0;
  assetId = 0;

  colorsList: string[] = []
  deviceTypesList: string[] = []

  ngOnInit() {
    // this.notificationsService.getNotifications(this.auth.getCurrentUser.mainUser.assetID);
    this.devicesService.getBrands().subscribe(result => {
      this.brands = result.makeInfo.map( b => ({ compMake: b.compMake.toUpperCase()}))
    })
    this.user = this.auth.getCurrentUser;
    if (this.user.mainUser.roleID === 3 || this.user.mainUser.roleID === 2) {
      this.devicesService.updateAssetIdFilter(this.user.mainUser.assetID)
    }

    this.assetId = this.user.mainUser.assetID;
    this.getDevices();

    this.buildForm();

    this.form.get('deviceType')?.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('brand')?.enable();
        this.form.get('model')?.enable();
      } else {
        this.form.get('brand')?.disable();
        this.form.get('model')?.disable();
      }
    });

    this.form.get('alternateStatus')?.valueChanges.subscribe(value => {
      if (value) {
        this.showSometerButton = true;
      }
    });

    this.devicesService.getColors().subscribe(res => this.colorsList = res.map(c => c.toUpperCase().trim()));
    this.devicesService.getDeviceTypes().subscribe(res => this.deviceTypesList = res.map(d => d.toUpperCase()));
  }

  buildForm() {
    this.form = this.fb.group({
      brand: [{value: '', disabled: true}, Validators.required],
      model: [{value: '', disabled: true}, Validators.required],
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
        deviceType: device.propType,
        registerDate: device.propregistrationdate,
        brand: device.propmake,
        color: device.propcolor,
        model: device.propmodel,
        series: device.propserial
      }

      console.log(this.user.mainUser.roleID);
      console.log(device.propcheckStatus);

      if (this.user.mainUser.roleID === 3 && device.propcheckStatus === 'PENDIENTE') {
        this.form.get('alternateStatus')?.disable();
      }

      this.approvalStatus = device.propapprovalStatus;
      this.checkStatus = device.propcheckStatus;
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
      serie: this.form.get('series')?.value ?? '',
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

  updateForm(data: Device) {
    Object.keys(data).forEach((key) => {
      if (data[key as keyof Device] !== 'id') {
        this.form.get(key)?.setValue(data[key as keyof Device])
      }
    });
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
      this.modelsByBrand = result.modelInfo.map(m => ({ model: m.model.toUpperCase() }))
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
    let action = this.form.get('alternateStatus')?.value;

    const payload: UpdateCreateDevicePayload = {
      action : action as string,
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

  applyFilters() {
    const searchTextLowerCase = this.searchCriteria.toLowerCase();

    this.devicesService.getDevices().subscribe(result => {

      if (searchTextLowerCase.trim() === '') {
        this.devices = result.deviceInfo
        return;
      } else {
        this.devices = result.deviceInfo.filter(device => {
          return device.propmake.toLowerCase().includes(searchTextLowerCase) ||
            device.propmodel.toLowerCase().includes(searchTextLowerCase) ||
            device.propserial.toLowerCase().includes(searchTextLowerCase) ||
            device.propregistrationdate.toLowerCase().includes(searchTextLowerCase) ||
            device.propcolor.toLowerCase().includes(searchTextLowerCase) ||
            device.propapprovalperson.toLowerCase().includes(searchTextLowerCase)
        })
      }


    }, () => {

    }, () => {
      this.loading = false;
    })
  }
}
