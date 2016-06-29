!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ?
        exports.RactiveTooltip = t() : e.RactiveTooltip = t()
}(this, function() {
    return function(e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = {
                exports: {},
                id: r,
                loaded: !1
            };
            return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.p = "", t(0)
    }([function(e, t, n) {
        function r(e, t, n) {
            var r = {
                    x: e.pageX,
                    y: e.pageY
                },
                o = r.y - n.offsetHeight - 5,
                a = r.x + n.offsetWidth - i.innerWidth,
                s = e.pageY - n.offsetHeight - 5,
                f = e.pageX - 5;
            a > 0 && (f -= a - 5), 0 > o && (s += 2 * n.offsetHeight - 5), n.style.left = f + "px", n.style.top = s + "px"
        }

        function o(e, t) {
            var n, o, i;
            o = {
                mouseenter: function(o) {
                    t && 0 !== t.length && (n || (n = a.createElement("div"), n.className = "ractive-tooltip", n.textContent = t), r(o,
                        e, n), a.body.appendChild(n))
                },
                mousemove: function(t) {
                    n && r(t, e, n)
                },
                mouseleave: function() {
                    n && n.parentNode && n.parentNode.removeChild(n)
                }
            };
            for (i in o) o.hasOwnProperty(i) && e.addEventListener(i, o[i], !1);
            return {
                update: function(e) {
                    t = e, n && (n.textContent = t), t && 0 !== t.length || !n || !n.parentNode || n.parentNode.removeChild(n)
                },
                teardown: function() {
                    n && n.parentNode && (n.parentNode.removeChild(n), n = null);
                    for (i in o) o.hasOwnProperty(i) && e.removeEventListener(i, o[i], !1)
                }
            }
        }
        n(1);
        var i = window,
            a = i.document;
        e.exports = o
    }, function(e, t, n) {
        var r = n(2);
        "string" == typeof r && (r = [[e.id, r, ""]]);
        n(4)(r, {});
        r.placeholders && (e.exports = r.placeholders)
    }, function(e, t, n) {
        t = e.exports = n(3)(), t.push([e.id,
            ".ractive-tooltip{position:absolute;display:table;padding:.5em;color:#fff;background:#000;box-shadow:0 2px 2px rgba(0,0,0,.1);border-radius:5px;white-space:nowrap;z-index:99999;font-style:normal;text-transform:none;pointer-events:none}",
            ""])
    }, function(e, t) {
        e.exports = function() {
            var e = [];
            return e.toString = function() {
                for (var e = [], t = 0; t < this.length; t++) {
                    var n = this[t];
                    n[2] ? e.push("@media " + n[2] + "{" + n[1] + "}") : e.push(n[1])
                }
                return e.join("")
            }, e.i = function(t, n) {
                "string" == typeof t && (t = [[null, t, ""]]);
                for (var r = {}, o = 0; o < this.length; o++) {
                    var i = this[o][0];
                    "number" == typeof i && (r[i] = !0)
                }
                for (var o = 0; o < t.length; o++) {
                    var a = t[o];
                    "number" == typeof a[0] && r[a[0]] || (n && !a[2] ? a[2] = n : n && (a[2] = "(" + a[2] + ") and (" + n + ")"), e.push(
                        a))
                }
            }, e
        }
    }, function(e, t, n) {
        function r(e, t) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n],
                    o = d[r.id];
                if (o) {
                    o.refs++;
                    for (var i = 0; i < o.parts.length; i++) o.parts[i](r.parts[i]);
                    for (; i < r.parts.length; i++) o.parts.push(s(r.parts[i], t))
                } else {
                    for (var a = [], i = 0; i < r.parts.length; i++) a.push(s(r.parts[i], t));
                    d[r.id] = {
                        id: r.id,
                        refs: 1,
                        parts: a
                    }
                }
            }
        }

        function o(e) {
            for (var t = [], n = {}, r = 0; r < e.length; r++) {
                var o = e[r],
                    i = o[0],
                    a = o[1],
                    s = o[2],
                    f = o[3],
                    p = {
                        css: a,
                        media: s,
                        sourceMap: f
                    };
                n[i] ? n[i].parts.push(p) : t.push(n[i] = {
                    id: i,
                    parts: [p]
                })
            }
            return t
        }

        function i() {
            var e = document.createElement("style"),
                t = h();
            return e.type = "text/css", t.appendChild(e), e
        }

        function a() {
            var e = document.createElement("link"),
                t = h();
            return e.rel = "stylesheet", t.appendChild(e), e
        }

        function s(e, t) {
            var n, r, o;
            if (t.singleton) {
                var s = m++;
                n = v || (v = i()), r = f.bind(null, n, s, !1), o = f.bind(null, n, s, !0)
            } else e.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL &&
                "function" == typeof Blob && "function" == typeof btoa ? (n = a(), r = u.bind(null, n), o = function() {
                    n.parentNode.removeChild(n), n.href && URL.revokeObjectURL(n.href)
                }) : (n = i(), r = p.bind(null, n), o = function() {
                    n.parentNode.removeChild(n)
                });
            return r(e),
                function(t) {
                    if (t) {
                        if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap) return;
                        r(e = t)
                    } else o()
                }
        }

        function f(e, t, n, r) {
            var o = n ? "" : r.css;
            if (e.styleSheet) e.styleSheet.cssText = g(t, o);
            else {
                var i = document.createTextNode(o),
                    a = e.childNodes;
                a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(i, a[t]) : e.appendChild(i)
            }
        }

        function p(e, t) {
            var n = t.css,
                r = t.media;
            t.sourceMap;
            if (r && e.setAttribute("media", r), e.styleSheet) e.styleSheet.cssText = n;
            else {
                for (; e.firstChild;) e.removeChild(e.firstChild);
                e.appendChild(document.createTextNode(n))
            }
        }

        function u(e, t) {
            var n = t.css,
                r = (t.media, t.sourceMap);
            r && (n += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(r)) + " */");
            var o = new Blob([n], {
                    type: "text/css"
                }),
                i = e.href;
            e.href = URL.createObjectURL(o), i && URL.revokeObjectURL(i)
        }
        var d = {},
            c = function(e) {
                var t;
                return function() {
                    return "undefined" == typeof t && (t = e.apply(this, arguments)), t
                }
            },
            l = c(function() {
                return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())
            }),
            h = c(function() {
                return document.head || document.getElementsByTagName("head")[0]
            }),
            v = null,
            m = 0;
        e.exports = function(e, t) {
            t = t || {}, "undefined" == typeof t.singleton && (t.singleton = l());
            var n = o(e);
            return r(n, t),
                function(e) {
                    for (var i = [], a = 0; a < n.length; a++) {
                        var s = n[a],
                            f = d[s.id];
                        f.refs--, i.push(f)
                    }
                    if (e) {
                        var p = o(e);
                        r(p, t)
                    }
                    for (var a = 0; a < i.length; a++) {
                        var f = i[a];
                        if (0 === f.refs) {
                            for (var u = 0; u < f.parts.length; u++) f.parts[u]();
                            delete d[f.id]
                        }
                    }
                }
        };
        var g = function() {
            var e = [];
            return function(t, n) {
                return e[t] = n, e.filter(Boolean).join("\n")
            }
        }()
    }])
});
