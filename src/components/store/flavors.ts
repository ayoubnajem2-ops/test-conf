import { useSyncExternalStore } from "react"

// ✏️ Demo flavors — replace names / photos with your real range.
export const FLAVORS = [
  { id: "orange", name: "برتقال", img: "/assets/oranges.webp", bg: "hsl(33 100% 76%)" },
  { id: "lemon", name: "ليمون", img: "/assets/flavor-lemon.webp", bg: "hsl(55 95% 74%)" },
  { id: "strawberry", name: "فراولة", img: "/assets/flavor-strawberry.webp", bg: "hsl(350 90% 82%)" },
  { id: "watermelon", name: "بطيخ", img: "/assets/flavor-watermelon.webp", bg: "hsl(125 50% 74%)" },
  { id: "blueberry", name: "توت أزرق", img: "/assets/flavor-blueberry.webp", bg: "hsl(228 80% 83%)" },
]

let current = "orange"
const subs = new Set<() => void>()
export const selectFlavor = (id: string) => { current = id; subs.forEach((f) => f()) }
export const useFlavorId = () =>
  useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb) } }, () => current)
export const useFlavor = () => {
  const id = useFlavorId()
  return FLAVORS.find((f) => f.id === id) ?? FLAVORS[0]
}
