// S3
import getFileUrl from './s3/get_file_url'
import getFile from './s3/get_file'
import uploadFile from './s3/upload_file'
import removeFile from './s3/remove_file'
import makeBucket from './s3/cf/bucket'

// DB
import { getDbItem, listDbItems, setDbItem, removeDbItem } from './db/db'

export default {
    s3: {
        cf: {
            makeBucket
        },
        uploadFile,
        getFile,
        getFileUrl,
        removeFile
    },
    db: {
        get: getDbItem,
        list: listDbItems,
        set: setDbItem,
        remove: removeDbItem
    }
}
