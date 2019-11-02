import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private resultSub: Subscription;

  constructor(public mainService: MainService, private toastr: ToastrService) { }

  ngOnInit() {
    this.resultSub = this.mainService.resultsItem.subscribe(
      res => { this.mainService.resultStack = res; },
      err => { this.mainService.showErr(err.statusText)}
    )
  }

  checkLang(event) {
    if (event.code.substring(0, 5) === 'Digit') {
      this.showEnglishErr();
      event.preventDefault();
    }
    let k;
    k = event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  showEnglishErr() {
    this.toastr.error('Please type only english letters!');
  }

  ngOnDestroy(): void {
    this.resultSub.unsubscribe();
  }

}