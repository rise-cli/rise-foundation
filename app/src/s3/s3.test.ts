import getFile from './get_file'
import uploadFile from './upload_file'
import removeFile from './remove_file'
import * as fs from 'fs'
import makeBucket from './cf/bucket'
import makeSimpleBucket from './cf/makeSimpleBucket'
import { deployStack } from '../cloudformation/deployStack'
import aws from 'aws-sdk'

const STACK_NAME = 'RiseFoundationTestS3'
const SECOND = 1000
jest.setTimeout(SECOND * 60)

const cloudformation = new aws.CloudFormation({
    region: 'us-east-1'
})

async function getOutputs(props: { stack: string; outputs: string[] }) {
    function getOutput(outputs: any[], value: string) {
        const v = outputs.find((x) => x.OutputKey === value)
        return v ? v.OutputValue : false
    }

    const params = {
        StackName: props.stack
    }

    const x: any = await cloudformation.describeStacks(params).promise()
    const details = x.Stacks[0]
    const outputs = details.Outputs

    let res: any = {}
    for (const o of props.outputs) {
        res[o] = getOutput(outputs, o)
    }
    return res
}

test('cf.makeBucket CloudFormation is valid', async () => {
    const x = makeBucket('mytestbucket')
    const xs = makeSimpleBucket('mysimpletestbucket')
    const template = {
        Resources: {
            ...x.Resources,
            ...xs.Resources
        },
        Outputs: {
            ...x.Outputs,
            ...xs.Outputs
        }
    }

    const res = await deployStack({
        name: STACK_NAME,
        template: JSON.stringify(template)
    })

    expect(res.status).toBe('nothing')
})

test('s3 functions can upload, get, and remove a file in a bucket', async () => {
    const { MysimpletestbucketBucket } = await getOutputs({
        stack: STACK_NAME,
        outputs: ['MysimpletestbucketBucket']
    })

    const BucketName = MysimpletestbucketBucket

    /**
     * Upload File
     */
    const file = fs.readFileSync(process.cwd() + '/src/s3/_test/test_s3_img.zip')

    const x = await uploadFile({
        file: file,
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    expect(typeof x.etag).toBe('string')

    /**
     * Get File
     */
    const getResult = await getFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })

    expect(typeof getResult.body).toBe('object')

    /**
     * Remove File
     *
     */
    const removeResult = await removeFile({
        bucket: BucketName,
        key: '/pics/mypic.zip'
    })
    expect(removeResult).toEqual(true)
})
