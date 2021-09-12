import uploadFile from './upload_file'
import * as fs from 'fs'

// this test passes, but dont have infra setup for testing in pipeline
// or example s3 bucket or exmaple image to upload
test.skip('uploadFile works', async () => {
    const file = fs.readFileSync(process.cwd() + '/src/s3/_test/pic.jpg')

    const x = await uploadFile({
        file: file,
        bucket: 'my-test-bucket',
        key: '/pics/mypic.jpg'
    })

    expect(typeof x.etag).toBe('string')
})
