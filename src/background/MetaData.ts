import fs from 'fs'

import Promise from 'bluebird'
import ExifParser from 'exif-parser'
import { ExifOrientation } from '../common/models/DataTypes'

const readFile = Promise.promisify(fs.readFile)
const fileStat = Promise.promisify(fs.stat)


export interface MetaData {
    imgWidth?:     number
    imgHeight?:    number
    exposureTime?: number
    iso?:          number
    aperture?:     number
    focalLength?:  number
    createdAt?:    Date
    /** Details on orientation: https://www.impulseadventure.com/photo/exif-orientation.html */
    orientation:   ExifOrientation
    tags:          string[]
}


export function readMetadataOfImage(imagePath: string): Promise<MetaData> {
    return readExifOfImage(imagePath)
        .then(extractMetaDataFromExif)
        .catch(error => {
            if (error.message !== 'Invalid JPEG section offset') {
                console.log(`Reading EXIF data from ${imagePath} failed - continuing without. Error: ${error.message}`)
            }
            return fileStat(imagePath)
                .then(stat => ({
                    createdAt: stat.birthtime,
                    orientation: 1,
                    tags: []
                }))
        })
}


function readExifOfImage(imagePath) {
    return readFile(imagePath)
        .then(buffer => {
            const parser = ExifParser.create(buffer) as any
            return parser.parse()
        })
}


function extractMetaDataFromExif(exifData): MetaData {
    const exifTags = exifData.tags
    const rawDate = exifTags.DateTimeOriginal || exifTags.DateTime || exifTags.CreateDate || exifTags.ModifyDate
    let metaData = {
        imgWidth:     (exifData.imageSize && exifData.imageSize.width)  || exifTags.ExifImageWidth,
        imgHeight:    (exifData.imageSize && exifData.imageSize.height) || exifTags.ExifImageHeight,
        exposureTime: exifTags.ExposureTime,
        iso:          exifTags.ISO,
        aperture:     exifTags.FNumber,
        focalLength:  exifTags.FocalLength,
        createdAt:    rawDate ? new Date(rawDate * 1000) : undefined,
        orientation:  exifTags.Orientation || 1,
            // Details on orientation: https://www.impulseadventure.com/photo/exif-orientation.html
        tags:         []
    };

    // TODO: Translate from `exiv2` result into `exif-parser` result
    //if (exData.hasOwnProperty('Xmp.dc.subject'))
    //  metaData.tags = exData['Xmp.dc.subject'].split(', ');

    return metaData;
};
