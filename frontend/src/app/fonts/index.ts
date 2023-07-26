/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import localFont from 'next/font/local'
import { Urbanist } from 'next/font/google'

export const sfPro = localFont({
  src: './Urbanist-Regular.otf',
  variable: '--font-sf',
})

export const urbanist = Urbanist({
  variable: '--font-inter',
  subsets: ['latin'],
})
