import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../item';

@Component({
  selector: 'app-gem-detail',
  templateUrl: './gem-detail.component.html',
  styleUrls: ['./gem-detail.component.css']
})
export class GemDetailComponent implements OnInit {

  @Input()
  item: Item;

  constructor() { }

  ngOnInit(): void {
  }

}
