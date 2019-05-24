import React from 'react'
import {MountedMixin} from "../mixins/mixins";
import {PlainComponent} from "../PlainComponent/PlainComponent";

const scroll = require('scroll');
const elementResizeDetectorMaker = require('element-resize-detector');
let erdUltraFast = elementResizeDetectorMaker({strategy: 'scroll'});

export class PlScroll extends PlainComponent {
    render() {
        return (
            <div className={this.hostClasses}
                 style={this.hostStyles}
                 ref='host'
                 onMouseEnter={this._mouseenter}
                 onMouseLeave={this._mouseleave}
            >
                <div className="pl-scroll-content-wrapper"
                     style={this.wrapperStyles}
                     ref='wrapper'
                >
                    <div className="pl-scroll-content"
                         ref='content'
                         style={this.contentStyles}
                    >
                        {this.props.children}
                    </div>

                    {!this.hideScrollbar && !!this.scrollY &&
                    <div className="pl-scroll-vertical-indicator-wrapper">
                        <div className="pl-scroll-vertical-indicator"
                             ref="verticalIndicator"
                             style={this.verticalIndicatorStyles}
                             onMouseDown={this.vIndicatorDragStart}
                        >
                        </div>
                    </div>}

                    {!this.hideScrollbar && !!this.scrollX &&
                    <div className="pl-scroll-horizontal-indicator-wrapper">
                        <div className="pl-scroll-horizontal-indicator"
                             ref="horizontalIndicator"
                             style={this.horizontalIndicatorStyles}
                             onMouseDown={this.hIndicatorDragStart}
                        >
                        </div>
                    </div>}
                </div>
            </div>
        );
    }

    mixins() {
        return [MountedMixin]
    }

    static defaultProps = {
        scrollbarSize: 9,
        scrollbarColor: 'rgba(0,0,0,0.1)',
        scrollX: false,
        scrollY: true,
        hideScrollbar: null,
        fitWidth: null,
        fitHeight: null,
        fitHostWidth: null,
        fitHostHeight: null,
        bottomScrollDuration: 20,
        topScrollDuration: 20,
    }

    data() {
        return {
            p_verticalPosition: 'top',
            contentWrapperScrollTop: 0,
            contentWrapperScrollLeft: 0,
            contentWidth: 0,
            contentHeight: 0,
            hostWidth: 0,
            hostHeight: 0,

            dragStartTop: 0,
            dragStartY: 0,
            dragStartLeft: 0,
            dragStartX: 0,
            hover: false,
            draging: false,
        };
    }

    mounted() {
        erdUltraFast.listenTo(this.refs.content, this._contentResize);
        erdUltraFast.listenTo(this.refs.host, this._hostResize);
        this.refs.wrapper.addEventListener('scroll', this._handleScroll)
    }

    computed() {
        return {
            hostClasses() {
                return this.classnames([
                    'pl-scroll',
                    {
                        ['pl-scroll-hover']: this.hover || this.draging
                    }
                ])
            },
            indicatorHeight() {
                return (this.contentHeight > this.hostHeight + 1) ? this.hostHeight * this.hostHeight / this.contentHeight : 0;
            },
            indicatorTop() {
                return (this.hostHeight - this.indicatorHeight) * this.contentWrapperScrollTop / (this.contentHeight - this.hostHeight);
            },
            indicatorWidth() {
                return (this.contentWidth > this.hostWidth + 1) ? this.hostWidth * this.hostWidth / this.contentWidth : 0;
            },
            indicatorLeft() {
                return (this.hostWidth - this.indicatorWidth) * this.contentWrapperScrollLeft / (this.contentWidth - this.hostWidth);
            },
            verticalIndicatorStyles() {
                return {
                    height: `${this.indicatorHeight}px`,
                    width: `${this.scrollbarSize}px`,
                    top: `${this.indicatorTop}px`,
                    backgroundColor: this.scrollbarColor,
                };
            },
            horizontalIndicatorStyles() {
                return {
                    height: `${this.scrollbarSize}px`,
                    width: `${this.indicatorWidth}px`,
                    left: `${this.indicatorLeft}px`,
                    backgroundColor: this.scrollbarColor,
                };
            },
            contentStyles() {
                let styles = {};
                if (!this.scrollX && this.contentWidth > 0) styles.width = `${this.contentWidth}px`;
                if (!this.scrollY && this.contentHeight > 0) styles.height = `${this.contentHeight}px`;
                if (this.fitHostWidth != null && !!this.fitHostWidth) styles.width = `100%`;
                if (this.fitHostHeight != null && !!this.fitHostHeight) styles.height = `100%`;
                return styles;
            },
            wrapperStyles() {
                let styles = {};
                if (!this.scrollX) {
                    styles.overflowX = 'hidden';
                    styles.height = '100%';
                }
                if (!this.scrollY) {
                    styles.overflowY = 'hidden';
                    styles.width = '100%';
                }
                return styles;
            },
            hostStyles() {
                if (!this.p_mounted) return
                const styles = {}
                if (!!this.fitWidth) styles.width = `${this.contentWidth}px`;
                if (!!this.fitHeight) styles.height = `${this.contentHeight}px`;
                return styles
            },
        }
    }

