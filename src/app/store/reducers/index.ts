import {
    ActionReducerMap,
    MetaReducer
  } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { TextLayer } from 'src/app/models/canvas';
import { canvasReducer } from './canvas.reducer';

export interface State {
    layers: TextLayer[];
}
export const reducers: ActionReducerMap<State> = {
    layers: canvasReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
