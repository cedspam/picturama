import { ExifOrientation } from '../../common/models/DataTypes'
import { PhotoType, PhotoWork } from '../../common/models/Photo'
import { assertRendererProcess } from '../../common/util/ElectronUtil'
import SerialJobQueue from '../../common/util/SerialJobQueue'
import Profiler from '../../common/util/Profiler'

import { getNonRawImgPath } from '../data/ImageProvider'
import PhotoCanvas from './PhotoCanvas'
import { Texture } from './WebGLCanvas'


assertRendererProcess()


type RenderJob = { nonRawImgPath: string, texture: Texture, orientation: ExifOrientation, photoWork: PhotoWork, profiler: Profiler | null }

const queue = new SerialJobQueue(
    (newJob, existingJob) => (newJob.nonRawImgPath === existingJob.nonRawImgPath) ? newJob : null,
    renderNextThumbnail)


// Target row height of our overview (class Grid) is 320px.
// Max width is relatively high in order to get most panorama images with full row height.
const maxThumbnailWidth = 1024
const maxThumbnailHeight = 320

let canvas: PhotoCanvas | null = null


export async function renderThumbnailForPhoto(photo: PhotoType, photoWork: PhotoWork, profiler: Profiler | null = null): Promise<string> {
    return await renderThumbnail(getNonRawImgPath(photo), photo.orientation, photoWork, profiler)
}


export async function renderThumbnail(nonRawImgPath: string, orientation: ExifOrientation, photoWork: PhotoWork, profiler: Profiler | null): Promise<string> {
    if (canvas === null) {
        canvas = new PhotoCanvas()
            .setMaxSize(maxThumbnailWidth, maxThumbnailHeight)
        if (profiler) profiler.addPoint('Created canvas')
    }

    return canvas.createTextureFromSrc(nonRawImgPath, profiler)
        .then(texture => {
            return queue.addJob({ nonRawImgPath, texture, orientation, photoWork, profiler })
        })
}


async function renderNextThumbnail(job: RenderJob): Promise<string> {
    const { nonRawImgPath, texture, orientation, photoWork, profiler } = job
    if (profiler) profiler.addPoint('Waited in queue')

    canvas
        .setBaseTexture(texture)
        .setExifOrientation(orientation)
        .setPhotoWork(photoWork)
        .update()
    if (profiler) profiler.addPoint('Rendered canvas')

    if (!canvas.isValid()) {
        throw new Error(`Thumbnail canvas not valid`)
    }

    const dataUrl = canvas.getElement().toDataURL('image/webp')
    if (profiler) profiler.addPoint('Encoded thumbnail to data URL')
    return dataUrl
}
