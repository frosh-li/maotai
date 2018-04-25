/* 2018-02-01 17:10:36 */ ! function(t, a) {
    var r = 1e4,
        s = "//aeu.alicdn.com/",
        g_moduleConfig = {
            uabModule: {
                stable: ["js/cj/107.js"],
                grey: ["js/cj/108.js"],
                ratio: 1
            },
            umidPCModule: {
                stable: ["security/umscript/3.3.25/um.js"],
                grey: ["security/umscript/3.3.28/um.js"],
                ratio: 1e4
            },
            umidH5Module: {
                stable: ["security/umscript/3.3.25/um-m.js"],
                grey: ["security/umscript/3.3.28/um-m.js"],
                ratio: 1e4
            },
            ncPCModule: {
                stable: ["js/nc/60.js"],
                grey: ["js/nc/60.js"],
                ratio: 1e4
            },
            ncH5Module: {
                stable: ["js/nc/60.js"],
                grey: ["js/nc/60.js"],
                ratio: 1e4
            }
        };

    function c(a, c) {
        var v = "AWSC_SPECIFY_" + a.toUpperCase() + "_ADDRESSES";
        if (t[v]) return t[v];
        var p = "";
        for (var h in g_moduleConfig)
            if (g_moduleConfig.hasOwnProperty(h) && h === a) {
                var moduleConfig = g_moduleConfig[h];
                p = Math.ceil(Math.random() * r) <= moduleConfig.ratio ? moduleConfig.grey : moduleConfig.stable;
                for (var y = 0; y < p.length; y++) p[y] = (c ? "//" + c + "/" : s) + p[y];
                return p
            }
    }
    var v = [{
            name: "umidPCModule",
            features: ["umpc"],
            depends: [],
            sync: !1
        }, {
            name: "umidH5Module",
            features: ["umh5"],
            depends: [],
            sync: !1
        }, {
            name: "uabModule",
            features: ["uab"],
            depends: [],
            sync: !1
        }, {
            name: "ncPCModule",
            features: ["ncPC", "scPC"],
            depends: ["uab", "umpc"],
            sync: !0
        }, {
            name: "ncH5Module",
            features: ["ncH5", "scH5"],
            depends: ["uab", "umh5"],
            sync: !0
        }],
        p = [],
        h = "loading",
        y = "loaded",
        b = "timeout",
        j = "unexpected",
        M = "no such feature";

    function S(t) {
        for (var a = void 0, r = 0; r < v.length; r++) {
            for (var s = v[r], c = 0; c < s.features.length; c++)
                if (s.features[c] === t) {
                    a = s;
                    break
                }
            if (a) break
        }
        return a
    }

    function k(t) {
        for (var a = 0; a < p.length; a++) {
            var r = p[a];
            if (r.name === t) return r
        }
    }

    function w(t) {
        for (var a = void 0, r = 0; r < v.length; r++) {
            var s = v[r];
            if (s.name === t) {
                a = s;
                break
            }
            if (a) break
        }
        return a
    }

    function A(t) {
        return /http/.test(location.protocol) || (t = "https:" + t), t
    }

    function P(t, r, s) {
        if (s)
            for (var c = 0; c < t.length; c++) {
                var v = t[c];
                v = A(v), a.write("<script src=" + v + "></script>")
            } else
                for (var c = 0; c < t.length; c++) {
                    var v = t[c];
                    v = A(v);
                    var p = a.createElement("script");
                    p.async = !1, p.src = v, p.id = r;
                    var m = a.getElementsByTagName("script")[0];
                    m && m.parentNode ? m.parentNode.insertBefore(p, m) : (m = a.body || a.head, m && m.appendChild(p))
                }
    }

    function I(a, r, s) {
        var c = "//acjs.aliyun.com/error?v=" + a + "&e=" + r + "&stack=" + s;
        c = A(c);
        var v = new Image,
            p = "_awsc_img_" + Math.floor(1e6 * Math.random());
        t[p] = v, v.onload = v.onerror = function() {
            try {
                delete t[p]
            } catch (e) {
                t[p] = null
            }
        }, v.src = c
    }

    function W(t) {
        Math.random() < .001 && I("awsc_state", "feature=" + t.name + ",state=" + t.state + ",href=" + encodeURIComponent(location.href));
        for (var a = void 0; a = t.callbacks.shift();) a(t.state, t["export"])
    }

    function H(t, a, r) {
        var s = S(t);
        if (!s) return a && a(M), void 0;
        var v = r && r.cdn,
            y = r && r.sync,
            j = r && r.timeout || 5e3;
        if (0 != s.depends.length)
            for (var k = 0; k < s.depends.length; k++) {
                var w = s.depends[k];
                r && (delete r.sync, delete r.timeout, delete r.cdn), T(w, void 0, r)
            }
        var A = {};
        if (A.module = s, A.name = t, A.state = h, A.callbacks = [], a && A.callbacks.push(a), A.timeoutTimer = setTimeout(function() {
                A.state = b, W(A)
            }, j), p.push(A), !s.moduleLoadStatus) {
            var I = s.sync;
            y && (I = y);
            var H = c(s.name, v);
            P(H, "AWSC_" + s.name, I)
        }
        s.moduleLoadStatus = h
    }

    function T(t, a, r) {
        try {
            var s = k(t);
            if (s) return s.state === y || s.state === b ? a && a(s.state, s["export"]) : s.state === h ? a && s.callbacks.push(a) : void 0, void 0;
            H(t, a, r)
        } catch (e) {
            I("awsc_error", encodeURIComponent(e.message), e.stack)
        }
    }

    function x(t, a, r) {
        try {
            var s = w(t);
            s || void 0, s.moduleLoadStatus = y;
            for (var c = void 0, v = 0; v < p.length; v++) {
                var j = p[v];
                j.module === s && j.name === a && (c = j, clearTimeout(c.timeoutTimer), delete c.timeoutTimer, c["export"] = r, j.state === h || j.state === b ? (c.state = y, W(c)) : void 0)
            }
            c || (c = {}, c.module = s, c.name = a, c.state = y, c["export"] = r, c.callbacks = [], p.push(c))
        } catch (e) {
            I("awsc_error", encodeURIComponent(e.message), e.stack)
        }
    }

    function E() {
        t.AWSC || (t.AWSC = {}, t.AWSC.use = T, t.AWSCInner = {}, t.AWSCInner.register = x)
    }
    E()
}(window, document);