import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprouteguardService implements CanActivate {
  private refresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (sessionStorage.getItem('session') != null ) {
        return true;
    } else {
        this.router.navigate(['/'])
        return false;
    }
  }

  public getRefresh(): Observable<boolean> {
    return this.refresh.asObservable();
  }
  
  public setRefresh(value: boolean): void {  
    this.refresh.next(value);
  }
}