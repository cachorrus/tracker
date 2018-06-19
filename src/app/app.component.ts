import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UsuarioProvider } from '../providers/usuario/usuario';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    _usuarioProvider: UsuarioProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      _usuarioProvider.cargarStorage()
          .then( existe => {
            
            statusBar.styleDefault();
            splashScreen.hide();
            
            if ( existe ){

              this.rootPage = HomePage;

            } else {

              this.rootPage = 'LoginPage';

            }

          }).catch( error =>{

            console.log( JSON.stringify(error));
            this.rootPage = 'LoginPage';

          });      

    });
  }
}

