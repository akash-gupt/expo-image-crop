import React, { Component } from 'react'
import { View, PanResponder, Dimensions } from 'react-native'

class ImageCropOverlay extends React.Component {
    state = {
        draggingTL: false,
        draggingTM: false,
        draggingTR: false,
        draggingML: false,
        draggingMM: false,
        draggingMR: false,
        draggingBL: false,
        draggingBM: false,
        draggingBR: false,
        initialTop: this.props.initialTop,
        initialLeft: this.props.initialLeft,
        initialWidth: this.props.initialWidth,
        initialHeight: this.props.initialHeight,
        ratio: this.props.ratio,

        offsetTop: 0,
        offsetLeft: 0,
    }

    panResponder = {}

    UNSAFE_componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
            onPanResponderGrant: this.handlePanResponderGrant,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminate: this.handlePanResponderEnd,
        })
    }

    render() {
        const {
            draggingTL, draggingTM, draggingTR, draggingML, draggingMM, draggingMR, draggingBL, draggingBM, draggingBR, initialTop, initialLeft, initialHeight, initialWidth, offsetTop, offsetLeft, ratio,
        } = this.state
        const style = {}

        style.top = initialTop + ((draggingTL || draggingTM || draggingTR || draggingMM) ? offsetTop : 0)
        style.left = initialLeft + ((draggingTL || draggingML || draggingBL || draggingMM) ? offsetLeft : 0)
        style.width = initialWidth + ((draggingTL || draggingML || draggingBL) ? -offsetLeft : (draggingTM || draggingMM || draggingBM) ? 0 : offsetLeft)
        style.height = initialHeight + ((draggingTL || draggingTM || draggingTR) ? -offsetTop : (draggingML || draggingMM || draggingMR) ? 0 : offsetTop)

        // If ratio specified, modify width and height to maintain ratio
        if (ratio && ratio.height && ratio.width) {
            if (style.width * ratio.width > style.height * ratio.height) {
                style.height = style.width * (ratio.height / ratio.width)
            }
            if (style.height * ratio.height > style.width * ratio.width) {
                style.width = style.height * (ratio.width / ratio.height)
            }
        }

        if (style.width > this.props.initialWidth) {
            style.width = this.props.initialWidth
        }
        if (style.width < this.props.minWidth) {
            style.width = this.props.minWidth
        }
        if (style.height > this.props.initialHeight) {
            style.height = this.props.initialHeight
        }
        if (style.height < this.props.minHeight) {
            style.height = this.props.minHeight
        }
        const { borderColor } = this.props
        return (
            <View {...this.panResponder.panHandlers}
                style={[{
                    borderRadius: 25,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    borderStyle: 'solid',
                    borderWidth: 5,
                    borderColor,
                    backgroundColor: 'rgb(0,0,0,0.5)',
                }, style]}
            />
        )
    }

    getTappedItem(x, y) {
        const {
            initialLeft, initialTop, initialWidth, initialHeight,
        } = this.state
        const xPos = parseInt((x - initialLeft) / (initialWidth / 3))
        const yPos = parseInt((y - initialTop - 64) / (initialHeight / 3))

        const index = yPos * 3 + xPos
        if (index == 0) {
            return 'tl'
        } if (index == 1) {
            return 'tm'
        } if (index == 2) {
            return 'tr'
        } if (index == 3) {
            return 'ml'
        } if (index == 4) {
            return 'mm'
        } if (index == 5) {
            return 'mr'
        } if (index == 6) {
            return 'bl'
        } if (index == 7) {
            return 'bm'
        } if (index == 8) {
            return 'br'
        }
        return ''
    }

    // Should we become active when the user presses down on the square?
    handleStartShouldSetPanResponder = event => true

    // We were granted responder status! Let's update the UI
    handlePanResponderGrant = (event) => {
        // console.log(event.nativeEvent.locationX + ', ' + event.nativeEvent.locationY)

        const selectedItem = this.getTappedItem(event.nativeEvent.pageX, event.nativeEvent.pageY)
        if (selectedItem == 'tl') {
            this.setState({ draggingTL: true })
        } else if (selectedItem == 'tm') {
            this.setState({ draggingTM: true })
        } else if (selectedItem == 'tr') {
            this.setState({ draggingTR: true })
        } else if (selectedItem == 'ml') {
            this.setState({ draggingML: true })
        } else if (selectedItem == 'mm') {
            this.setState({ draggingMM: true })
        } else if (selectedItem == 'mr') {
            this.setState({ draggingMR: true })
        } else if (selectedItem == 'bl') {
            this.setState({ draggingBL: true })
        } else if (selectedItem == 'bm') {
            this.setState({ draggingBM: true })
        } else if (selectedItem == 'br') {
            this.setState({ draggingBR: true })
        }
    }

    // Every time the touch/mouse moves
    handlePanResponderMove = (e, gestureState) => {
        // Keep track of how far we've moved in total (dx and dy)
        this.setState({
            offsetTop: gestureState.dy,
            offsetLeft: gestureState.dx,
        })
    }

    // When the touch/mouse is lifted
    handlePanResponderEnd = (e, gestureState) => {
        const {
            initialTop, initialLeft, initialWidth, initialHeight, draggingTL, draggingTM, draggingTR, draggingML, draggingMM, draggingMR, draggingBL, draggingBM, draggingBR, ratio,
        } = this.state

        const state = {
            draggingTL: false,
            draggingTM: false,
            draggingTR: false,
            draggingML: false,
            draggingMM: false,
            draggingMR: false,
            draggingBL: false,
            draggingBM: false,
            draggingBR: false,
            offsetTop: 0,
            offsetLeft: 0,
        }

        state.initialTop = initialTop + ((draggingTL || draggingTM || draggingTR || draggingMM) ? gestureState.dy : 0)
        state.initialLeft = initialLeft + ((draggingTL || draggingML || draggingBL || draggingMM) ? gestureState.dx : 0)
        state.initialWidth = initialWidth + ((draggingTL || draggingML || draggingBL) ? -gestureState.dx : (draggingTM || draggingMM || draggingBM) ? 0 : gestureState.dx)
        state.initialHeight = initialHeight + ((draggingTL || draggingTM || draggingTR) ? -gestureState.dy : (draggingML || draggingMM || draggingMR) ? 0 : gestureState.dy)

        if (ratio && ratio.height && ratio.width) {
            if (state.initialWidth * ratio.width > state.initialHeight * ratio.height) {
                state.initialHeight = state.initialWidth * (ratio.height / ratio.width)
            }
            if (state.initialHeight * ratio.height > state.initialWidth * ratio.width) {
                state.initialWidth = state.initialHeight * (ratio.width / ratio.height)
            }
        }

        if (state.initialWidth > this.props.initialWidth) {
            state.initialWidth = this.props.initialWidth
        }
        if (state.initialWidth < this.props.minWidth) {
            state.initialWidth = this.props.minWidth
        }
        if (state.initialHeight > this.props.initialHeight) {
            state.initialHeight = this.props.initialHeight
        }
        if (state.initialHeight < this.props.minHeight) {
            state.initialHeight = this.props.minHeight
        }

        this.setState(state)
        this.props.onLayoutChanged(state.initialTop, state.initialLeft, state.initialWidth, state.initialHeight)
    }
}

export default ImageCropOverlay
