import { Component, OnInit } from '@angular/core';
import { AutoLogoutService } from './services/autoLogout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css"],
  providers: [AutoLogoutService]
})
export class AppComponent implements OnInit{


  constructor(
    private autoLogoutService: AutoLogoutService,
    )
  {
    localStorage.setItem('lastAction', Date.now().toString());
  }

  ngOnInit() {
    this.autoLogoutService.check();
  }
}
