import { register } from '../../excalidraw/actions/register'
import { StoreAction } from "../../excalidraw/store";
import { getCanvasIdFromUrl } from '../utils/canvas/getCanvasIdFromUrl';
import { envUxmaltechCanvasUrl } from '../utils/env/envUxmaltechCanvasUrl';
import type { FractionalIndex, OrderedExcalidrawElement } from '../../excalidraw/element/types';
import type { AppState, BinaryFiles } from '../../excalidraw/types';
import type { Radians } from '../../math/types';
import { serializeAsJSON } from '../../excalidraw';

export const loadUxmaltechCanvas = register({
  name: "loadCanvas" as any,
  label: "buttons.loadCanvas",
  trackEvent: false,
  predicate: (elements, appState, props, app) => {
    return (
      !!app.props.UIOptions.canvasActions.loadScene && !appState.viewModeEnabled
    );
  },
  perform: async (elements, appState, _, app) => {
    try {
      const {
        elements: loadedElements,
        appState: loadedAppState,
        files,
      } = await fetchCanvasInfo();

      return {
        elements: loadedElements,
        appState: loadedAppState,
        files,
        storeAction: StoreAction.CAPTURE,
      };
    } catch (error: any) {
      return {
        elements,
        appState: { ...appState, errorMessage: error.message },
        files: app.files,
        storeAction: StoreAction.NONE,
      };
    }
  },
});

export const saveUxmaltechCanvas = register({
  name: "saveCanvas" as any,
  label: "buttons.save",
  trackEvent: false,
  perform: async (elements, appState, value, app) => {
    try {

      const serializedCanvas = serializeAsJSON(elements, appState, app.files, 'database');
      await saveCanvasInfo(serializedCanvas)

      return {
        storeAction: StoreAction.NONE,
        appState: appState
      };
    } catch (error: any) {
      return { storeAction: StoreAction.NONE, message: error.message };
    }
  },
});

async function saveCanvasInfo(serializedCanvas: string): Promise<void> {
  const canvasId = getCanvasIdFromUrl()
  if(!canvasId) throw new Error('Canvas ID not found');

  const response = await fetch(`${envUxmaltechCanvasUrl()}/${canvasId}`, {
      method: 'PUT',
      body: serializedCanvas,
  });

  if (!response.ok) {
    throw new Error(`HTTP Status: ${response.statusText}`);
  }
}

async function fetchCanvasInfo(): Promise<CanvasInfo> {
  const canvasId = getCanvasIdFromUrl()
  if(!canvasId) throw new Error('Canvas ID not found');

  const response = await fetch(`${envUxmaltechCanvasUrl()}/${canvasId}`);
  if (!response.ok) {
    throw new Error(`HTTP Status: ${response.statusText}`);
  }

  return response.json();
}

type CanvasInfo = {
  elements: OrderedExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
}