// 암호화 유틸
import crypto from 'crypto'

const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY!, 'base64')

export function encryptText(value: string | null | undefined) {
  if (!value) return null

  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])

  const tag = cipher.getAuthTag()

  return JSON.stringify({
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  })
}

export function decryptText(value: string | null | undefined) {
  if (!value) return null

  try {
    const payload = JSON.parse(value)
    if (typeof payload !== 'object' || payload === null || !payload.iv || !payload.tag || !payload.data) {
      return value
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(payload.iv, 'base64')
    )

    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'))

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(payload.data, 'base64')),
      decipher.final(),
    ])

    return decrypted.toString('utf8')
  } catch (error) {
    // JSON 파싱 에러(평문) 또는 복호화 실패 시 원본 반환
    return value
  }
}