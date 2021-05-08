import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})

export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  constructor(private rendere: Renderer2, private elementRef: ElementRef) { }

  @HostListener('click') toggleDropdown(eventData: Event): void {
    this.isOpen = !this.isOpen;
  }

}
