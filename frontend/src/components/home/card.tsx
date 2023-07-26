/* eslint-disable @next/next/no-img-element */
/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import { ReactNode } from 'react'

export default function Card({
  name,
  avatar,
  description,
  demo,
  actions,
}: {
  name: ReactNode | string
  description: any
  avatar: string
  demo: any
  actions: ReactNode | any
}) {
  return (
    <div
      className={
        'relative col-span-1 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-md'
      }
    >
      <div className={'flex flex-1 flex-col md:flex-row overflow-hidden'}>
        <div className="w-full md:w-[200px] h-[200px] md:h-full flex">
          <div
            className="h-full w-full md:w-md flex-none overflow-hidden rounded-t bg-cover text-center lg:h-auto lg:rounded-l lg:rounded-t-none"
            style={{ backgroundImage: `url(${avatar})`, backgroundPosition: 'center' }}
          ></div>
        </div>
        <div className="m-5 flex flex-col flex-1">
          <p className="flex items-center text-sm text-gray-600">{demo}</p>
          <div className="mb-2 text-xl font-bold text-gray-900">{name}</div>
          <p className="mb-8 text-base text-gray-700">{description}</p>
          <div className="flex-1"></div>
          <div className="flex items-center">{actions}</div>
        </div>
      </div>
    </div>
  )
}
