figma.showUI(__html__, { width: 460, height: 640 })

function getTextFromNode(node: any) {
  try {
    if (node.type === 'TEXT' && node.characters) return node.characters
    return ''
  } catch {
    return ''
  }
}

function basicHeuristicAudit(frame: SceneNode) {
  const id = frame.id
  const name = frame.name
  const layers = (frame as any).findAll ? (frame as any).findAll(() => true) : []
  const texts: string[] = []
  const buttons: SceneNode[] = []

  layers.forEach((n: any) => {
    if (n.type === 'TEXT') texts.push(n.characters)
    if (n.name.toLowerCase().includes('button')) buttons.push(n)
  })

  const hasFeedback = texts.some(t => /loading|success|created|processing/i.test(t))
  const hasCTA = buttons.length > 0 || texts.some(t => /create|submit|confirm/i.test(t))

  const heuristics: Record<string, string> = {}
  heuristics['Visibility of System Status'] = hasFeedback ? '✅ Present' : '⚠ Missing feedback'
  heuristics['Primary CTA'] = hasCTA ? '✅ Clear CTA' : '⚠ Unclear CTA'
  heuristics['Title Clarity'] = /create|new|add/i.test(name) ? '✅ Action-first' : '⚠ Check title intent'

  let score = 2.5
  if (hasFeedback) score += 1
  if (hasCTA) score += 1
  if (/create|new|add/i.test(name)) score += 0.5
  if (score > 5) score = 5

  return { id, name, heuristics, score }
}

figma.ui.onmessage = msg => {
  if (msg.type === 'run-audit') {
    const selection = figma.currentPage.selection
    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'no-selection' })
      return
    }
    const results = selection.map(s => basicHeuristicAudit(s))
    figma.ui.postMessage({ type: 'audit-results', data: results })
  }
}
