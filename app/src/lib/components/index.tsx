/*React Component whose props can be serialised / deserialised*/
import { ComponentProps, ReactNode } from 'react'
import { AspectRatioContainer } from './aspect-ratio-container/AspectRatioContainer'
import { ComparisonSlider } from './comparison-slider/ComparisonSlider'
import { CrossFadeImage } from './crossfade-image/CrossfadeImage'
import { Frame } from './frame/Frame'
import { ResizeContainer } from './resize-container/ResizeContainer'
import { RichText, RichTextProps } from './rich-text/RichText'

type Type<T> = { type: T }
interface NodeBase {
    id: string;
    description?: string,
}
type Props<P> = { props: P }

type Serdable<T, P> = Type<T> & NodeBase & Props<P>

type Renderable =
    | Serdable<'AspectRatioContainer', ComponentProps<typeof AspectRatioContainer>>
    | Serdable<'Frame', ComponentProps<typeof Frame>>
    | Serdable<'ResizeContainer', ComponentProps<typeof ResizeContainer>>
    | Serdable<'CrossFadeImage', ComponentProps<typeof CrossFadeImage>>
    | Serdable<'ComparisonSlider', ComponentProps<typeof ComparisonSlider>>
    | Serdable<'RichText', RichTextProps>


const render = ({ type, props, id }: Renderable): ReactNode => {
    switch (type) {
        case 'AspectRatioContainer':
            return (<AspectRatioContainer key={id} {...props} />)
        case 'Frame':
            return (<Frame key={id} {...props} />)
        case 'ResizeContainer':
            return (<ResizeContainer key={id} {...props} />)
        case 'ComparisonSlider':
            return (<ComparisonSlider key={id} {...props} />)
        case 'RichText':
            return (<RichText key={id} id={id} block={props.block} />)
        default:
            null
    }
};


export { AspectRatioContainer, Frame, ResizeContainer, render }
export type { NodeBase, Props, Renderable, Serdable }





