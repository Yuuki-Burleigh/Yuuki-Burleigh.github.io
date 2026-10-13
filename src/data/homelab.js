// The home-lab hero: one generated plate (public/media/homelab/plate-*.webp, 3840x2160, gpt_image_2_5,
// prompt in Media/higgsfield/2026-10-12-portfolio-v3-plate/final.prompt.txt; a duplicate mug handle was inpainted out
// locally with OpenCV, final-mugfix.png) and the stops drawn over it.
// Coordinates are percentages of the plate (x of its width, y of its height), measured on the final render.
// To add a lab: add it to labs.js, then put its exact title in the `labs` list of the device it was built on.

export const plate = {
  width: 3840,
  height: 2160,
  sources: [
    { src: 'media/homelab/plate-960.webp', w: 960 },
    { src: 'media/homelab/plate-1920.webp', w: 1920 },
    { src: 'media/homelab/plate-3840.webp', w: 3840 },
  ],
  alt: 'Illustrated home lab: a desk with a monitor showing a cloud console and a local AI server, and a small rack holding a firewall, a switch and a router.',
}

// `hint` is a second line on the plate label, for stops whose device is easy to miss in the illustration.
// `path` is the cable the packet travels to reach this stop from the previous one, as plate points.
// `hop: true` means no cable is visible for that leg (the packet leaves the house or crosses the internet):
// the pulse fades out at the previous stop and in at this one instead of drawing a line nobody can see.
export const stops = [
  {
    id: 'switch',
    name: 'Switch',
    anchor: { x: 70.3, y: 48.9 },
    path: [],
    labs: [
      'Layer 2 Attacks and Mitigations',
      'WPA2 & WPA2-Enterprise WLAN with a RADIUS Server',
    ],
  },
  {
    id: 'router',
    name: 'Router',
    anchor: { x: 71.6, y: 60.0 },
    path: [
      { x: 74.1, y: 53.1 },
      { x: 73.6, y: 57.8 },
      { x: 72.5, y: 59.4 },
      { x: 71.6, y: 60.0 },
    ],
    labs: ['Designing a Multi-Area OSPF Network', 'Designing a Multiprotocol Network with BGP'],
  },
  {
    id: 'firewall',
    name: 'Firewall',
    anchor: { x: 74.1, y: 32.2 },
    path: [
      { x: 72.5, y: 59.4 },
      { x: 73.6, y: 57.8 },
      { x: 74.1, y: 53.1 },
      { x: 76.6, y: 50.2 },
      { x: 75.0, y: 48.9 },
      { x: 73.8, y: 46.7 },
      { x: 72.8, y: 42.2 },
      { x: 73.1, y: 38.3 },
      { x: 73.8, y: 35.6 },
      { x: 74.1, y: 32.2 },
    ],
    labs: [
      'FortiGate-40F Factory Reset & Initial SOHO Configuration',
      'PA-220 Firewall for a SOHO Environment',
      'PA-220 Web Filtering for an Elementary School',
    ],
  },
  {
    id: 'vpn',
    name: 'VPN uplink',
    // the wall box sits at the plate's top edge, outside the camera at wide desktops: label it on the conduit below
    label: { x: 74.5, y: 15.5 },
    anchor: { x: 74.5, y: 5.6 },
    path: [
      { x: 74.1, y: 32.2 },
      { x: 78.1, y: 29.1 },
      { x: 76.6, y: 26.1 },
      { x: 75.0, y: 21.7 },
      { x: 74.7, y: 16.7 },
      { x: 74.5, y: 5.6 },
    ],
    labs: [
      'Configuring GlobalProtect RAVPN on a PA-220',
      'Configuring a Remote Access IPsec VPN on a FortiGate 40F',
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    hint: 'AWS console',
    anchor: { x: 36.3, y: 22.8 },
    hop: true,
    path: [],
    labs: [
      'AWS Cloud Foundations: EBS, RDS, Load Balancing & Autoscaling',
      'AWS Cloud Foundations: IAM, VPC & EC2',
    ],
  },
  {
    id: 'ai',
    name: 'Local AI',
    hint: 'GPU server',
    anchor: { x: 54.7, y: 22.8 },
    hop: true,
    path: [],
    labs: ['Local AI with Web UI Integration'],
  },
]
