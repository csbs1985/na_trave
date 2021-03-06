import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppPage } from './app.page';
import { AppRoutingModule } from './app-routing.module';
import { InicioPageModule } from './pages/inicio/inicio.module';
import { PlacarPageModule } from './pages/placar/placar.module';
import { TimePageModule } from './pages/time/time.module';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Vibration } from '@ionic-native/vibration/ngx';

@NgModule({
  declarations: [AppPage],
  exports: [AppPage],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    InicioPageModule,
    PlacarPageModule,
    TimePageModule,
    ComponentsModule
  ],
  providers: [
    StatusBar,
    ScreenOrientation,
    Vibration,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppPage],
})
export class AppModule { }
