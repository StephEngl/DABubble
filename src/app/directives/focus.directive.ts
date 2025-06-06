import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFocus]',
  standalone: true
})
export class FocusDirective implements OnChanges {

  @Input() appFocus = false;

  element: HTMLElement;

  constructor(ref: ElementRef) {
    this.element = ref.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['appFocus'];

    if (change && change.currentValue === true) {
      requestAnimationFrame(() => {
        this.element.focus();
      });
    }
  }
}