import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation'
import {GeoCoord} from '../../providers/haversine/geocoord';
import { StationObj } from '../../models/stationObj';
import { RestProvider } from '../../providers/rest/rest';
import { HaversineProvider } from '../../providers/haversine/haversine';
import { Polution } from '../../models/polution';
import { QualityProvider } from '../../providers/quality/quality';
import { LoadingController } from 'ionic-angular';
import { StationDetailsPage } from '../station-details/station-details';

/**
 * Generated class for the MyStationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-station',
  templateUrl: 'my-station.html',
})
export class MyStationPage {

  stations: StationObj[] = [];
  pollution: Polution[];
  station: StationObj=new StationObj();
  colors: any;
  color: any;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController,public qualityProvider: QualityProvider, public navParams: NavParams, public geolocation: Geolocation, public restProvider: RestProvider, public haversineService: HaversineProvider) {
    this.station.name="Proszę chwilkę poczekać";
    this.colors = ['Bardzo Dobra', 'Dobra', 'Umiarkowana', 'Zła', 'Bardzo Zła', 'Tragiczna'];

    this.restProvider.getTab().then((data: StationObj[]) => {
      this.stations = data;
      this.station = this.stations[0];
    let myLocalization: any;
    this.getMyLocalization().then(data => {
      myLocalization = data;
      let min = this.getInMeters(myLocalization, new GeoCoord(this.station.latitude, this.station.longitude));
        for (let i = 1; i < this.stations.length; i++){
          let state = this.stations[i];
          let value = this.getInMeters(myLocalization, new GeoCoord(state.latitude, state.longitude))
          if (value < min){
            min = value;
            this.station = state;
          }
        }
        this.restProvider.getSingleStation(this.station.id).then((data: Polution[]) => {
          this.pollution = data;
         })
       })
    })

  }

  getNearestStation(){
    let station: StationObj = this.stations[0];
    let myLocalization: any;
    this.getMyLocalization().then(data => {
      myLocalization = data;
      let max = this.getInMeters(myLocalization, new GeoCoord(station.latitude, station.longitude));
        for (let i = 1; i < this.stations.length; i++){
          let state = this.stations[i];
          let value = this.getInMeters(myLocalization, new GeoCoord(state.latitude, state.longitude))
          if (value > max){
            max = value;
            station = state;
          }
        }
        return station;
    })
  }

  getMyLocalization(){
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then(pos => {
        resolve(new GeoCoord(pos.coords.latitude, pos.coords.longitude));
      })
    })
  }

  getInMeters(my: GeoCoord, stat: GeoCoord){
    return this.haversineService.getDistanceInMeters(my, stat);
  }


  itemTapped(event, item) {
    this.navCtrl.push(StationDetailsPage, {item: item});
  }

}
