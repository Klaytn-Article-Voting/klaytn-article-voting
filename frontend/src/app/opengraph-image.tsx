/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/server'

export const runtime = 'edge'
export const alt = 'Precedent - Building blocks for your Next.js project'
export const contentType = 'image/png'

export default async function OG() {
  const sfPro = await fetch(new URL('./fonts/Urbanist-Regular.otf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  )

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          backgroundImage:
            'linear-gradient(to bottom right, #E0E7FF 25%, #ffffff 50%, #CFFAFE 75%)',
        }}
      >
        <img
          src={new URL('../../public/logo.png', import.meta.url).toString()}
          alt="Logo"
          tw="w-20 h-20 mb-4 opacity-95"
        />
        <h1
          style={{
            fontSize: '100px',
            fontFamily: 'Urbanist',
            background: 'linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: '5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Artist
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Urbanist',
          data: sfPro,
        },
      ],
    },
  )
}
