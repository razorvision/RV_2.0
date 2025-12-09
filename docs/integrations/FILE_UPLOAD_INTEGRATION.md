# File Upload Integration Guide

Guide for integrating file uploads with UploadThing, Cloudinary, or S3.

## Provider Comparison

| Provider | Best For | Free Tier | Pricing |
|----------|----------|-----------|---------|
| **UploadThing** | Next.js apps | 2GB | $10/mo for 100GB |
| **Cloudinary** | Image processing | 25GB/mo | Pay per usage |
| **AWS S3** | Scale & control | 5GB/12mo | $0.023/GB |
| **Supabase Storage** | Supabase users | 1GB | Part of plan |

## UploadThing Integration

### Installation

```bash
npm install uploadthing @uploadthing/react
```

### Environment Variables

```env
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

### Server Setup

```typescript
// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  // Define upload routes
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('File URL:', file.url)
      return { url: file.url }
    }),

  documentUploader: f({
    pdf: { maxFileSize: '16MB' },
    'application/msword': { maxFileSize: '16MB' },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save to database
      await prisma.document.create({
        data: {
          userId: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
        },
      })
      return { url: file.url }
    }),

  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user) throw new Error('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      })
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

### Route Handler

```typescript
// app/api/uploadthing/route.ts
import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
```

### Client Components

```tsx
// components/ImageUpload.tsx
'use client'

import { UploadButton, UploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

export function ImageUpload({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void
}) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].url)
        }
      }}
      onUploadError={(error: Error) => {
        console.error('Upload error:', error.message)
      }}
    />
  )
}

export function ImageDropzone({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void
}) {
  return (
    <UploadDropzone<OurFileRouter>
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].url)
        }
      }}
      onUploadError={(error: Error) => {
        console.error('Upload error:', error.message)
      }}
    />
  )
}
```

### Custom Styled Upload

```tsx
// components/AvatarUpload.tsx
'use client'

import { useUploadThing } from '@uploadthing/react'
import { useState, useCallback } from 'react'
import Image from 'next/image'

export function AvatarUpload({ currentImage }: { currentImage?: string }) {
  const [image, setImage] = useState(currentImage)
  const [uploading, setUploading] = useState(false)

  const { startUpload } = useUploadThing('avatarUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        setImage(res[0].url)
      }
      setUploading(false)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
      setUploading(false)
    },
  })

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setUploading(true)
        startUpload([file])
      }
    },
    [startUpload]
  )

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 rounded-full overflow-hidden">
        {image ? (
          <Image src={image} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>
      <label className="cursor-pointer">
        <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          {uploading ? 'Uploading...' : 'Change Avatar'}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  )
}
```

## AWS S3 Integration

### Installation

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Environment Variables

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=my-bucket
```

### S3 Client Setup

```typescript
// lib/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export async function getPresignedDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  })

  return s3Client.send(command)
}
```

### Presigned URL Upload API

```typescript
// app/api/upload/presigned/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPresignedUploadUrl } from '@/lib/s3'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filename, contentType } = await request.json()
  const key = `uploads/${session.user.id}/${nanoid()}-${filename}`

  const url = await getPresignedUploadUrl(key, contentType)

  return NextResponse.json({
    url,
    key,
    publicUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
  })
}
```

### Client Upload Component

```tsx
// components/S3Upload.tsx
'use client'

import { useState } from 'react'

export function S3Upload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Get presigned URL
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      const { url, publicUrl } = await res.json()

      // Upload directly to S3
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <input
      type="file"
      onChange={handleUpload}
      disabled={uploading}
    />
  )
}
```

## Cloudinary Integration

### Installation

```bash
npm install cloudinary
```

### Environment Variables

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Cloudinary Setup

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer, folder: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      .end(file)
  })
}

export function getImageUrl(publicId: string, options?: object) {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  })
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
```

### Upload API

```typescript
// app/api/upload/cloudinary/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await uploadImage(buffer, `users/${session.user.id}`)

  return NextResponse.json(result)
}
```

## Supabase Storage

```typescript
// lib/storage.ts
import { createClient } from '@/lib/supabase/client'

export async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient()
  return supabase.storage.from(bucket).remove([path])
}
```

## Image Optimization

### With Next.js Image

```tsx
import Image from 'next/image'

function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  )
}
```

### Image Loader for External Sources

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
}
```

## Validation & Security

### File Type Validation

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }

  return true
}
```

### Virus Scanning (Optional)

```typescript
// Integration with ClamAV or similar
import NodeClam from 'clamscan'

const clam = new NodeClam().init()

async function scanFile(buffer: Buffer) {
  const { isInfected, viruses } = await clam.scanBuffer(buffer)

  if (isInfected) {
    throw new Error(`Virus detected: ${viruses.join(', ')}`)
  }

  return true
}
```

## Related Documentation

- [UploadThing Documentation](https://docs.uploadthing.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Last Updated:** 2024-12-08
