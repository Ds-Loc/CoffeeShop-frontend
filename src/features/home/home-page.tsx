import { MenuSection } from '@/features/menu/components/menu-section'
import { Benefits } from './components/benefits'
import { Hero } from './components/hero'

export function HomePage() {
  return (
    <main>
      <Hero />
      <MenuSection />
      <Benefits />
    </main>
  )
}
