import { 
  S3Client, 
  PutObjectCommand, 
  S3ServiceException,
  type S3ClientConfig
} from '@aws-sdk/client-s3'
import type { AwsCredentialIdentity } from '@aws-sdk/types'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { logger } from '@/lib/utils'

// Validate required environment variables
const requiredEnvVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET_NAME']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

const s3Config: S3ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  } as AwsCredentialIdentity
}

const s3Client = new S3Client(s3Config)

interface UploadFileParams {
  body: Buffer
  contentType: string
  key: string
}

interface UploadResult {
  success: boolean
  url: string
  key: string
}

class S3UploadError extends Error {
  constructor(message: string, public readonly key: string) {
    super(message)
    this.name = 'S3UploadError'
  }
}

class InvalidInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidInputError'
  }
}

/**
 * Uploads a file to S3
 * @param params - File upload parameters
 * @returns Promise with upload result
 * @throws {InvalidInputError} If input validation fails
 * @throws {S3UploadError} If S3 upload fails
 */
export async function uploadFile(params: UploadFileParams): Promise<UploadResult> {
  // Validate input
  if (!params.body || params.body.length === 0) {
    throw new InvalidInputError('File body cannot be empty')
  }
  if (!params.contentType) {
    throw new InvalidInputError('Content type is required')
  }
  if (!params.key) {
    throw new InvalidInputError('S3 key is required')
  }

  try {
    logger.info(`Starting S3 upload for key: ${params.key}`)
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType
    })

    await s3Client.send(command)
    logger.info(`Successfully uploaded file to S3: ${params.key}`)

    return {
      success: true,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.key}`,
      key: params.key
    }
  } catch (error) {
    const errorMessage = error instanceof S3ServiceException 
      ? `S3 service error: ${error.message}`
      : `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`

    logger.error(`S3 upload failed for key ${params.key}: ${errorMessage}`)
    throw new S3UploadError(errorMessage, params.key)
  }
}

/**
 * Generates a pre-signed URL for S3 upload
 * @param key - S3 object key
 * @param contentType - File content type
 * @returns Promise with pre-signed URL
 * @throws {InvalidInputError} If input validation fails
 * @throws {S3UploadError} If URL generation fails
 */
export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  if (!key) {
    throw new InvalidInputError('S3 key is required')
  }
  if (!contentType) {
    throw new InvalidInputError('Content type is required')
  }

  try {
    logger.info(`Generating pre-signed URL for key: ${key}`)
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    logger.info(`Successfully generated pre-signed URL for key: ${key}`)
    
    return url
  } catch (error) {
    const errorMessage = error instanceof S3ServiceException
      ? `S3 service error: ${error.message}`
      : `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`

    logger.error(`Failed to generate pre-signed URL for key ${key}: ${errorMessage}`)
    throw new S3UploadError(errorMessage, key)
  }
}
