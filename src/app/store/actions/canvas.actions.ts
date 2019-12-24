import { Action } from '@ngrx/store';
import { TextLayer } from '../../models/canvas';

export enum CanvasActionTypes {
  AddLayer = '[Canvas] Add Layer',
  RemoveLastLayer = '[Canvas] Remove Last Layer'
}

export class AddLayer implements Action {
  readonly type = CanvasActionTypes.AddLayer;

  constructor(public payload: { textLayer: TextLayer }) {}
}

export class RemoveLastLayer implements Action {
  readonly type = CanvasActionTypes.RemoveLastLayer;
}

export type LayerUnion = AddLayer | RemoveLastLayer;
