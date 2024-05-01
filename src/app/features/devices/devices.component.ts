import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DEVICES_MOCK} from "../../shared/utils/data/device";
import {Device, DeviceForm} from "../../core/interfaces/device";
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnInit{
  private modalService = inject(NgbModal);
  @ViewChild('editModal') editModal = TemplateRef<any>;
  form!: FormGroup<DeviceForm>;
  edit = false;
  protected readonly DEVICES_MOCK = DEVICES_MOCK;

  private fb = inject(FormBuilder);

  closeResult = '';

  ngOnInit() {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      series: ['', Validators.required],
      registerDate: ['', Validators.required],
      deviceType: ['', Validators.required],
      color: ['', Validators.required],
    })
  }

  open(device?: Device) {
    if (device) {
      this.edit = true;
      this.updateForm(device);
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

  getFieldError(field: keyof DeviceForm, error: string) {
    return this.form.get(field)?.dirty && this.form.get(field)?.hasError(error)
  }

  saveChanges() {
    this.modalService.dismissAll('save changes')
  }

  updateForm(company: Device) {
    Object.keys(company).forEach((key) => {
      if (company[key as keyof Device] !== 'id') {
        this.form.get(key)?.patchValue(company[key as keyof Device])
      }
    })
  }

}
