import MEZ105_Skin_CS_0016_0000 from './MEZ105_Skin_CS_0016_0000.jpg'
import MEZ105_Skin_CS_Wrinkle_0016_0000 from './MEZ105_Skin_CS_Wrinkle_0016_0000.jpg'

interface ImageAsset {
    url: string,
    aspectRatio: [number, number]
}
const imageAssets = {
    MEZ105_Skin_CS_Wrinkle_0016_0000: {
        url: MEZ105_Skin_CS_Wrinkle_0016_0000,
        aspectRatio: [1280, 720]
    },
    MEZ105_Skin_CS_0016_0000: {
        url: MEZ105_Skin_CS_0016_0000,
        aspectRatio: [1280, 720]

    }
} satisfies Record<string, ImageAsset>


export { imageAssets }
export type { ImageAsset }


