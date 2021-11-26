import { Component, OnInit,TemplateRef } from '@angular/core';
import { ToastService } from './ngb-toast-global.service';
@Component({
  selector: 'app-ngb-toast-global',
  templateUrl: './ngb-toast-global.component.html',
  styleUrls: ['./ngb-toast-global.component.css'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class NgbToastGlobalComponent implements OnInit {
  public position = { X: 'Center', Y: 'Bottom' };
  constructor(public toastService: ToastService) {}
  ngOnInit(): void{}
  isTemplate(toast:any) { return toast.textOrTpl instanceof TemplateRef; }
}


