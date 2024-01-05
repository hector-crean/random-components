/*React Component whose props can be serialised / deserialised*/
import { AspectRatioContainer } from './aspect-ratio-container/AspectRatioContainer'
import { Frame } from './frame/Frame'
import { ResizeContainer } from './resize-container/ResizeContainer'

import { ComponentProps } from 'react'

type Serdable<T, P> = { type: T, description?: string, props: P }

type SerDeComponent = Serdable<'AspectRatioContainer', ComponentProps<typeof AspectRatioContainer>> | Serdable<'Frame', ComponentProps<typeof Frame>> | Serdable<'ResizeContainer', ComponentProps<typeof ResizeContainer>>

export type { Serdable, SerDeComponent }
export { AspectRatioContainer, Frame, ResizeContainer }

