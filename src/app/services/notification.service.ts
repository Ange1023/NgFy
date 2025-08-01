import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  show(options: { 
    message: string; 
    type?: 'success' | 'error' | 'info' | 'warning'; 
    duration?: number 
  }) {
    this.dismiss(); 

 
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NotificationComponent);
    const componentRef = componentFactory.create(this.injector);
    
    componentRef.instance.message = options.message;
    componentRef.instance.type = options.type || 'info';
    componentRef.instance.duration = options.duration || 3000;
    
    componentRef.instance.dismissed.subscribe(() => {
      this.dismiss();
    });
    
    this.appRef.attachView(componentRef.hostView);
    
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    
    document.body.appendChild(domElem);
    
    this.notificationRef = componentRef;
  }

  dismiss() {
    if (this.notificationRef) {
      this.appRef.detachView(this.notificationRef.hostView);
      this.notificationRef.destroy();
      this.notificationRef = null;
    }
  }
}