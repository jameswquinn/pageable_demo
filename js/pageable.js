/*!
 * Pageable 0.0.2
 * http://mobius.ovh/
 *
 * Released under the MIT license
 */
var _createClass = function() {
    function f(g, j) {
        for (var l, k = 0; k < j.length; k++)
            l = j[k], l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), Object.defineProperty(g, l.key, l)
    }
    return function(g, j, k) {
        return j && f(g.prototype, j), k && f(g, k), g
    }
}();
function _classCallCheck(f, g) {
    if (!(f instanceof g))
        throw new TypeError("Cannot call a class as a function")
}
var Pageable = function() {
    function f(g, j) {
        var k = this;
        if (_classCallCheck(this, f), void 0 === g)
            return console.error("Pageable:", "No container defined.");
        return this.container = "string" == typeof g ? document.querySelector(g) : g, this.pages = Array.from(this.container.querySelectorAll("[data-anchor]")), this.pages.length ? void (this.config = Object.assign({}, {
            pips: !0,
            interval: 300,
            delay: 0,
            throttle: 50,
            orientation: "vertical",
            easing: function(n, o, p, q) {
                return -p * (n /= q) * (n - 2) + o
            },
            onInit: function() {},
            onBeforeStart: function() {},
            onStart: function() {},
            onScroll: function() {},
            onFinish: function() {}
        }, j), this.horizontal = "horizontal" === this.config.orientation, this.anchors = [], this.pages.forEach(function(m) {
            var n = m.dataset.anchor.replace(/\s+/, "-");
            m.id !== n && (m.id = n), k.anchors.push("#" + n), m.classList.add("pg-page")
        }), this.axis = this.horizontal ? "x" : "y", this.mouseAxis = {
            x: "pageX",
            y: "pageY"
        }, this.scrollAxis = {
            x: "scrollLeft",
            y: "scrollTop"
        }, this.size = {
            x: "width",
            y: "height"
        }, this.bar = utils.getScrollBarWidth(), this.wrapper = document.createElement("div"), this.index = 0, this.init()) : console.error("Pageable:", "No child nodes with the [data-anchor] attribute could be found.")
    }
    return _createClass(f, [{
        key: "init",
        value: function() {
            if (this.container.parentNode.insertBefore(this.wrapper, this.container), this.wrapper.appendChild(this.container), this.wrapper.classList.add("pg-wrapper", "pg-" + this.config.orientation), this.wrapper.classList.add("pg-wrapper"), this.container.classList.add("pg-container"), document.body.style.margin = 0, document.body.style.overflow = "hidden", this.config.pips) {
                var j = document.createElement("nav"),
                    k = document.createElement("ul");
                this.pages.forEach(function(l, m) {
                    var n = document.createElement("li"),
                        o = document.createElement("a"),
                        p = document.createElement("span");
                    o.href = "#" + l.id, 0 == m && o.classList.add("active"), o.appendChild(p), n.appendChild(o), k.appendChild(n)
                }), j.appendChild(k), this.wrapper.appendChild(j), this.pips = Array.from(k.children)
            }
            this.bind()
        }
    }, {
        key: "bind",
        value: function() {
            var j = this;
            this.callbacks = {
                wheel: this.wheel.bind(this),
                update: utils.throttle(this.update.bind(this), this.config.throttle),
                load: this.load.bind(this)
            }, window.addEventListener("wheel", this.callbacks.wheel, !1), window.addEventListener("resize", this.callbacks.update, !1), this.down = !1, window.addEventListener("mousedown", function(m) {
                return !!m.target.closest("[data-anchor]") && void (m.preventDefault(), j.down = {
                        x: m.pageX,
                        y: m.pageY
                    }, j.config.onBeforeStart.call(j, j.pages[j.index].id))
            }, !1);
            var k = function() {
                    return j.index < j.pages.length - 1 && j.index++
                },
                l = function() {
                    return 0 < j.index && j.index--
                };
            window.addEventListener("mouseup", function(m) {
                if (j.down && !j.scrolling) {
                    var n = j.index;
                    m[j.mouseAxis[j.axis]] < j.down[j.axis] ? 1 === m.button ? l() : k() : m[j.mouseAxis[j.axis]] > j.down[j.axis] && (1 === m.button ? k() : l()), n === j.index ? j.config.onFinish.call(j, {
                        hash: j.pages[j.index].id,
                        page: j.index + 1,
                        index: j.index
                    }) : j.scrollBy(j.getScrollAmount(n)), j.down = !1
                }
            }, !1), document.addEventListener("DOMContentLoaded", this.callbacks.load, !1), document.addEventListener("click", function(m) {
                var n = m.target,
                    o = n.closest("a");
                o && -1 < j.anchors.indexOf(o.hash) && (m.preventDefault(), j.scrollToAnchor(o.hash))
            }, !1)
        }
    }, {
        key: "load",
        value: function() {
            var j = location.hash;
            if (j) {
                var k = this.anchors.indexOf(j);
                -1 < k && (this.index = k, this.setPips(), this.wrapper[this.scrollAxis[this.axis]] = (this.horizontal ? window.innerWidth : window.innerHeight) * this.index, this.config.onFinish.call(this, {
                    id: this.pages[this.index].id,
                    hash: this.anchors[this.index],
                    page: this.index + 1,
                    index: this.index
                }))
            }
            this.update(), this.config.onInit.call(this, this.pages)
        }
    }, {
        key: "setPips",
        value: function(j) {
            this.config.pips && (void 0 === j && (j = this.index), this.pips.forEach(function(k, l) {
                k.firstElementChild.classList.toggle("active", l == j)
            }))
        }
    }, {
        key: "wheel",
        value: function(j) {
            if (j.preventDefault(), !this.scrolling) {
                var k = this.index;
                0 < j.deltaY ? this.index < this.pages.length - 1 && this.index++ : 0 < this.index && this.index--, this.index !== k && this.scrollBy(this.getScrollAmount(k))
            }
        }
    }, {
        key: "getScrollAmount",
        value: function(j, k) {
            void 0 === k && (k = this.index);
            var l = this.data.window[this.size[this.axis]],
                n = l * k;
            return l * j - n
        }
    }, {
        key: "scrollBy",
        value: function(j) {
            var k = this;
            return !this.scrolling && void (this.scrolling = !0, this.config.onBeforeStart.call(this, this.pages[this.index].id), this.timer = setTimeout(function() {
                    var l = Date.now(),
                        m = k.getScrollOffset();
                    k.setURL(k.pages[k.index].id), k.setPips();
                    k.config.onStart.call(k, k.pages[k.index].id), k.frame = requestAnimationFrame(function o() {
                        var p = Date.now(),
                            q = p - l;
                        if (q > k.config.interval) {
                            cancelAnimationFrame(k.frame);
                            var r = k.data.window[k.size[k.axis]] * k.index;
                            return k.container.style.transform = "", k.wrapper[k.scrollAxis[k.axis]] = k.scrollPosition = r, k.frame = !1, k.scrolling = !1, k.config.onFinish.call(k, {
                                hash: k.pages[k.index].id,
                                page: k.index + 1,
                                index: k.index
                            }), !1
                        }
                        var u = k.config.easing(q, 0, j, k.config.interval);
                        k.container.style.transform = k.horizontal ? "translate3d(" + u + "px, 0, 0)" : "translate3d(0, " + u + "px, 0)", k.config.onScroll.call(k, m[k.axis] - u), k.frame = requestAnimationFrame(o);
                        var v = new CustomEvent("pageable.scroll", {
                            detail: {
                                scrolled: Math.round(m[k.axis] - u)
                            }
                        });
                        window.dispatchEvent(v)
                    })
                }, this.config.delay))
        }
    }, {
        key: "setURL",
        value: function(j) {
            history.pushState ? history.pushState(null, "", "#" + j) : location.hash = "#" + j
        }
    }, {
        key: "scrollToPage",
        value: function(j) {
            this.scrollToIndex(j - 1)
        }
    }, {
        key: "scrollToIndex",
        value: function(j) {
            if (0 <= j && j <= this.pages.length - 1) {
                var k = this.index;
                this.index = j;
                var l = this.getScrollAmount(k);
                this.scrollBy(l)
            }
        }
    }, {
        key: "scrollToAnchor",
        value: function(j) {
            var k = this.anchors.indexOf(j);
            return 0 > k || k === this.index ? !1 : void this.scrollToIndex(k)
        }
    }, {
        key: "next",
        value: function() {
            this.scrollToIndex(this.index + 1)
        }
    }, {
        key: "prev",
        value: function() {
            this.scrollToIndex(this.index - 1)
        }
    }, {
        key: "update",
        value: function() {
            var j = this;
            clearTimeout(this.timer), this.data = {
                window: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                container: {
                    height: this.wrapper.scrollHeight,
                    width: this.wrapper.scrollWidth
                }
            };
            var k = this.size[this.axis],
                l = this.horizontal ? this.size.y : this.size.x;
            this.wrapper.style["overflow-" + this.axis] = "scroll", this.wrapper.style[k] = this.data.window[k] + "px", this.wrapper.style[l] = this.data.window[l] + this.bar + "px", this.container.style[k] = this.pages.length * this.data.window[k] + "px", this.wrapper.style["padding-" + (this.horizontal ? "bottom" : "right")] = this.bar + "px", this.wrapper[this.scrollAxis[this.axis]] = this.index * this.data.window[k], this.scrollSize = this.pages.length * this.data.window[k] - this.data.window[k], this.scrollPosition = this.data.window[k] * this.index, this.pages.forEach(function(n) {
                j.horizontal && (n.style.float = "left"), n.style[k] = j.data.window[k] + "px", n.style[l] = j.data.window[l] + "px"
            });
            var m = new Event("pageable.update");
            window.dispatchEvent(m)
        }
    }, {
        key: "getScrollOffset",
        value: function() {
            return {
                x: this.wrapper.scrollLeft,
                y: this.wrapper.scrollTop
            }
        }
    }, {
        key: "orientate",
        value: function(j) {
            switch (j) {
            case "vertical":
                this.horizontal = !1, this.axis = "y", this.container.style.width = "";
                break;
            case "horizontal":
                this.horizontal = !0, this.axis = "x", this.container.style.height = "";
                break;
            default:
                return !1;
            }
            this.wrapper.classList.toggle("pg-vertical", !this.horizontal), this.wrapper.classList.toggle("pg-horizontal", this.horizontal), this.config.orientation = j, this.update()
        }
    }]), f
}();
