import { resolveProductColor, contrastStroke } from '@/lib/productColors'

export type MockupType = 'polera' | 'blusa' | 'gorra' | 'taza' | 'sueter' | 'totebag'

export function ProductMockup({
  type,
  color = 'blanco',
  className
}: {
  type: MockupType
  color?: string
  className?: string
}) {
  const fill = resolveProductColor(color)
  const stroke = contrastStroke(fill)

  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(200,200)" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        {type === 'polera' && (
          <path
            d="M -35,-70 L -15,-85 Q 0,-78 15,-85 L 35,-70 L 85,-40 L 55,-10 L 55,90 L -55,90 L -55,-10 L -85,-40 Z"
            fill={fill}
            stroke={stroke}
          />
        )}

        {type === 'blusa' && (
          <path
            d="M -30,-72 L -12,-88 L 0,-70 L 12,-88 L 30,-72 L 78,-38 L 50,-8 L 42,20 Q 55,55 48,90 L -48,90 Q -55,55 -42,20 L -50,-8 L -78,-38 Z"
            fill={fill}
            stroke={stroke}
          />
        )}

        {type === 'sueter' && (
          <>
            <path
              d="M -35,-70 L -15,-85 Q 0,-78 15,-85 L 35,-70 L 85,-40 L 55,-10 L 55,90 L -55,90 L -55,-10 L -85,-40 Z"
              fill={fill}
              stroke={stroke}
            />
            <path d="M -18,-83 Q 0,-74 18,-83" fill="none" stroke={stroke} strokeWidth={3} />
            {[76, 82, 88].map((x) => (
              <line key={`r${x}`} x1={x - 26} y1={-42} x2={x - 6} y2={-30} stroke={stroke} strokeWidth={2} />
            ))}
            {[-76, -82, -88].map((x) => (
              <line key={`l${x}`} x1={x + 26} y1={-42} x2={x + 6} y2={-30} stroke={stroke} strokeWidth={2} />
            ))}
            <line x1={-55} y1={78} x2={55} y2={78} stroke={stroke} strokeWidth={2} />
          </>
        )}

        {type === 'gorra' && (
          <>
            <path d="M -110,20 Q -110,-75 0,-75 Q 110,-75 110,20 Z" fill={fill} stroke={stroke} />
            <path
              d="M -110,20 L -160,32 Q -165,45 -145,46 L -15,46 Q 0,46 0,28 L 0,20 Z"
              fill={fill}
              stroke={stroke}
            />
            <circle cx={0} cy={-75} r={5} fill={stroke} stroke="none" />
          </>
        )}

        {type === 'taza' && (
          <>
            <rect x={-75} y={-80} width={150} height={150} rx={10} fill={fill} stroke={stroke} />
            <path
              d="M 75,-45 Q 130,-45 130,0 Q 130,45 75,45"
              fill="none"
              stroke={stroke}
            />
          </>
        )}

        {type === 'totebag' && (
          <>
            <path d="M -35,-30 Q -35,-80 -10,-80" fill="none" stroke={stroke} />
            <path d="M 35,-30 Q 35,-80 10,-80" fill="none" stroke={stroke} />
            <rect x={-70} y={-30} width={140} height={140} rx={8} fill={fill} stroke={stroke} />
          </>
        )}
      </g>
    </svg>
  )
}
