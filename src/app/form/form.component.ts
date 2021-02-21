import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import data from '../../assets/example-response.json';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  formData: any = data;

  signupForm: FormGroup;

  user = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: ''
  };

  visiblePassword = false;

  constructor(private router: Router, private userService: UserService) {}
  
  submit() {
    this.user.first_name = this.signupForm.value.first_name;
    this.user.middle_name = this.signupForm.value.middle_name;
    this.user.last_name = this.signupForm.value.last_name;
    this.user.email = this.signupForm.value.email;
    this.user.phone_number = this.signupForm.value.phone_number;
    this.user.password = this.signupForm.value.password;
    this.signupForm.reset();
    this.userService.setUser(this.user);
    this.router.navigate(['welcome']);
  }

  toggleShowPassword() {
    if (this.visiblePassword)
      this.visiblePassword = false;
    else this.visiblePassword = true;
  }
  
  getErrorMessage(input) {
    let errorMessage = [];
    const errors: ValidationErrors = this.signupForm.get(input).errors;
    if (errors != null) {
      for (let errorType of Object.keys(errors)) {
        if (errorType == "pattern"){
          for (let control of this.formData)
            if (control.name == input)
              for (let validator of control.validations)
                if (validator.value == errors[errorType].requiredPattern)
                  errorMessage.push(validator.message);
        }
        else if (errorType == "minlength") {
          for (let control of this.formData)
            if (control.name == input)
              for (let validator of control.validations)
                if (validator.value == errors[errorType].requiredLength)
                  errorMessage.push(validator.message); 
        }
        else if (errorType == "maxlength") {
          for (let control of this.formData)
            if (control.name == input)
              for (let validator of control.validations)
                if (validator.value == errors[errorType].requiredLength)
                  errorMessage.push(validator.message); 
        }
        else 
          errorMessage.push("Required");
      }
    }
    return errorMessage;
  }

  getValidators(input) {
    let validators = [];
    if(input.required)
      validators.push(Validators.required);
    for (let validator of input.validations) {
      if (validator.name == "regex")
        validators.push(Validators.pattern(validator.value));
      else if (validator.name == "minlength")
        validators.push(Validators.minLength(validator.value));
      else if (validator.name == "maxlength")
        validators.push(Validators.maxLength(validator.value));
    }
    let allValidators = Validators.compose(validators);
    return allValidators;
  }

  ngOnInit() {
    let inputs = {}    
    for (let input of this.formData) {
      if('validations' in input) 
        inputs[input.name] = new FormControl(null, this.getValidators(input));
      else if (input.required)
        inputs[input.name] = new FormControl(null, Validators.required);
      else
        inputs[input.name] = new FormControl(null);
    }
    this.signupForm = new FormGroup(inputs);
  }
}
