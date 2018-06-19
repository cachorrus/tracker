import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private _usuarioProvider: UsuarioProvider
  ) {
  }

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    
    this.bloquearSlides( true );

    /*this.slides.lockSwipes( true );
    this.slides.freeMode = false;*/
  }

  bloquearSlides( bloquear:boolean ) {
    this.slides.lockSwipes( bloquear );
    this.slides.freeMode = !bloquear;
  }

  mostrarInput() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (data.username) {
              // logged in!
              this.verifcarUsuario(data.username);
              
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  verifcarUsuario( clave:string ) {

    const loading = this.loadingCtrl.create( {
      content: 'Verificando...'
    });

    loading.present();

    this._usuarioProvider.verificarUsuario( clave )
        .then( existe => {

          loading.dismiss();

          if (existe) {

            this.bloquearSlides(false);
            this.slides.slideNext();
            this.bloquearSlides(true);


          } else {

            this.alertCtrl.create( {
              title: 'Usuario incorrecto',
              subTitle: 'favor de intentar de nuevo',
              buttons: ['Aceptar']
            }).present();

          }

        })
        .catch( error => {

          console.log('verifcarUsuario: ', JSON.stringify(error));

        });

  }

  ingresar() {
    this.navCtrl.setRoot( HomePage );
  }

}
