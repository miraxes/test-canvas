import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as WebFont from 'webfontloader';

const NUMBERS_REGEX = /^[0-9]+(\.?[0-9]+)?$/;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  ctx: CanvasRenderingContext2D;
  readonly CANVAS_HEIGHT = 700;
  readonly CANVAS_WIDTH = 500;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  fontList = ['Calistoga', 'Tangerine', 'Bebas Neue', 'Acme', 'Permanent Marker'];
  submitAttempt: boolean;
  canvasForm = this.fb.group({
    text: ['', Validators.required],
    yValue: ['', [Validators.pattern(NUMBERS_REGEX), Validators.max(this.CANVAS_HEIGHT)]],
    xValue: ['', [Validators.pattern(NUMBERS_REGEX), Validators.max(this.CANVAS_WIDTH)]],
    fontSize: ['', [Validators.pattern(NUMBERS_REGEX)]],
    fontFamily: [this.fontList[1], [Validators.required]]
  });

  constructor(private fb: FormBuilder) { }

  get text() { return this.canvasForm.get('text'); }
  get yValue() { return this.canvasForm.get('yValue'); }
  get xValue() { return this.canvasForm.get('xValue'); }
  get fontSize() { return this.canvasForm.get('fontSize'); }
  get fontFamily() { return this.canvasForm.get('fontFamily'); }

  ngOnInit() {
    WebFont.load({
      google: {
        families: this.fontList
      }
    });
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  draw() {
    this.submitAttempt = true;
    if (this.canvasForm.valid) {
      this.clearCanvas();
      this.ctx.font = `${this.fontSize.value || 35}px ${this.fontFamily.value}`;
      const x = this.xValue.value || this.CANVAS_WIDTH / 2;
      const y = this.yValue.value || this.CANVAS_HEIGHT / 2;
      this.ctx.fillText(this.text.value, x, y);
    }
  }

  get imageData() {
    return this.canvas.nativeElement.toDataURL();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

}
