import aws from 'aws-sdk'
const region = process.env.AWS_REGION || 'us-east-1'
const ssm = new aws.SSM({
    region: region
})

export async function removeParameter(props: { key: string }) {
    await ssm
        .deleteParameter({
            Name: props.key
        })
        .promise()

    return true
}
