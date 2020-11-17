import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterComponent } from './character/character.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { PriceDetailComponent } from './price-detail/price-detail.component';
import { AccountComponent } from './account/account.component';

import { GemService } from './gem.service';
import { GemDetailComponent } from './gem-detail/gem-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    ItemDetailComponent,
    PriceDetailComponent,
    AccountComponent,
    GemDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [GemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
