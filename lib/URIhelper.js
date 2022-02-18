import parseDataURL from 'data-urls'
import { labelToName, decode } from 'whatwg-encoding'
import DOMPurify from 'isomorphic-dompurify'

export const breakingReturnValue = {
    mimeType: 'text/plain',
    bodyDecoded: 'Error : No compatible content to show'
}

export function resolveContentURI(contentURI) {
    try { // try text/plain decoding
        // console.log('text/plain decoding')
        const dataURL = parseDataURL(contentURI)
        const mimeType = dataURL.mimeType.toString()
        if (mimeType.startsWith('text/plain')) {
            const encodingName = labelToName(dataURL.mimeType.parameters.get("charset") || "utf-8")
            const bodyDecoded = decode(dataURL.body, encodingName)
            return { mimeType: mimeType, bodyDecoded: bodyDecoded }
        }
    }
    catch (error) {
        // console.log('could not parse string')
        // console.log(error)
    }
    try { // try text/html decoding
        // console.log('text/html decoding')
        let dataURL = parseDataURL(contentURI)
        let mimeType = dataURL.mimeType.toString()
        if (mimeType === 'text/html') {
            const encodingName = labelToName(dataURL.mimeType.parameters.get("charset") || "utf-8")
            const bodyDecoded = decode(dataURL.body, encodingName)
            return { mimeType: mimeType, bodyDecoded: DOMPurify.sanitize(bodyDecoded) }
        }
    }
    catch (error) {
        // console.log('could not parse string')
        // console.log(error)
    }
    try { // try image as link (frequent use case)
        // console.log('mage as link decoding')
        if (contentURI.toLowerCase().startsWith('https://')) {
            return { mimeType: 'image', bodyDecoded: contentURI }
        }
    }
    catch (error) {
        // console.log('could not parse string')
        // console.log(error)
    }
    //if nothing matched :
    return breakingReturnValue
}