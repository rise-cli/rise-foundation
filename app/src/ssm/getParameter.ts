import aws from 'aws-sdk'
const region = process.env.AWS_REGION || 'us-east-1'
const ssm = new aws.SSM({
    region: region
})

export async function getParameter(props: { key: string }) {
    const res = await ssm
        .getParameter({
            Name: props.key
        })
        .promise()

    return res.Parameter?.Value
}
