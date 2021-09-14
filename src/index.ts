// S3
import getFileUrl from './s3/get_file_url'
import getFile from './s3/get_file'
import uploadFile from './s3/upload_file'
import removeFile from './s3/remove_file'
import makeBucket from './s3/cf/bucket'

// DB
import { getDbItem, listDbItems, setDbItem, removeDbItem } from './db/db'

// Cognito
import { createUser } from './cognito/createUser'
import { removeUser } from './cognito/removeUser'
import { resetPassword } from './cognito/resetPassword'
import { validateToken } from './cognito/validateJwtToken'
import { loginUser } from './cognito/loginUser'
import { loginHandleNewPassword } from './cognito/loginHandleNewPassword'

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
    },
    cognito: {
        createUser,
        removeUser,
        resetPassword,
        validateToken,
        loginUser,
        loginHandleNewPassword
    }
}
