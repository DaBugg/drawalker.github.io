import AppKit

let width = 1200
let height = 630
let image = NSImage(size: NSSize(width: width, height: height))

func color(_ hex: Int, alpha: CGFloat = 1) -> NSColor {
  NSColor(
    calibratedRed: CGFloat((hex >> 16) & 0xff) / 255,
    green: CGFloat((hex >> 8) & 0xff) / 255,
    blue: CGFloat(hex & 0xff) / 255,
    alpha: alpha
  )
}

func drawText(_ text: String, x: CGFloat, y: CGFloat, width: CGFloat, font: NSFont, textColor: NSColor, kern: CGFloat = 0) {
  let style = NSMutableParagraphStyle()
  style.lineBreakMode = .byClipping
  let attributes: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: textColor,
    .kern: kern,
    .paragraphStyle: style,
  ]
  text.draw(in: NSRect(x: x, y: y, width: width, height: font.pointSize * 1.35), withAttributes: attributes)
}

image.lockFocus()

color(0x070d18).setFill()
NSRect(x: 0, y: 0, width: width, height: height).fill()

color(0x273247).setStroke()
for y in [CGFloat(1), CGFloat(height - 1)] {
  let line = NSBezierPath()
  line.move(to: NSPoint(x: 0, y: y))
  line.line(to: NSPoint(x: CGFloat(width), y: y))
  line.stroke()
}

color(0x111b2e).setStroke()
for x in [CGFloat(790), CGFloat(994)] {
  let line = NSBezierPath()
  line.move(to: NSPoint(x: x, y: 0))
  line.line(to: NSPoint(x: x, y: CGFloat(height)))
  line.stroke()
}

let connector = NSBezierPath()
connector.move(to: NSPoint(x: 790, y: 456))
connector.line(to: NSPoint(x: 994, y: 456))
connector.line(to: NSPoint(x: 994, y: 174))
connector.lineWidth = 2
color(0x273247).setStroke()
connector.stroke()

for (point, fill) in [(NSPoint(x: 790, y: 456), 0x37c6d0), (NSPoint(x: 994, y: 174), 0xc9ae7a)] {
  color(fill).setFill()
  NSBezierPath(ovalIn: NSRect(x: point.x - 9, y: point.y - 9, width: 18, height: 18)).fill()
}

let mark = NSBezierPath(rect: NSRect(x: 76, y: 500, width: 58, height: 58))
mark.lineWidth = 2
color(0xc9ae7a).setStroke()
mark.stroke()

drawText("N·N", x: 88, y: 515, width: 40, font: NSFont(name: "Georgia", size: 20) ?? .systemFont(ofSize: 20), textColor: color(0xf5f2ea))
drawText("NETWORKS & NODES", x: 158, y: 515, width: 430, font: .boldSystemFont(ofSize: 17), textColor: color(0xf5f2ea), kern: 3)

let serif = NSFont(name: "Georgia", size: 74) ?? .systemFont(ofSize: 74)
let italic = NSFont(name: "Georgia-Italic", size: 74) ?? .systemFont(ofSize: 74)
drawText("Building digital systems", x: 76, y: 330, width: 1000, font: serif, textColor: color(0xf5f2ea), kern: -2)
drawText("that work.", x: 76, y: 246, width: 740, font: italic, textColor: color(0xc9ae7a), kern: -2)
drawText("WEBSITES · CUSTOM SOFTWARE · AUTOMATION · CONNECTED WORKFLOWS", x: 76, y: 129, width: 1050, font: .systemFont(ofSize: 22), textColor: color(0xa9b2c3), kern: 1)

color(0x37c6d0).setFill()
NSRect(x: 76, y: 83, width: 146, height: 3).fill()
color(0xc9ae7a).setFill()
NSRect(x: 222, y: 83, width: 86, height: 3).fill()

image.unlockFocus()

guard
  let tiff = image.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: tiff),
  let png = bitmap.representation(using: .png, properties: [:])
else {
  fatalError("Unable to render social card")
}

try png.write(to: URL(fileURLWithPath: "images/social-card.png"))
