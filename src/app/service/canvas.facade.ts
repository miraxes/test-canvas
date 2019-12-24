import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/reducers';
import { TextLayer } from '../models/canvas';
import { AddLayer, RemoveLastLayer } from '../store/actions/canvas.actions';

@Injectable({
  providedIn: 'root'
})
export class CanvasFacade {
  private currentState: TextLayer[] = [];

  constructor(private store$: Store<State>) {
    this.store$.subscribe(store => {
      this.currentState = store.layers;
    });
  }

  addTextLayer(textLayer: TextLayer) {
    this.store$.dispatch(new AddLayer({textLayer}));
  }

  removeLastTextLayer() {
    this.store$.dispatch(new RemoveLastLayer());
  }

  getAllTextLayers(): TextLayer[] {
    return this.currentState;
  }
}
