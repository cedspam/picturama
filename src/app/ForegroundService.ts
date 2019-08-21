import { ipcRenderer } from 'electron'

import { Device } from 'common/CommonTypes'
import { assertRendererProcess } from 'common/util/ElectronUtil'

import ImportProgressController from 'app/controller/ImportProgressController'
import { setTags } from 'app/controller/PhotoTagController'
import { setFullScreenAction, initDevicesAction, addDeviceAction, removeDeviceAction, emptyTrashAction, openSettingsAction } from 'app/state/actions'
import store from 'app/state/store'


assertRendererProcess()


export function init() {
    ipcRenderer.on('executeForegroundAction', (event, callId, action, params) => {
        executeForegroundAction(action, params)
            .then(result => {
                ipcRenderer.send('onForegroundActionDone', callId, null, result)
            },
            error => {
                const msg = (error instanceof Error) ? error.message : error
                ipcRenderer.send('onForegroundActionDone', callId, msg, null)
            })
    })

    // TODO: Revive Legacy code of 'version' feature
    //ipcRenderer.on('new-version', (event, version: any /* Type should be `Version`, but it doesn't work */) => updatePhotoVersion(version))

    ipcRenderer.on('scanned-devices', (event, devices: Device[]) => store.dispatch(initDevicesAction(devices)))
    ipcRenderer.on('add-device', (event, device: Device) => store.dispatch(addDeviceAction(device)))
    ipcRenderer.on('remove-device', (event, device: Device) => store.dispatch(removeDeviceAction(device)))
}


async function executeForegroundAction(action: string, params: any): Promise<any> {
    if (action === 'onFullScreenChange') {
        store.dispatch(setFullScreenAction(params.isFullScreen))
    } else if (action === 'showSettings') {
        store.dispatch(openSettingsAction())
    } else if (action === 'setImportProgress') {
        ImportProgressController.setImportProgress(params.progress, params.updatedTags)
    } else if (action === 'onPhotoTrashed') {
        store.dispatch(emptyTrashAction(params.photoIds))

        if (params.updatedTags) {
            setTags(params.updatedTags)
        }
    } else {
        throw new Error('Unknown foreground action: ' + action)
    }
}