import { type ReactNode } from 'react'

export interface GalleryItem { src: string; alt: string; caption?: ReactNode }

// Platform gallery primitive v2: THE COMPONENT owns the packing. Tiles lie
// on a 4-column grid with a fixed row height, and the layout pattern is
// computed from the NUMBER of items — every chunk fills complete rows, so a
// hole is impossible by construction. Pass items in display order (the
// first item of each chunk becomes the feature tile); style via className
// and tokens. Do not add span/height classes and do not rewrite pack().
type Cell = { c: 1 | 2 | 4; r: 1 | 2 }
function pack(n: number, flip: boolean): Cell[] {
  if (n <= 0) return []
  if (n === 1) return [{ c: 4, r: 2 }]
  if (n === 2) return [{ c: 2, r: 2 }, { c: 2, r: 2 }]
  if (n === 3) return flip
    ? [{ c: 2, r: 1 }, { c: 2, r: 2 }, { c: 2, r: 1 }]
    : [{ c: 2, r: 2 }, { c: 2, r: 1 }, { c: 2, r: 1 }]
  if (n === 4) return [{ c: 2, r: 2 }, { c: 1, r: 1 }, { c: 1, r: 1 }, { c: 2, r: 1 }]
  return [{ c: 2, r: 2 }, { c: 1, r: 1 }, { c: 1, r: 1 }, { c: 1, r: 1 }, { c: 1, r: 1 }]
}
function chunkSizes(total: number): number[] {
  const out: number[] = []
  let rem = total
  while (rem > 0) {
    let take: number
    if (rem >= 8) take = 5
    else if (rem === 7) take = 4
    else if (rem === 6) take = 3
    else take = rem
    out.push(take)
    rem -= take
  }
  return out
}
export function PhotoGrid({ items, className = '' }: { items: GalleryItem[]; className?: string }) {
  const cells: Cell[] = []
  chunkSizes(items.length).forEach((size, ci) => { cells.push(...pack(size, ci % 2 === 1)) })
  const cls = (cell: Cell) => (cell.c === 4 ? 'col-span-2 md:col-span-4' : cell.c === 2 ? 'col-span-2' : 'col-span-1') + (cell.r === 2 ? ' row-span-2' : '')
  return (
    <div className={'grid grid-cols-2 md:grid-cols-4 auto-rows-[170px] md:auto-rows-[210px] gap-3 md:gap-4 ' + className}>
      {items.map((it, i) => (
        <figure key={i} className={'relative overflow-hidden rounded-[var(--radius)] group ' + cls(cells[i] || { c: 1, r: 1 })}>
          <img src={it.src} alt={it.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {it.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10 text-sm text-white">{it.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
