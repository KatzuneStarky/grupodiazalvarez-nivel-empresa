export interface ChartSection {
  id: string
  title: string
  description: string
  icon: string
  href: string
  children?: ChartSection[]
}