    methods() {
        return {
            async refreshSize() {
                this.contentWidth = 0
                this.contentHeight = 0
                // await this.$plain.nextTick()
                // await this.$plain.nextTick()
                this._contentResize(this.refs.content)
                this._hostResize(this.refs.host)
                this.refs.wrapper.scrollTop = 0
            },
            _contentResize(el) {
                this.contentWidth = el.offsetWidth;
                this.contentHeight = el.offsetHeight;
            },
            _hostResize(el) {
                this.hostWidth = el.offsetWidth;
                this.hostHeight = el.offsetHeight;
            },
            _handleScroll(e) {
                this.contentWrapperScrollTop = e.target.scrollTop;
                this.contentWrapperScrollLeft = e.target.scrollLeft;
                this.$emit('scroll', e);

                if (this.p_verticalPosition === 'top' && this.contentWrapperScrollTop > this.topScrollDuration) {
                    /*进入center*/
                    this.$emit('vertical-scroll-center')
                    this.p_verticalPosition = 'center'
                } else if (this.p_verticalPosition === 'center') {
                    // console.log(this.contentHeight - this.hostHeight - this.contentWrapperScrollTop, this.bottomScrollDuration)
                    if (this.contentWrapperScrollTop < this.topScrollDuration) {
                        /*进入top*/
                        this.$emit('vertical-scroll-top')
                        this.p_verticalPosition = 'top'
                    } else if (this.contentHeight - this.hostHeight - this.contentWrapperScrollTop < this.bottomScrollDuration) {
                        /*进入bottom*/
                        this.$emit('vertical-scroll-bottom')
                        this.p_verticalPosition = 'bottom'
                    }

                } else if (this.p_verticalPosition === 'bottom') {
                    if (this.contentHeight - this.hostHeight - this.contentWrapperScrollTop > this.bottomScrollDuration) {
                        /*进入center*/
                        this.$emit('vertical-scroll-center')
                        this.p_verticalPosition = 'center'
                    }
                }
            },
            vIndicatorDragStart(e) {
                this.draging = true
                this.dragStartTop = this.indicatorTop;
                this.dragStartY = e.clientY;
                document.addEventListener('mousemove', this.vIndicatorDragMove);
                document.addEventListener('mouseup', this.vIndicatorDragEnd);
                this.$plain.$dom.enableSelectNone()
            },
            vIndicatorDragMove(e) {
                let deltaY = e.clientY - this.dragStartY;
                const targetTop = this.dragStartTop + deltaY;
                this.refs.wrapper.scrollTop = `${targetTop * (this.contentHeight - this.hostHeight) / (this.hostHeight - this.indicatorHeight)}`;
            },
            vIndicatorDragEnd(e) {
                this.draging = false
                document.removeEventListener('mousemove', this.vIndicatorDragMove);
                document.removeEventListener('mouseup', this.vIndicatorDragEnd);
                this.$plain.$dom.disabledSelectNone()
            },
            hIndicatorDragStart(e) {
                this.draging = true
                this.dragStartLeft = this.indicatorLeft;
                this.dragStartX = e.clientX;
                document.addEventListener('mousemove', this.hIndicatorDragMove);
                document.addEventListener('mouseup', this.hIndicatorDragEnd);
                this.$plain.$dom.enableSelectNone()
            },
            hIndicatorDragMove(e) {
                let deltaX = e.clientX - this.dragStartX;
                const targetLeft = this.dragStartLeft + deltaX;
                this.refs.wrapper.scrollLeft = `${targetLeft * (this.contentWidth - this.hostWidth) / (this.hostWidth - this.indicatorWidth)}`;
            },
            hIndicatorDragEnd(e) {
                this.draging = false
                document.removeEventListener('mousemove', this.hIndicatorDragMove);
                document.removeEventListener('mouseup', this.hIndicatorDragEnd);
                this.$plain.$dom.disabledSelectNone()
            },
            _mouseenter() {
                this.hover = true;
            },
            _mouseleave() {
                this.hover = false;
            },
            scrollTop(pos = 0, dur = 400, done) {
                scroll.top(this.refs.wrapper, pos);
            },
            scrollLeft(pos = 0, dur = 400, done) {
                scroll.left(this.refs.wrapper, pos);
            },
            scrollTo({x, y}) {
                x != null && (this.scrollLeft(x));
                y != null && (this.scrollTop(y));
            },
            setScroll({x, y}) {
                x != null && (this.refs.wrapper.scrollLeft = x)
                y != null && (this.refs.wrapper.scrollTop = y)
            },
            setScrollEnd({x, y}) {
                !!x && (this.refs.wrapper.scrollLeft = this.refs.wrapper.scrollWidth)
                !!y && (this.refs.wrapper.scrollTop = this.refs.wrapper.scrollHeight)
            },
        }
    }

}