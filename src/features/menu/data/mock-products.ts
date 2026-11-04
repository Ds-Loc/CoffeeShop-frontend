import { mapMockProductsToUi } from './mapper'
import { HERO_IMAGE_URL } from './mock-domain'

/** UI projection của mock domain; có thể thay bằng mapper response từ API sau này. */
export const MOCK_PRODUCTS = mapMockProductsToUi()

export { HERO_IMAGE_URL }
