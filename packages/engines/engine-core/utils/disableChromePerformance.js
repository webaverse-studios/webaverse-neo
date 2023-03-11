/**
 *  See issue: {@link https://github.com/bevyengine/bevy/issues/4851}
 */
export function disableChromePerformanceBloat() {
  if ( performance.clearMeasures ) {
    performance.clearMeasures()
  }
  if ( performance.clearMarks ) {
    performance.clearMarks()
  }
}
