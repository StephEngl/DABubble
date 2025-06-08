/**
 * FocusDirective automatically focuses the attached element when `appFocus` is true.
 */
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFocus]',
  standalone: true
})
export class FocusDirective implements OnChanges {

  /** Whether the element should receive focus. */
  @Input() appFocus = false;

  element: HTMLElement;

  constructor(ref: ElementRef) {
    this.element = ref.nativeElement;
  }

  /**
   * Focuses the element if `appFocus` becomes true.
   * @param changes - Object containing the changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['appFocus'];

    if (change && change.currentValue === true) {
      requestAnimationFrame(() => {
        this.element.focus();
      });
    }
  }
}