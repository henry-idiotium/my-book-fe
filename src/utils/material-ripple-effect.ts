type ColorType = 'dark' | 'light';

const EXIST_DURATION = 500;
const ColorConfig = {
  LIGHT: {
    COLOR: 'rgba(250,250,250, 0.3)',
  },
  DARK: {
    COLOR: 'rgba(0,0,0, 0.2)',
  },
};

export class Ripple {
  x = 0;
  y = 0;
  z = 0;

  findFurthestPoint(
    clickPointX: number,
    elementWidth: number,
    offsetX: number,
    clickPointY: number,
    elementHeight: number,
    offsetY: number,
  ) {
    this.x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth;
    this.y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight;
    this.z = Math.hypot(this.x - (clickPointX - offsetX), this.y - (clickPointY - offsetY));

    return this.z;
  }

  applyStyles(
    element: HTMLElement,
    color: ColorType,
    rect: DOMRect,
    radius: number,
    event: MouseEvent,
  ) {
    element.classList.add('ripple');
    element.style.backgroundColor =
      color === 'dark' ? ColorConfig.DARK.COLOR : ColorConfig.LIGHT.COLOR;
    element.style.borderRadius = '50%';
    element.style.pointerEvents = 'none';
    element.style.position = 'absolute';
    element.style.left = `${event.clientX - rect.left - radius}px`;
    element.style.top = `${event.clientY - rect.top - radius}px`;
    element.style.width = element.style.height = `${radius * 2}px`;
  }

  applyAnimation(element: HTMLElement) {
    element.animate(
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1.5)', opacity: 0 },
      ],
      { duration: 500, easing: 'linear' },
    );
  }

  create(event: MouseEvent | React.MouseEvent, color: ColorType) {
    const element = event.currentTarget as HTMLElement;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const rect = element.getBoundingClientRect();

    const radius = this.findFurthestPoint(
      event.clientX,
      element.offsetWidth,
      rect.left,
      event.clientY,
      element.offsetHeight,
      rect.top,
    );

    const circle = document.createElement('span');

    this.applyStyles(circle, color, rect, radius, event as MouseEvent);
    this.applyAnimation(circle);

    element.appendChild(circle);

    setTimeout(() => circle.remove(), EXIST_DURATION);
  }
}

(function setRipple() {
  const ripple = new Ripple();

  const lightRipple = document.querySelectorAll('[data-ripple-light="true"]');
  const darkRipple = document.querySelectorAll('[data-ripple-dark="true"]');

  if (lightRipple) {
    for (const element of Array.from(lightRipple)) {
      (element as HTMLElement).addEventListener('mouseup', (event) => {
        ripple.create(event, 'light');
      });
    }
  }

  if (darkRipple) {
    for (const element of Array.from(darkRipple)) {
      (element as HTMLElement).addEventListener('mouseup', (event) => {
        ripple.create(event, 'dark');
      });
    }
  }
})();

export default Ripple;
