import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private weatherSub: Subscription;

  constructor(public router: Router, public mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {
    this.mainService.getDefaultLocation();
    this.weatherSub = this.mainService.weekItem.subscribe(
      res => { this.mainService.weekWeather = res },
      err => { this.mainService.showErr(err.statusText) }
    )
  }

  showSuccess() {
    this.toastr.success('Item added Successfully :)');
  }

  ngOnDestroy(): void {
    this.weatherSub.unsubscribe();
  }

}
