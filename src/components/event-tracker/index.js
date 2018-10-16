import {Component, PropTypes} from 'react'
import throttle from 'lodash.throttle'
import root from 'window-or-global'

class EventTracker extends Component {
  /**
   * A simple tracker for `window.scrollY`
   * @param {Object} props
   * @param {Function} props.onScroll - eventListener
   * @param {Number} props.throttleRate=0 - throttling rate in milliseconds
   */
  constructor (props) {
    super(props)
    this.state = {}
    this.trackScroll = this.trackScroll.bind(this)
  }

  static propTypes () {
    return {
      onScroll: PropTypes.func.isRequired,
      throttleRate: PropTypes.number
    }
  }

  static defaultProps () {
    return {
      throttleRate: 0
    }
  }

  trackScroll () {
    this.props.onScroll(root.scrollY)
  }

  componentWillMount () {
    // store so we can unbind properly in unmount
    this.throttledCallback = this.trackScroll
    if (this.props.throttleRate > 0) {
      this.throttledCallback = throttle(this.trackScroll, this.props.throttleRate)
    }

    root.document && root.document.addEventListener('scroll', this.throttledCallback)
  }

  componentWillUnmount () {
    root.document && root.document.removeEventListener('scroll', this.throttledCallback)
  }

  render () {
    return null
  }
}

export default EventTracker
