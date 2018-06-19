import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UbicacionProvider, Taxi } from '../../providers/ubicacion/ubicacion';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // google maps zoom level
  zoom: number = 16;

  user:Taxi = {lat:0,lng:0,nombre:''};

  private alive: boolean = true;

  constructor(
    public navCtrl: NavController,
    private _ubicacionProv: UbicacionProvider,
    private platform: Platform,
    private _usuarioProv: UsuarioProvider
  ) {

    console.log('home alive: ', this.alive );

    this.platform.ready()
        .then(() => {

          this._ubicacionProv.inicializarTaxista();
          this._ubicacionProv.inicializarUbicacion();

          this._ubicacionProv.taxi$
              .pipe(
                takeWhile( () => this.alive )
              ) 
              .subscribe( (data:Taxi) => {

            console.log('taxi:', data);

            this.user = data;

          });

        });

  }

  salir() {

    this._ubicacionProv.detenerUbicacion();
    this._usuarioProv.borrarUsuario();
    this.alive = false;

    this.navCtrl.setRoot( 'LoginPage' );

  }

}
