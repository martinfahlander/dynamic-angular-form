import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {

  user = this.userService.getUser();

  constructor(private userService: UserService) {}

}
