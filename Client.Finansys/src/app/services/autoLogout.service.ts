import { Injectable } from "@angular/core";
import { Router } from '@angular/router'
import { LoginService } from "./login.service";
const MINUTES_UNITL_AUTO_LOGOUT = 60 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY =  'lastAction';
@Injectable()
export class AutoLogoutService {
 public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
 public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(
    private router: Router,
    private loginService: LoginService,
    ) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY,Date.now().toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  getUserCurrent(){
    return localStorage.getItem('currentUser')
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const userCurrent = this.getUserCurrent();
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if(!userCurrent){
      localStorage.clear();
      this.loginService.isLoggedSubject.next(false);
      this.router.navigate(['/login']);
    }

    if (isTimeout)  {
      localStorage.clear();
      this.loginService.isLoggedSubject.next(false);
      this.router.navigate(['/login']);
    }
  }
}
