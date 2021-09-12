import getFile from './get_file'

// this test passes, but dont have infra setup for testing in pipeline
// or example s3 bucket or exmaple image to upload
test.skip('getFile works', async () => {
    const x = await getFile({
        bucket: 'my-test-bucket',
        key: '/pics/mypic.jpg'
    })

    expect(typeof x.body).toBe('object')
})
