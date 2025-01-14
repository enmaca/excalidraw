
import { useState } from "react";
import { Button } from "../../excalidraw/components/Button";
import Spinner from "../../excalidraw/components/Spinner";
import "./UxmaltechSaveButton.scss";
import { envUxmaltechCanvasUrl } from "../utils/env/envUxmaltechCanvasUrl";
import { getCanvasIdFromUrl } from "../utils/canvas/getCanvasIdFromUrl";
import { ErrorDialog } from "../../excalidraw/components/ErrorDialog";
import { serializeAsJSON, StoreAction } from "../../excalidraw";
import { useExcalidrawActionManager } from "../../excalidraw/components/App";
import { saveUxmaltechCanvas } from "../actions";

export function UxmaltechSaveButton() {

    const [loading, setLoading]  = useState(false);
    const [errorMessage, setErrorMessage]  = useState('');

    const actionManager = useExcalidrawActionManager();

    const saveCanvas = async () => {
        setLoading(true)
        actionManager.executeAction({
            ...saveUxmaltechCanvas,
            perform: async (...args) => {
                const result = await saveUxmaltechCanvas.perform(...args);
                setLoading(false)
                if(typeof result === 'object' && result.storeAction === StoreAction.NONE) setErrorMessage(result.message ?? '');
                return result;
            }
        });
    }

    return (
        <>
            {!!errorMessage && <ErrorDialog onClose={() => setErrorMessage('')}>{errorMessage}</ErrorDialog>}
            <Button
                type="button"
                onSelect={saveCanvas}
                style={{ position: "relative", width: "auto" }}
                className="collab-button uxmaltech-save-button"
                disabled={loading}
            >
                {loading ? <Spinner  /> : 'Save'}
            </Button>
        </>
    )
}