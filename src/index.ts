// S3
import getFileUrl from './s3/get_file_url'
import getFile from './s3/get_file'
import uploadFile from './s3/upload_file'
import removeFile from './s3/remove_file'
import makeBucket from './s3/cf/bucket'

// DB
import { getDbItem, listDbItems, setDbItem, removeDbItem } from './db/db'
import { makeDb } from './db/cf/makeDb'

// Cognito
import { createUser } from './cognito/createUser'
import { removeUser } from './cognito/removeUser'
import { resetPassword } from './cognito/resetPassword'
import { validateToken } from './cognito/validateJwtToken'
import { loginUser } from './cognito/loginUser'
import { loginHandleNewPassword } from './cognito/loginHandleNewPassword'
import { makeCognitoPoolAndClient } from './cognito/cf/makeCognitoPoolAndClient'

// Cloudformation
import { deployStack } from './cloudformation/deployStack'
import { getDeployStatus } from './cloudformation/getDeployStatus'
import { getCloudFormationOutputs } from './cloudformation/getOutputs'
import { getRemoveStatus } from './cloudformation/getRemoveStatus'
import { removeStack } from './cloudformation/removeStack'

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
        cf: {
            makeDb
        },
        get: getDbItem,
        list: listDbItems,
        set: setDbItem,
        remove: removeDbItem
    },
    cognito: {
        cf: {
            makeCognitoPoolAndClient
        },
        createUser,
        removeUser,
        resetPassword,
        validateToken,
        loginUser,
        loginHandleNewPassword
    },
    cloudformation: {
        deployStack,
        getDeployStatus,
        getCloudFormationOutputs,
        removeStack,
        getRemoveStatus
    }
}
