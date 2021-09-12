import removeFile from './remove_file'

// this test passes, but dont have infra setup for testing in pipeline
// or example s3 bucket or exmaple image to upload
test.skip('removeFile works', async () => {
    const x = await removeFile({
        bucket: 'my-test-bucket',
        key: '/pics/mypic.jpg'
    })
    expect(x).toBeTruthy()
})
