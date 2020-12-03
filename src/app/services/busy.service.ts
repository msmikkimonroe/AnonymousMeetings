import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IBusyService } from '.';

@Injectable({
  providedIn: 'root'
})
export class BusyService implements IBusyService {
  loader: any;

  constructor(private loadingController: LoadingController) { }

  async initialize() {}

  async present(content?: string) {
    this.dismiss();

    this.loader = await this.loadingController.create({ message: content ? content : 'Please wait...' });
    this.loader.present();
    
    this.loader.onDidDismiss(() => {
      this.loader = null;
    })
  }

  dismiss() {
    if (this.loader)
      this.loader.dismiss();
      this.loader = null;
  }t 
}