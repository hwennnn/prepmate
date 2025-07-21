// 
// @Credits: https://github.com/elegaanz/vercanard
// Modified from original template
//
// GPL-3.0 License
//
// Copyright (c) 2025 Ana Gelez
//

#let entry(title, date, role, location, body) = [
  #v(0.1cm)
  #stack(
    dir: ltr,
    heading(level: 2, title),
    align(right, block(inset: (right: 0.5em), text(fill: gray, date))), // date on same line
  )
  #stack(
    dir: ltr,
    block(inset: (right: 2em), text(fill: black, emph(role))),
    align(right, block(inset: (right: 0.5em), text(fill: gray, location))), // date on same line
  )
  #block(inset: (right: 2em), body)
  #v(0.4cm) // Add vertical spacing after each entry
]

#let resume(name: "", title: "", accent-color: rgb("db9df8"), margin: 100pt, aside: [], body) = {
  set page(paper: "a4", margin: 0pt, background: place(top + right, rect(fill: accent-color.lighten(80%), width: 33.33333%, height: 100%)))
  set text(font: "Inria Sans", size: 12pt)
  set block(above: 0pt, below: 0pt)
  set par(justify: true)
  {
    show heading.where(level: 1): set text(size: 40pt)
    show heading.where(level: 2): set text(size: 18pt)
    box(
      fill: accent-color,
      width: 100%,
      outset: 0pt,
      inset: (rest: margin, bottom: 0.4 * margin),
      stack(
        spacing: 10pt,
        heading(level: 1, upper(name)), heading(level: 2, upper(title)))
    )
  }

  show heading: set text(fill: accent-color)

  grid(
    columns: (2fr, 1fr),
    block(outset: 0pt, inset: (top: 0.4 * margin, right: 0pt, rest: margin), stroke: none, width: 100%, {
        set block(above: 10pt)
        show heading.where(level: 1): it => context {
          let h = text(size: 18pt, upper(it))
          let dim = measure(h)
          stack(
            dir: ltr,
            h,
            place(
              dy: 7pt,
              dx: 10pt,
              horizon + left,
              line(stroke: accent-color, length: 100% - dim.width - 10pt)
            ),
          )
        }
        body
    }),
    block(inset: (bottom: margin, rest: 0.4 * margin), width: 100%, {
      show heading: it => align(right, upper(it))
      set list(marker: "")
      show list: it => {
        set par(justify: false, linebreaks: "optimized")
        set text(size: 11pt)
        align(right, it)
      }
      aside
    }),
  )
}

#let tagStyle(str) = {text(
  size: 11pt,
  weight: "regular",
  str
)}

#let tagListStyle(tags) = {
  v(0.3cm)
  align(right, {
    for (i,tag) in tags.enumerate() {
      if i > 0 { h(5pt) }
      box(
        inset: (x: 0.4em, y: 0.4em),
        fill: silver, 
        radius: 3pt,
        tagStyle(tag),
      )
    }
  })
}