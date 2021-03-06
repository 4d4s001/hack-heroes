import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest'
import { StationDetailsPage } from '../station-details/station-details';
import { LoadingController } from 'ionic-angular';
import { StationObj } from '../../models/stationObj';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  searchQuery: string = '';
  stations: any;
  items: any;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    if(this.restProvider.czy){
       const loader = this.loadingCtrl.create({
            content: "Właśnie pobierane są najświeższe informacje!",
         });
        loader.present();

       this.restProvider.getTab()
       .then((data: StationObj[]) => {
            this.stations = data;
             loader.dismissAll();
      });
      this.restProvider.czy=false;
    }
    else{
    	this.restProvider.getTab()
       .then((data: StationObj[]) => {
            this.stations = data;
      	});
    }
  }

  initializeItems() {
  	if(this.stations){
  		this.items = this.stations.slice();
  	}
  	else{
  		this.items=null;
  	}
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

      console.log('TUTAJ')
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items

    if (this.items && val && val.trim() != '') {

      if (val && val.trim() != '') {

       this.items = this.items.filter((item) => {
         return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
       })
     }
   }

  itemTapped(event, item) {
    this.navCtrl.push(StationDetailsPage, {item: item});
  }

}
