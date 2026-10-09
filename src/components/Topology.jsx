const nodes = [
  ['ROUTING', 98, 105], ['SWITCHING', 98, 275],
  ['FIREWALL', 255, 190], ['VPN', 412, 105],
  ['CLOUD', 412, 275], ['SECURITY', 255, 360],
]
const edges = [[0, 2], [1, 2], [2, 3], [2, 4], [2, 5], [0, 1], [3, 4]]

export default function Topology() {
  return <figure className="topology">
    <figcaption><span>Network topology</span><span className="topology-caption">Lab domains</span></figcaption>
    <svg viewBox="0 0 510 435" role="img" aria-label="Illustrative connections between routing, switching, firewall, VPN, cloud, and security lab domains">
      <defs><pattern id="map-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth=".5" /></pattern></defs>
      <rect width="510" height="435" fill="url(#map-grid)" className="topology-grid" />
      <circle cx="255" cy="190" r="144" className="topology-orbit" />
      {edges.map(([a, b], i) => <g key={i}>
        <path d={`M${nodes[a][1]},${nodes[a][2]} L${nodes[b][1]},${nodes[b][2]}`} className="topology-edge" />
        <circle r="3" className="packet" style={{ offsetPath: `path('M${nodes[a][1]},${nodes[a][2]} L${nodes[b][1]},${nodes[b][2]}')`, animationDelay: `${i * -.7}s` }} />
      </g>)}
      {nodes.map(([label, x, y]) => <g key={label} className="topology-node">
        <rect x={x - 23} y={y - 20} width="46" height="40" rx="5" />
        <path d={`M${x-12} ${y-5}h24 M${x-12} ${y+5}h24 M${x-8} ${y-8}v6 M${x+8} ${y+2}v6`} />
        <text x={x} y={y + 42} textAnchor="middle">{label}</text>
      </g>)}
    </svg>
    <div className="topology-footer"><span>SEC · NET · CLOUD</span><a href="#work">Explore lab documentation ↗</a></div>
  </figure>
}
