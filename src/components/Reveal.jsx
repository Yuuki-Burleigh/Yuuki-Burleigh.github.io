export default function Reveal({ children, as: Tag = 'div', className }) {
  return <Tag className={className}>{children}</Tag>
}
