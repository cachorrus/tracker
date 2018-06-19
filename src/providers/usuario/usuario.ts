import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { takeWhile } from 'rxjs/operators';

@Injectable()
export class UsuarioProvider {

  clave:string;

  private alive:boolean = true;

  constructor( private afDB: AngularFirestore,
    private storage: Storage
  ) {
    console.log('Hello UsuarioProvider Provider');
  }

  verificarUsuario( clave:string ) {

    this.alive = true;

    console.log( 'usuario alive: ', this.alive );

    clave = clave.toLocaleLowerCase().trim();

    return new Promise( ( resolve, reject ) => {

      this.afDB.doc(`/usuarios/${clave}`)
          .valueChanges()
          .pipe( 
            takeWhile( () => this.alive)
          )
          .subscribe( data => {            

            if ( data ){

              console.log(JSON.stringify(data));
              this.clave = clave;       
              this.guardarStorage();

              resolve(true);

            } else {

              resolve(false);
              
            }            

          });

    });

  }

  guardarStorage() {
    this.storage.set('clave', this.clave);
  }

  cargarStorage() {
    return new Promise( (resolve, reject) => {

      this.storage.get('clave').then((val) => {

        // regresa null si el storage(ajustes) no existe
        if ( val ) {
          this.clave = val;
          resolve(true);
        } else {
          resolve(false);
        }
                
        console.log('Driver: ', this.storage.driver);
        console.log('cargarStorage: ', JSON.stringify(val));        
  
      }, (err) => {

        console.log('Error cargarStorage: ', JSON.stringify(err));
        reject( err );
        
      });

    });
  }

  borrarUsuario() {

    this.clave = null;
    this.alive = false;

    this.storage.remove('clave');

  }

}
