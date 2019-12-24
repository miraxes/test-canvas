import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import * as WebFont from 'webfontloader';
import { TextLayer } from '../models/canvas';
import { CanvasFacade } from '../service/canvas.facade';

const NUMBERS_REGEX = /^[0-9]+(\.?[0-9]+)?$/;
const FONTS_LIST = ['Calistoga', 'Tangerine', 'Bebas Neue', 'Acme', 'Permanent Marker'];
const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 500;
const MAX_TEXT_LENGTH = 50;

@Component({
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  canvasForm: FormGroup;

  ctx: CanvasRenderingContext2D;

  canvasHeight = CANVAS_HEIGHT;
  canvasWidth = CANVAS_WIDTH;
  maxTextLength = MAX_TEXT_LENGTH;
  fontsList = FONTS_LIST;

  submitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private canvasFacade: CanvasFacade
  ) { }

  get text(): AbstractControl { return this.canvasForm.get('text'); }
  get yValue(): AbstractControl { return this.canvasForm.get('yValue'); }
  get xValue(): AbstractControl { return this.canvasForm.get('xValue'); }
  get fontSize(): AbstractControl { return this.canvasForm.get('fontSize'); }
  get fontColor(): AbstractControl { return this.canvasForm.get('fontColor'); }
  get fontFamily(): AbstractControl { return this.canvasForm.get('fontFamily'); }

  get imageData(): string {
    return this.canvas.nativeElement.toDataURL();
  }

  get isUndoDisabled(): boolean {
    return !this.canvasFacade.getAllTextLayers().length;
  }

  ngOnInit() {
    this.initForm();
    this.loadGoogleFonts();
    this.initCanvasContext();
  }

  undo() {
    this.canvasFacade.removeLastTextLayer();
    this.clearCanvas();
    this.drawStoredText();
  }

  draw() {
    this.submitAttempt = true;
    if (this.canvasForm.invalid) {
      return;
    }
    const tmpText = new TextLayer();
    tmpText.fontSize = this.fontSize.value || 35;
    tmpText.yValue = this.yValue.value || this.canvasHeight / 2;
    tmpText.xValue = this.xValue.value || this.canvasWidth / 2;
    tmpText.fontColor = this.fontColor.value;
    tmpText.text = this.text.value;
    tmpText.fontFamily = this.fontFamily.value;
    this.canvasFacade.addTextLayer(tmpText);
    this.addTextLayer(tmpText);
    this.resetForm();
  }

  private drawStoredText() {
    this.canvasFacade.getAllTextLayers().forEach(r => {
      this.addTextLayer(r);
    });
  }

  private resetForm() {
    this.canvasForm.reset();
    this.submitAttempt = false;
    this.canvasForm.patchValue({fontFamily: FONTS_LIST[0]});
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  private addTextLayer(layer: TextLayer) {
    this.ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
    const x = layer.xValue;
    const y = layer.yValue;
    this.ctx.fillStyle = layer.fontColor;
    this.ctx.fillText(layer.text, x, y);
  }

  private initCanvasContext() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  private loadGoogleFonts() {
    WebFont.load({
      google: {
        families: FONTS_LIST
      }
    });
  }

  private initForm() {
    this.canvasForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(MAX_TEXT_LENGTH)]],
      yValue: ['', [Validators.pattern(NUMBERS_REGEX), Validators.max(this.canvasHeight)]],
      xValue: ['', [Validators.pattern(NUMBERS_REGEX), Validators.max(this.canvasWidth)]],
      fontSize: ['', Validators.pattern(NUMBERS_REGEX)],
      fontColor: [''],
      fontFamily: [FONTS_LIST[0], Validators.required]
    });
  }
}
