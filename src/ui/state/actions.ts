import { action, createAsyncAction } from 'typesafe-actions'

import { Device } from '../../common/models/DataTypes'
import { PhotoId, PhotoType, PhotoDetail, PhotoWork, PhotoSection, PhotoSectionId, PhotoFilter } from '../../common/models/Photo'
import { TagType } from '../../common/models/Tag'

import {
    SETTINGS_EXISTS_REQUEST, SETTINGS_EXISTS_SUCCESS, SETTINGS_EXISTS_FAILURE, SET_DETAIL_PHOTO_REQUEST, SET_DETAIL_PHOTO_SUCCESS, SET_DETAIL_PHOTO_FAILURE,
    CLOSE_DETAIL, SET_SELECTED_PHOTOS, FETCH_TOTAL_PHOTO_COUNT, FETCH_SECTIONS_REQUEST, FETCH_SECTIONS_SUCCESS, FETCH_SECTIONS_FAILURE,
    FETCH_SECTION_PHOTOS, FORGET_SECTION_PHOTOS,
    CHANGE_PHOTOWORK, CHANGE_PHOTOS, EMPTY_TRASH, START_IMPORT, SET_IMPORT_PROGRESS, FETCH_DATES, FETCH_TAGS, CREATE_TAGS,
    INIT_DEVICES, ADD_DEVICE, REMOVE_DEVICE, OPEN_TAGS_EDITOR, CLOSE_TAGS_EDITOR, OPEN_DIFF, CLOSE_DIFF, OPEN_EXPORT, CLOSE_EXPORT, TOGGLE_DIFF
} from './actionTypes'
import { DatesState } from './reducers/data'
import { ImportProgress } from './reducers/import'


export const checkSettingsExistAction = createAsyncAction(SETTINGS_EXISTS_REQUEST, SETTINGS_EXISTS_SUCCESS, SETTINGS_EXISTS_FAILURE)<void, void, Error>()

export const setDetailPhotoAction = createAsyncAction(SET_DETAIL_PHOTO_REQUEST, SET_DETAIL_PHOTO_SUCCESS, SET_DETAIL_PHOTO_FAILURE)<{ sectionId: PhotoSectionId, photoIndex: number, photoId: string }, { photoDetail: PhotoDetail, photoWork: PhotoWork }, Error>()
export const closeDetailAction = () => action(CLOSE_DETAIL)

export const setSelectedPhotosAction = (sectionId: PhotoSectionId, photoIds: PhotoId[]) => action(SET_SELECTED_PHOTOS, { sectionId, photoIds })

export const fetchTotalPhotoCountAction = (totalPhotoCount: number) => action(FETCH_TOTAL_PHOTO_COUNT, { totalPhotoCount })
export const fetchSectionsAction = createAsyncAction(FETCH_SECTIONS_REQUEST, FETCH_SECTIONS_SUCCESS, FETCH_SECTIONS_FAILURE)<{ newFilter: PhotoFilter | null }, { sections: PhotoSection[] }, Error>()
export const fetchSectionPhotosAction = (sectionId: PhotoSectionId, photos: PhotoType[]) => action(FETCH_SECTION_PHOTOS, { sectionId, photos })
export const forgetSectionPhotosAction = (sectionIds: { [index: string]: true }) => action(FORGET_SECTION_PHOTOS, { sectionIds })
export const changePhotoWorkAction = (photoId: PhotoId, photoWork: PhotoWork) => action(CHANGE_PHOTOWORK, { photoId, photoWork })
export const changePhotosAction = (photos: PhotoType[]) => action(CHANGE_PHOTOS, { photos })
export const emptyTrashAction = (trashedPhotoIds: PhotoId[]) => action(EMPTY_TRASH, { trashedPhotoIds })

export const startImportAction = () => action(START_IMPORT)
export const setImportProgressAction = (progress: ImportProgress) => action(SET_IMPORT_PROGRESS, { progress })

export const fetchDatesAction = (dates: DatesState) => action(FETCH_DATES, { dates })

export const fetchTagsAction = (tags: TagType[]) => action(FETCH_TAGS, { tags })
export const createTagsAction = (tags: TagType[]) => action(CREATE_TAGS, { tags })

export const initDevicesAction = (devices: Device[]) => action(INIT_DEVICES, { devices })
export const addDeviceAction = (device: Device) => action(ADD_DEVICE, { device })
export const removeDeviceAction = (device: Device) => action(REMOVE_DEVICE, { device })

export const openTagsEditorAction = () => action(OPEN_TAGS_EDITOR)
export const closeTagsEditorAction = () => action(CLOSE_TAGS_EDITOR)

export const openDiffAction = () => action(OPEN_DIFF)
export const closeDiffAction = () => action(CLOSE_DIFF)

export const openExportAction = (sectionId: PhotoSectionId, photoIds: PhotoId[]) => action(OPEN_EXPORT, { sectionId, photoIds })
export const closeExportAction = () => action(CLOSE_EXPORT)

//export const TOGGLE_DIFF = 'TOGGLE_DIFF'  // Was: 'TOGGLE_DIFF_SUCCESS'
