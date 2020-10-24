! function() {
    "use strict";

    function t(t) {
        function n(n) {
            o.size = t.uncompressedSize, n()
        }

        function i(n) {
            o.data ? n() : t.getData(new m, function(t) {
                o.data = t, r = new D(t), n()
            }, null, o.checkCrc32)
        }

        function e(t, n, e, o) {
            i(function() {
                r.readUint8Array(t, n, e, o)
            }, o)
        }
        var r, o = this;
        o.size = 0, o.init = n, o.readUint8Array = e
    }

    function n(t) {
        function n(t) {
            i += t.uncompressedSize || 0, t.children.forEach(n)
        }
        var i = 0;
        return n(t), i
    }

    function i(t, n, e) {
        function r() {
            a++, a < t.children.length ? o(t.children[a]) : n()
        }

        function o(t) {
            t.directory ? i(t, r, e) : (t.reader = new t.Reader(t.data, e), t.reader.init(function() {
                t.uncompressedSize = t.reader.size, r()
            }))
        }
        var a = 0;
        t.children.length ? o(t.children[a]) : n()
    }

    function e(t) {
        var n = t.parent.children;
        n.forEach(function(i, e) {
            i.id == t.id && n.splice(e, 1)
        })
    }

    function r(t, n, i, e, r) {
        function o(t, n, i, e, r) {
            function c() {
                var f = n.children[u];
                f ? t.add(f.getFullname(), f.reader, function() {
                    a += f.uncompressedSize || 0, o(t, f, function() {
                        u++, c()
                    }, e, r)
                }, function(t) {
                    e && e(a + t, r)
                }, {
                    directory: f.directory,
                    version: f.zipVersion
                }) : i()
            }
            var u = 0;
            c()
        }
        var a = 0;
        o(t, n, i, e, r)
    }

    function o(t, n, i, e) {
        function r(t, n) {
            t.isDirectory && t.createReader().readEntries(n), t.isFile && n([])
        }

        function o(t, n, i) {
            r(n, function(n) {
                function r(n) {
                    function i(t) {
                        o(t, n, function() {
                            c++, a()
                        })
                    }
                    n.isDirectory && i(t.addDirectory(n.name)), n.isFile && n.file(function(e) {
                        var r = t.addBlob(n.name, e);
                        r.uncompressedSize = e.size, i(r)
                    }, e)
                }

                function a() {
                    var t = n[c];
                    t ? r(t) : i()
                }
                var c = 0;
                a()
            })
        }
        n.isDirectory ? o(t, n, i) : n.file(function(e) {
            t.addBlob(n.name, e), i()
        }, e)
    }

    function a(t, n, i, e, r, o, a) {
        function c(t, n, i, e, r, o) {
            function f(n) {
                function i(t) {
                    u += n.uncompressedSize || 0, c(t, n, function() {
                        s++, p()
                    }, e, r, o)
                }
                n.directory ? t.getDirectory(n.name, {
                    create: !0
                }, i, r) : t.getFile(n.name, {
                    create: !0
                }, function(t) {
                    n.getData(new zip.FileWriter(t, zip.getMimeType(n.name)), i, function(t) {
                        e && e(u + t, o)
                    }, a)
                }, r)
            }

            function p() {
                var t = n.children[s];
                t ? f(t) : i()
            }
            var s = 0;
            p()
        }
        var u = 0;
        n.directory ? c(t, n, i, e, r, o) : n.getData(new zip.FileWriter(t, zip.getMimeType(n.name)), i, e, a)
    }

    function c(t) {
        t.entries = [], t.root = new d(t)
    }

    function u(t, n, i, e, r) {
        function o() {
            var c = a * l;
            e && e(c, t.size), c < t.size ? t.readUint8Array(c, Math.min(l, t.size - c), function(t) {
                n.writeUint8Array(new Uint8Array(t), function() {
                    a++, o()
                })
            }, r) : n.getData(i)
        }
        var a = 0;
        o()
    }

    function f(t, n, i, e) {
        if (t.directory) return e ? new d(t.fs, n, i, t) : new s(t.fs, n, i, t);
        throw "Parent entry is not a directory."
    }

    function p() {}

    function s(t, n, i, e) {
        var r = this;
        p.prototype.init.call(r, t, n, i, e), r.Reader = i.Reader, r.Writer = i.Writer, r.data = i.data, i.getData && (r.getData = i.getData)
    }

    function d(t, n, i, e) {
        var r = this;
        p.prototype.init.call(r, t, n, i, e), r.directory = !0
    }

    function h() {
        c(this)
    }
    var l = 524288,
        y = zip.TextWriter,
        m = zip.BlobWriter,
        g = zip.Data64URIWriter,
        z = zip.Reader,
        v = zip.TextReader,
        D = zip.BlobReader,
        w = zip.Data64URIReader,
        x = zip.createReader,
        R = zip.createWriter;
    t.prototype = new z, t.prototype.constructor = t, t.prototype.checkCrc32 = !1, p.prototype = {
        init: function(t, n, i, e) {
            var r = this;
            if (t.root && e && e.getChildByName(n)) throw "Entry filename already exists.";
            i || (i = {}), r.fs = t, r.name = n, r.id = t.entries.length, r.parent = e, r.children = [], r.zipVersion = i.zipVersion || 20, r.uncompressedSize = 0, t.entries.push(r), e && r.parent.children.push(r)
        },
        getFileEntry: function(t, e, r, o, c) {
            var u = this;
            i(u, function() {
                a(t, u, e, r, o, n(u), c)
            }, o)
        },
        moveTo: function(t) {
            var n = this;
            if (!t.directory) throw "Target entry is not a directory.";
            if (t.isDescendantOf(n)) throw "Entry is a ancestor of target entry.";
            if (n != t) {
                if (t.getChildByName(n.name)) throw "Entry filename already exists.";
                e(n), n.parent = t, t.children.push(n)
            }
        },
        getFullname: function() {
            for (var t = this, n = t.name, i = t.parent; i;) n = (i.name ? i.name + "/" : "") + n, i = i.parent;
            return n
        },
        isDescendantOf: function(t) {
            for (var n = this.parent; n && n.id != t.id;) n = n.parent;
            return !!n
        }
    }, p.prototype.constructor = p;
    var B;
    s.prototype = B = new p, B.constructor = s, B.getData = function(t, n, i, e) {
        var r = this;
        !t || t.constructor == r.Writer && r.data ? n(r.data) : (r.reader || (r.reader = new r.Reader(r.data, e)), r.reader.init(function() {
            t.init(function() {
                u(r.reader, t, n, i, e)
            }, e)
        }))
    }, B.getText = function(t, n, i, e) {
        this.getData(new y(e), t, n, i)
    }, B.getBlob = function(t, n, i, e) {
        this.getData(new m(t), n, i, e)
    }, B.getData64URI = function(t, n, i, e) {
        this.getData(new g(t), n, i, e)
    };
    var E;
    d.prototype = E = new p, E.constructor = d, E.addDirectory = function(t) {
        return f(this, t, null, !0)
    }, E.addText = function(t, n) {
        return f(this, t, {
            data: n,
            Reader: v,
            Writer: y
        })
    }, E.addBlob = function(t, n) {
        return f(this, t, {
            data: n,
            Reader: D,
            Writer: m
        })
    }, E.addData64URI = function(t, n) {
        return f(this, t, {
            data: n,
            Reader: w,
            Writer: g
        })
    }, E.addFileEntry = function(t, n, i) {
        o(this, t, n, i)
    }, E.addData = function(t, n) {
        return f(this, t, n)
    }, E.importBlob = function(t, n, i) {
        this.importZip(new D(t), n, i)
    }, E.importText = function(t, n, i) {
        this.importZip(new v(t), n, i)
    }, E.importData64URI = function(t, n, i) {
        this.importZip(new w(t), n, i)
    }, E.exportBlob = function(t, n, i) {
        this.exportZip(new m("application/zip"), t, n, i)
    }, E.exportText = function(t, n, i) {
        this.exportZip(new y, t, n, i)
    }, E.exportFileEntry = function(t, n, i, e) {
        this.exportZip(new zip.FileWriter(t, "application/zip"), n, i, e)
    }, E.exportData64URI = function(t, n, i) {
        this.exportZip(new g("application/zip"), t, n, i)
    }, E.importZip = function(n, i, e) {
        var r = this;
        x(n, function(n) {
            n.getEntries(function(n) {
                n.forEach(function(n) {
                    var i = r,
                        e = n.filename.split("/"),
                        o = e.pop();
                    e.forEach(function(t) {
                        i = i.getChildByName(t) || new d(r.fs, t, null, i)
                    }), n.directory || f(i, o, {
                        data: n,
                        Reader: t
                    })
                }), i()
            })
        }, e)
    }, E.exportZip = function(t, e, o, a) {
        var c = this;
        i(c, function() {
            R(t, function(t) {
                r(t, c, function() {
                    t.close(e)
                }, o, n(c))
            }, a)
        }, a)
    }, E.getChildByName = function(t) {
        var n, i, e = this;
        for (n = 0; n < e.children.length; n++)
            if (i = e.children[n], i.name == t) return i
    }, h.prototype = {
        remove: function(t) {
            e(t), this.entries[t.id] = null
        },
        find: function(t) {
            var n, i = t.split("/"),
                e = this.root;
            for (n = 0; e && n < i.length; n++) e = e.getChildByName(i[n]);
            return e
        },
        getById: function(t) {
            return this.entries[t]
        },
        importBlob: function(t, n, i) {
            c(this), this.root.importBlob(t, n, i)
        },
        importText: function(t, n, i) {
            c(this), this.root.importText(t, n, i)
        },
        importData64URI: function(t, n, i) {
            c(this), this.root.importData64URI(t, n, i)
        },
        exportBlob: function(t, n, i) {
            this.root.exportBlob(t, n, i)
        },
        exportText: function(t, n, i) {
            this.root.exportText(t, n, i)
        },
        exportFileEntry: function(t, n, i, e) {
            this.root.exportFileEntry(t, n, i, e)
        },
        exportData64URI: function(t, n, i) {
            this.root.exportData64URI(t, n, i)
        }
    }, zip.fs = {
        FS: h,
        ZipDirectoryEntry: d,
        ZipFileEntry: s
    }, zip.getMimeType = function() {
        return "application/octet-stream"
    }
}();