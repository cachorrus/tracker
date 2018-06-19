import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { filter, takeWhile } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { UsuarioProvider } from '../usuario/usuario';

export interface Taxi {
  clave?: string;
  lat: number;
  lng: number;
  nombre: string;
}


@Injectable()
export class UbicacionProvider {

  private taxiDoc: AngularFirestoreDocument<Taxi>;
  taxi$: Observable<Taxi>;

  private alive: boolean = true;

  constructor(
    private geolocation: Geolocation,
    private afs: AngularFirestore,
    private _usuarioProv: UsuarioProvider
  ) {
        
    
  }
  
  inicializarTaxista() {
    
    this.taxiDoc = this.afs.doc<Taxi>(`usuarios/${ this._usuarioProv.clave }`);
    this.taxi$ = this.taxiDoc.valueChanges();
    
  }


  inicializarUbicacion() {

    this.alive = true;

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.taxiDoc.update({
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      });

      this.geolocation.watchPosition()      
          .pipe(
            takeWhile( () => this.alive ), // unsubscribe cuando sea false
            filter((p) => p.coords !== undefined) //Filter Out Errors
          )
          .subscribe((data) => {
          // data can be a set of coordinates, or an error (if an error occurred).
          // data.coords.latitude
          // data.coords.longitude
          console.log('ubicacion alive: ', this.alive );
          console.log('Coords: ',  data.coords );

          this.taxiDoc.update({
            lat: data.coords.latitude,
            lng: data.coords.longitude
          });
        });
            

     }).catch((error) => {
       console.log('Error getting location', error.message);
       alert(error.message);
     });
  }


  detenerUbicacion() {

    this.alive = false;

  }

}
