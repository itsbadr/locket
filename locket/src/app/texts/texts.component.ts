import { Component, OnInit } from '@angular/core';

import { LocketService } from '../services/locket.service';

import Text from '../util/type/text';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss']
})
export class TextsComponent implements OnInit {

  encryptedTexts: Text[];

  constructor(private locketService: LocketService) { }

  ngOnInit(): void {

    this.locketService.getEncryptedTexts()
      .subscribe(encryptedTexts => {
        this.encryptedTexts = encryptedTexts;
      },
        error => {
          console.log(error);
        });

  }

}
