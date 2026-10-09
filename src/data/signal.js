import { labs } from './labs'

const chapters = [
  ['Switch', 'L2', 'Switches forward Ethernet frames between devices on a local network.', ['Layer 2 Attacks', 'WPA2 & WPA2-Enterprise']],
  ['Router', 'L3', 'Routers forward packets between networks using routing tables.', ['Designing a Multi-Area OSPF', 'Designing a Multiprotocol Network with BGP']],
  ['Firewall', 'L4–7', 'Firewalls inspect traffic and enforce rules between networks.', ['FortiGate-40F Factory Reset', 'PA-220 Firewall for a SOHO', 'PA-220 Web Filtering']],
  ['VPN tunnel', 'Tunnel', 'VPNs carry private network traffic through an encrypted tunnel.', ['Configuring GlobalProtect', 'Configuring a Remote Access IPsec VPN']],
  ['Cloud', 'Infrastructure', 'Cloud infrastructure connects compute, storage, and networking resources.', ['AWS Cloud Foundations: IAM', 'AWS Cloud Foundations: EBS', 'Local AI with Web UI']],
]

export const signalChapters = chapters.map(([device, layer, description, titles], i) => ({
  id: `ch${i + 1}`, device, layer, description,
  labs: titles.map(title => labs.find(lab => lab.title.startsWith(title))),
  poster: `media/signal/ch${i + 1}/poster.webp`,
}))
