import {
  FloatingPortal,
  type Placement,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  initialOpen?: boolean
  placement?: Placement
  offsetSize?: number
}

function Popover({
  children,
  renderPopover,
  initialOpen,
  placement = 'bottom-start',
  offsetSize = 3
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(offsetSize), shift()],
    placement
  })
  const hover = useHover(context, {
    handleClose: safePolygon()
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  return (
    <div ref={refs.setReference} {...getReferenceProps()}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              initial={{ opacity: 0, top: 10 }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: 10 }}
              transition={{ duration: 0.3 }}
            >
              {renderPopover}
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Popover
