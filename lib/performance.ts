export function measureThemeSwitch(callback: () => void) {
  performance.mark('theme-switch-start')
  
  callback()
  
  // Use requestAnimationFrame to ensure DOM has updated
  requestAnimationFrame(() => {
    performance.mark('theme-switch-end')
    performance.measure(
      'theme-switch',
      'theme-switch-start',
      'theme-switch-end'
    )
    
    const measure = performance.getEntriesByName('theme-switch')[0]
    if (measure) {
      // eslint-disable-next-line no-console
      console.log(`Theme switch took ${measure.duration.toFixed(2)}ms`)
    }
    
    // Clean up
    performance.clearMarks()
    performance.clearMeasures()
  })
}