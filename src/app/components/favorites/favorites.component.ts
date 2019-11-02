import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  private favoriteSub: Subscription;

  constructor(public router: Router, public mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {
    this.favoriteSub = this.mainService.favoritesItem.subscribe(
      res => { this.mainService.favorites = res;},
      err => { this.mainService.showErr(err.statusText)}
    )
  }

  showSuccess() {
    this.toastr.success('Item removed Successfully :)');
  }

  ngOnDestroy(): void {
    this.favoriteSub.unsubscribe();
  }

}
