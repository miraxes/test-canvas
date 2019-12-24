import {
    MetaReducer
  } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { CanvasActionTypes, LayerUnion } from '../actions/canvas.actions';
import { State } from '.';

export const canvasReducer = (state = [], action: LayerUnion) => {
     switch (action.type) {
       case CanvasActionTypes.AddLayer:
         return [...state, action.payload.textLayer];
       case CanvasActionTypes.RemoveLastLayer:
            return state.slice(0, -1);
       default:
         return state;
     }
    };

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
