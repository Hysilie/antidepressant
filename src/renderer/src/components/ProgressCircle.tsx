const ProgressCircle = ({ percent }: { percent: number }): JSX.Element => {
  const radius = 12
  const stroke = 4
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  const getStrokeColor = (percent: number): string => {
    if (percent === 100) return '#B4EDBD'
    if (percent === 0) return '#808080'
    return '#F6BA65'
  }

  return (
    <svg width={radius * 2} height={radius * 2} className="shrink-0">
      <circle
        stroke="#E5E7EB"
        fill="none"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={getStrokeColor(percent)}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  )
}

export default ProgressCircle
