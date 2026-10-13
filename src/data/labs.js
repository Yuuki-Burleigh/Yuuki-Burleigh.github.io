// Lab documentation. `file` is relative to site root (served from public/labs/).
// To add a lab: drop the PDF in public/labs/ and add an object here. Its `thumb` is page 1 at 480px:
//   pdftoppm -f 1 -l 1 -scale-to 480 -png public/labs/<file>.pdf /tmp/t && magick /tmp/t-1.png -quality 78 public/labs/thumbs/<slug>.webp
export const labs = [
  {
    title: 'Designing a Multi-Area OSPF Network',
    desc: 'Building a Multi-Area OSPF network: commands, explanations, final router configurations, and proof of functionality, plus background on the topic and the lab’s purpose.',
    tag: 'Networking',
    file: 'labs/Designing a Multi-Area OSPF Network.pdf',
    thumb: 'labs/thumbs/designing-a-multi-area-ospf-network.webp',
  },
  {
    title: 'Designing a Multiprotocol Network with BGP',
    desc: 'A BGP / OSPF / EIGRP / IS-IS multiprotocol network: commands, explanations, final router/switch configurations, and proof of functionality, with topic background and lab purpose.',
    tag: 'Networking',
    file: 'labs/Designing a Multiprotocol Network with BGP.pdf',
    thumb: 'labs/thumbs/designing-a-multiprotocol-network-with-bgp.webp',
  },
  {
    title: 'Layer 2 Attacks and Mitigations',
    desc: 'Attacking and then hardening a network against Layer 2 attacks using Kali Linux: commands, screenshots, explanations, final switch configurations, and proof of functionality.',
    tag: 'Security',
    file: 'labs/Layer 2 Attacks and Mitigations.pdf',
    thumb: 'labs/thumbs/layer-2-attacks-and-mitigations.webp',
  },
  {
    title: 'FortiGate-40F Factory Reset & Initial SOHO Configuration',
    desc: 'Factory-resetting a FortiGate-40F firewall and configuring baseline security measures: screenshots, explanations, and proof of functionality, with background and purpose.',
    tag: 'Firewall',
    file: 'labs/FortiGate-40F Factory Reset and Inital Configuration.pdf',
    thumb: 'labs/thumbs/fortigate-40f-factory-reset-and-inital-configuration.webp',
  },
  {
    title: 'PA-220 Firewall for a SOHO Environment',
    desc: 'Setting up a Palo Alto PA-220 for secure internet access in a SOHO environment: screenshots, explanations, final firewall configuration, and proof of functionality.',
    tag: 'Firewall',
    file: 'labs/Palo Alto 220 Small Office Home Office Firewall Configuration.pdf',
    thumb: 'labs/thumbs/palo-alto-220-small-office-home-office-firewall-configuration.webp',
  },
  {
    title: 'Configuring GlobalProtect RAVPN on a PA-220',
    desc: 'Configuring a PA-220 as a GlobalProtect VPN server so remote users can reach internal resources securely: screenshots, explanations, and proof of functionality.',
    tag: 'Firewall',
    file: 'labs/Configuring GlobalProtect Remote Access VPN on a PA220 Firewall.pdf',
    thumb: 'labs/thumbs/configuring-globalprotect-remote-access-vpn-on-a-pa220-firewall.webp',
  },
  {
    title: 'PA-220 Web Filtering for an Elementary School',
    desc: 'Configuring URL/web filtering on a PA-220 firewall for a school environment: screenshots, explanations, and proof of functionality, with topic background and purpose.',
    tag: 'Firewall',
    file: 'labs/Setting up PA220 Web Filtering for an Elementary School Environment.pdf',
    thumb: 'labs/thumbs/setting-up-pa220-web-filtering-for-an-elementary-school-environment.webp',
  },
  {
    title: 'Local AI with Web UI Integration',
    desc: 'Standing up a self-hosted local AI with a web UI reachable across the LAN: screenshots, commands, explanations, sample prompts, and proof of functionality.',
    tag: 'AI / Infrastructure',
    file: 'labs/Setting up Local AI with Web UI Integration.pdf',
    thumb: 'labs/thumbs/setting-up-local-ai-with-web-ui-integration.webp',
  },
  {
    title: 'AWS Cloud Foundations: IAM, VPC & EC2',
    desc: 'AWS Academy Cloud Foundations labs on Identity and Access Management (IAM), Virtual Private Cloud (VPC), and Elastic Compute Cloud (EC2): screenshots, explanations, and proof of completion, with background for each topic.',
    tag: 'Cloud / AWS',
    file: 'labs/AWS Academy Cloud Foundations – Configuring Identity and Access Management, Virtual Private Cloud, and Elastic Compute Cloud.pdf',
    thumb: 'labs/thumbs/aws-academy-cloud-foundations-configuring-identity-and-access-management-virtual-private-cloud-and-elastic-compute-cloud.webp',
  },
  {
    title: 'AWS Cloud Foundations: EBS, RDS, Load Balancing & Autoscaling',
    desc: 'AWS Academy Cloud Foundations labs on Elastic Block Store (EBS), Relational Database Service (RDS), Elastic Load Balancing, and Autoscaling: screenshots, explanations, and proof of completion, with background for each topic.',
    tag: 'Cloud / AWS',
    file: 'labs/AWS Academy Cloud Foundations – Configuring Elastic Block Storage, Relational Databases, Load Balancing, and Autoscaling.pdf',
    thumb: 'labs/thumbs/aws-academy-cloud-foundations-configuring-elastic-block-storage-relational-databases-load-balancing-and-autoscaling.webp',
  },
  {
    title: 'WPA2 & WPA2-Enterprise WLAN with a RADIUS Server',
    desc: 'Configuring a WPA2-Personal and WPA2-Enterprise wireless LAN backed by a RADIUS server for 802.1X authentication: screenshots, explanations, configurations, and proof of functionality, with topic background and lab purpose.',
    tag: 'Wireless',
    file: 'labs/Configuring a WPA2 and WPA2 Enterprise Wireless Local Area Network with a RADIUS Server.pdf',
    thumb: 'labs/thumbs/configuring-a-wpa2-and-wpa2-enterprise-wireless-local-area-network-with-a-radius-server.webp',
  },
  {
    title: 'Configuring a Remote Access IPsec VPN on a FortiGate 40F',
    desc: 'Configuring a FortiGate 40F firewall as an IPsec VPN gateway so remote users can securely reach internal resources: screenshots, explanations, final firewall configuration, and proof of functionality.',
    tag: 'Firewall',
    file: 'labs/Configuring a Remote Access IPsec VPN on a FortiGate 40F.pdf',
    thumb: 'labs/thumbs/configuring-a-remote-access-ipsec-vpn-on-a-fortigate-40f.webp',
  },
]
