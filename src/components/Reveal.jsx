import { motion, useReducedMotion } from 'framer-motion'

// Scroll-reveal wrapper. Falls back to a plain static element when the user
// prefers reduced motion (DESIGN.md §5).
export default function Reveal({ children, delay = 0, y = 24, as = 'div', className, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  if (reduce) {
    const Tag = as
    return <Tag className={className} {...rest}>{children}</Tag>
  }
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
