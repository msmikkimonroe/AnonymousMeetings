import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Feature } from '../enums/feature.enum';
import { TranslateUniversalLoader } from '../utils/translateuniversalloader';
import { IUserService } from '../services';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private router: Router, private userService: IUserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let features = route.data.roles as Array<string>;
    // if( this.userService._user.hasFeature(features) ) {
      return true;
    // } else {
    //   return false;
    // }
  }
}
