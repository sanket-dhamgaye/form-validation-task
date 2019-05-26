import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn
} from "@angular/forms";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        style({ transform: "rotateY(180deg)" }),
        animate(500)
      ]),
      transition("* => void", [
        animate(300, style({ height: "0px", opacity: 0 }))
      ])
    ])
  ]
})
export class FormComponent implements OnInit {
  userForm: FormGroup;
  courses: Array<string> = ["BE", "Arts", "BSC"];
  imageSrc: SafeUrl;
  formData: Array<any> = [];
  defaultView: boolean = true;
  constructor(private fb: FormBuilder, private sanitized: DomSanitizer) {
    this.userForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z A-z]*"),
          Validators.minLength(2)
        ]
      ],
      email: ["", [Validators.required, , Validators.email]],
      gender: ["", Validators.required],
      city: ["", Validators.required],
      courses: new FormArray([], this.minOneChecked(1)),
      file: [null, Validators.required]
    });
    this.addCheckboxes();
  }

  ngOnInit() {}

  private addCheckboxes() {
    this.courses.map(ele => {
      const control = new FormControl();
      (this.userForm.controls.courses as FormArray).push(control);
    });
  }
  get nameField() {
    return this.userForm.get("name");
  }
  get emailField() {
    return this.userForm.get("email");
  }
  get genderField() {
    return this.userForm.get("gender");
  }
  get cityField() {
    return this.userForm.get("city");
  }
  get coursesField() {
    return this.userForm.get("courses");
  }
  get fileField() {
    return this.userForm.get("file");
  }

  minOneChecked(min: number): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {
      let totalSelected = 0;
      formArray.controls.map(control => {
        if (control.value == true) {
          totalSelected++;
        }
      });
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  handleFile(event) {
    this.imageSrc = this.sanitized.bypassSecurityTrustUrl(
      URL.createObjectURL(event.target.files[0])
    );
  }

  handleFormSubmit(value) {
    if (this.userForm.valid) {
      const formValue = value;
      const selectedCourse = formValue.courses
        .map((val: string, i: number) => (val ? this.courses[i] : null))
        .filter((v: any) => {
          return v !== null;
        });
      formValue.file = this.imageSrc;
      formValue.courses = selectedCourse;
      this.formData.push(formValue);
      this.userForm.reset();
    }
  }
  handleDelete(index: number) {
    this.formData.splice(index, 1);
  }
  changeView() {
    this.defaultView = this.defaultView ? false : true;
  }
}
