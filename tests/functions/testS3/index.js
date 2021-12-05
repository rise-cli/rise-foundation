const foundation = require('/opt/node_modules/rise-foundation')
const fs = require('fs')

module.exports.handler = async (event, context) => {
    const bucketName = 'risefoundationinttestsstack-testbucket-h2mboks2jo51'
    try {
        const file = fs.readFileSync('./test_s3_img.zip')

        const x = await foundation.default.s3.uploadFile({
            file: file,
            bucket: bucketName,
            key: '/pics/mypic.zip'
        })

        if (typeof x.etag !== 'string') {
            throw new Error('upload file did not work')
        }

        /**
         * Get File
         */
        const getResult = await foundation.default.s3.getFile({
            bucket: bucketName,
            key: '/pics/mypic.zip'
        })

        if (typeof getResult.body !== 'object') {
            throw new Error('getResult did not work')
        }

        /**
         * Remove File
         *
         */
        const removeResult = await foundation.default.s3.removeFile({
            bucket: bucketName,
            key: '/pics/mypic.zip'
        })

        if (removeResult !== true) {
            throw new Error('removeResult did not work')
        }

        await foundation.default.codestar.putJobSuccess({
            event,
            context
        })

        return 2
    } catch (e) {
        console.log(e.message)
        await foundation.default.codestar.putJobFailure({
            event,
            context,
            message: e.message
        })
    }
}
