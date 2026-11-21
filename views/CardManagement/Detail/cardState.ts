const colors = {
  using: 'success',
  success: 'success',
  failed: 'error',
  error: 'error',
  deactivate: 'warning',
  waiting: 'warning',
  toBeActivated: 'warning',
  running: 'processing'
} as const
export function stateTone(value?: string): (typeof colors)[keyof typeof colors] | 'default' {
  return value && Object.prototype.hasOwnProperty.call(colors, value) ? colors[value as keyof typeof colors] : 'default'
}
