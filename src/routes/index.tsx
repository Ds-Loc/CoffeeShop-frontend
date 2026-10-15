import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div>
      <h1>Dự án môn học - Frontend</h1>
      <p>React 19 + Vite + TanStack Router & Query</p>
    </div>
  )
}