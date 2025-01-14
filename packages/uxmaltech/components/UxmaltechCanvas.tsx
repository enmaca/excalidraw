import { useEffect, useState } from "react";
import { useExcalidrawActionManager } from "../../excalidraw/components/App";
import { loadUxmaltechCanvas } from "../actions";
import { StoreAction } from "../../excalidraw/store";
import './UxmaltechCanvas.scss';
import Spinner from "../../excalidraw/components/Spinner";

export function UxmaltechCanvas() {

    const actionManager = useExcalidrawActionManager();

    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        actionManager.executeAction({
            ...loadUxmaltechCanvas,
            perform: async (...args) => {
                const result = await loadUxmaltechCanvas.perform(...args);
                if(typeof result === 'object' && result.storeAction === StoreAction.NONE) setFailed(true);
                setLoading(false);
                return result;
            }
        });
    }, [])

    if(!loading && !failed) return null

    return (
        <div className='uxmaltech-loading-container'>
            <div>
                {loading && <Spinner size='1.5em' />}
            </div>
            <span>{loading ? 'Loading canvas' : 'Failed to load canvas'}</span>
        </div>
    )
}