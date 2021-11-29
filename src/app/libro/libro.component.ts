import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren  } from '@angular/core';
import {Libro} from './libro';
import {LibrosService} from './libro.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {ToastService} from '../ngb-toast-global/ngb-toast-global.service';


export type SortColumn = keyof Libro | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();
  
  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}



@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  providers:[LibrosService],
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit {
  libros: Libro[] = [];
  selectedLibro?: Libro;
  editForm: any;
  newForm: any;
  submit = false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> | undefined = undefined;
  constructor(public toastService: ToastService,private libroService: LibrosService,private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.getLibros()
    
    this.editForm = this.formBuilder.group({
      serial:new FormControl({disabled: true}),
      titulo: new FormControl('',[Validators.required,Validators.minLength(3)]),
      autor: new FormControl('',[Validators.required,Validators.minLength(3)]),
      isbn: new FormControl('',[Validators.required,Validators.minLength(3)]),
      numPaginas: new FormControl('',[Validators.required,Validators.min(5)]),
      categoria: new FormControl('',[Validators.required,Validators.minLength(3)]),
      editorial: new FormControl('',[Validators.required,Validators.minLength(3)])
    });
    this.newForm = this.formBuilder.group({
      serial:new FormControl({disabled: true}),
      titulo: new FormControl('',[Validators.required,Validators.minLength(3)]),
      autor: new FormControl('',[Validators.required,Validators.minLength(3)]),
      isbn: new FormControl('',[Validators.required,Validators.minLength(3)]),
      numPaginas: new FormControl('',[Validators.required,Validators.min(5)]),
      categoria: new FormControl('',[Validators.required,Validators.minLength(3)]),
      editorial: new FormControl('',[Validators.required,Validators.minLength(3)])
    });
  }

  get f() { return this.editForm.controls; }
  get fn() { return this.newForm.controls; }
  get c() { return this.editForm; }
  get cn() { return this.newForm; }
  getLibros(): void {
    this.libroService.getLibros()
    .subscribe(libros => {
      this.libros = libros;
      
    })
  }

  

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers?.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.getLibros()
    } else {
      this.libros = [...this.libros].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  onSelect(libro: Libro){
    this.selectedLibro = libro;
    this.editForm.patchValue({
      serial: libro.serial,
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      numPaginas: libro.numPaginas,
      categoria: libro.categoria,
      editorial: libro.editorial 
    });
    this.editForm.controls['serial'].disable()
  }
  openModalNew(content:any) {
    this.modalService.open(content,{size:'lg'}).result.then((result) => {
      `Closed with: ${result}`;
    }, (reason) => {
      `Dismissed`;
    });
  }
  openModal(content:any,libro:Libro) {
    
    this.onSelect(libro)
    this.modalService.open(content,{size:'lg'}).result.then((result) => {
      `Closed with: ${result}`;
    }, (reason) => {
      `Dismissed`;
    });
  }

  onUpdate(){
    console.log(this.editForm)
    const libro: Libro = this.editForm.getRawValue()
    this.libroService.updateLibro(libro)
    .subscribe((results) => {
      console.log('Update')
      this.ngOnInit();
      this.modalService.dismissAll();
      this.toastService.show('Libro editado', { classname: 'bg-success text-light', delay: 5000 });
    }
    ,
    (error) => {
      console.log('Error')
      this.toastService.show('Acción no realizada', { classname: 'bg-danger text-light', delay: 5000 });
    },
    () => {
      console.log('Complete')
    }
    );

  }

  onDelete(){
    this.libroService.deleteLibro(this.selectedLibro?.serial || -1)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
      this.toastService.show('Libro eliminado', { classname: 'bg-warning text-light', delay: 5000 });
    },
    (error) => {
      this.toastService.show('Acción no realizada', { classname: 'bg-danger text-light', delay: 5000 });
    }
    );
  }

  onCreate(){
    this.submit = true
    if(this.newForm.valid){
      
      const libro: Libro = this.newForm.value;
      this.libroService.addLibro(libro)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
        this.submit = false;
        this.toastService.show('Libro guardado', { classname: 'bg-success text-light', delay: 5000 });
      }
      ,
      (error) => {
        this.toastService.show('Acción no realizada', { classname: 'bg-danger text-light', delay: 5000 });
      });
    }
  }
  onCreateClose(){
    this.submit = false;
    this.newForm.reset()
    this.modalService.dismissAll();
  }


  

}
