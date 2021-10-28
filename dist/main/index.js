/*! KID.js
    v1.2.4 (c) soso
    MIT License
    
    (っ◔◡◔)っ ♥ JSkid ♥ https://github.com/Generalsimus/JSkid
*/
(function () {
    function KD_v(v, n, a) {
        return typeof v == "function" ? KD_v(v(n, true, KD_G), n, a) : v;
    }
    Object.defineProperties(Object.prototype, {
        useListener: {
            value: function (PROP, FUNCTION) {
                var descriptor = Object.getOwnPropertyDescriptor(this, PROP), value = this[PROP];
                FUNCTION = FUNCTION.bind(this);
                Object.defineProperty(this, PROP, {
                    get: function () {
                        return value;
                    },
                    set: function (new_v) {
                        if (descriptor.set) {
                            descriptor.set(new_v);
                        }
                        FUNCTION(new_v, PROP, value);
                        value = new_v;
                    }
                });
                return "event";
            }
        }
    });
    function KD_G(REGISTER_NODE) {
        var EXIST_NODES, EXIST_VALUES, EXIST_ATTRIBUTE, EXIST_HTML_NODE, REGISTER_LIST = new Map();
        function get_Values() {
            var REGISTER_VALUE = REGISTER_NODE(register);
            return EXIST_VALUES = REGISTER_VALUE instanceof Array ? REGISTER_VALUE.length ? REGISTER_VALUE : [""] : [REGISTER_VALUE];
        }
        var last_node;
        function map_Cilds(val1, nod2, _index, node_list, value, node) {
            while (value = val1[_index], node = nod2[_index], _index < val1.length || _index < nod2.length) {
                if (value instanceof Array) {
                    node_list[_index] = map_Cilds(value, [].concat(node), 0, []);
                }
                else if (node instanceof Array) {
                    node_list[_index] = map_Cilds([].concat(value), node, 0, [])[0];
                }
                else {
                    if (node) {
                        if (_index < val1.length) {
                            value = KD_v(value, node.parentNode);
                            if (node.KD_OBJECT === value) {
                                node_list[_index] = last_node = node;
                            }
                            else {
                                node_list[_index] = last_node = node.Replace(value);
                            }
                        }
                        else {
                            node.Remove();
                        }
                    }
                    else if (_index < val1.length) {
                        node_list[_index] = last_node = last_node.insert(value, "after");
                    }
                }
                _index++;
            }
            ;
            return node_list;
        }
        function register() {
            return Array.prototype.reduce.call(arguments, function (o, prop) {
                var value = o[prop], registered = REGISTER_LIST.get(o);
                if (registered) {
                    if (registered.indexOf(prop) > -1) {
                        return value;
                    }
                    registered.push(prop);
                }
                else {
                    REGISTER_LIST.set(o, [prop]);
                }
                value = typeof value == "function" ? value.bind(o) : value;
                var descriptor = Object.getOwnPropertyDescriptor(o, prop);
                try {
                    Object.defineProperty(o, prop, {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return value;
                        },
                        set: function (new_v) {
                            value = new_v;
                            if (descriptor.set) {
                                descriptor.set(new_v);
                            }
                            if (EXIST_ATTRIBUTE) {
                                EXIST_HTML_NODE.setAttr(EXIST_ATTRIBUTE, REGISTER_NODE(register));
                            }
                            else {
                                EXIST_NODES = map_Cilds(get_Values(), EXIST_NODES, 0, []);
                            }
                        }
                    });
                }
                catch (e) { }
                return value;
            });
        }
        return function (HTML_NODE, ATTRIBUTE) {
            EXIST_ATTRIBUTE = ATTRIBUTE;
            EXIST_HTML_NODE = HTML_NODE;
            return ATTRIBUTE ? REGISTER_NODE(register) : EXIST_NODES = KD_(null, get_Values());
        };
    }
    var KD_method = {
        getAttr: function (a) {
            return this.getAttribute(a);
        },
        setAttr: function (attribute, value) {
            var i = 1;
            while (attribute = arguments[i - 1]) {
                value = arguments[i];
                typeof value == "function" ? this.setAttr(attribute, value(this, attribute, KD_G)) : KD_method[attribute] ? this[attribute](value, attribute, this) : this.setAttribute(attribute, value);
                i += 2;
            }
            return this;
        },
        Select: function (s) {
            return s instanceof Array ? this.querySelectorAll(s[0]) : this.querySelector(s);
        },
        Child: function (l) {
            var c = this.children;
            return l == undefined ? c : c[l];
        },
        Inner: function (i) {
            if (i == undefined) {
                return this.innerHTML;
            }
            else {
                return "string" == typeof i ? (this.innerHTML = i, this.firstChild) : (this.innerHTML = "", KD_(this, i));
            }
        },
        STYLE: function (o) {
            return o ? KD_.assign(this.style, o) : this.style;
        },
        e: function (s) {
            for (var l in s) {
                l.split("_").forEach(function (v) {
                    this.addEventListener(v, s[l]);
                }.bind(this));
            }
            return this;
        },
        Parent: function (s, z, i) {
            z = this;
            s = s || 0;
            i = 0;
            while (typeof s == "number" && i <= s) {
                z = z.parentNode;
                i++;
            }
            return z;
        },
        NextElement: function (s, z) {
            z = this;
            for (var i = 0; i <= (typeof s == "number" ? s : 0); i++) {
                z = z.nextElementSibling;
            }
            return z;
        },
        PreviousElement: function (s, z) {
            z = this;
            for (var i = 0; i <= (typeof s == "number" ? s : 0); i++) {
                z = z.previousElementSibling;
            }
            return z;
        },
        Append: function (s) {
            return KD_(this, s);
        },
        Remove: function () {
            this.Parent().removeChild(this);
            return this;
        },
        Replace: function (t) {
            t = KD_(null, KD_v(t, this.parentNode));
            this.parentNode.replaceChild(t, this);
            return t;
        },
        insert: function (o, m) {
            switch (m) {
                case "after":
                    var n = this.nextSibling, p = this.Parent();
                    if (n) {
                        m = KD_(null, KD_v(o, p));
                        p.insertBefore(m, n);
                        return m;
                    }
                    else {
                        return p.Append(o);
                    }
                    break;
                case "before":
                    p = this.Parent();
                    m = KD_(null, KD_v(o, p));
                    p.insertBefore(m, this);
                    return m;
                    break;
            }
        },
        Restart: function (v) {
            this.Replace(KD_(null, this.KD_OBJECT));
        }
    };
    window.location.params = {};
    function KD_node(createEl, KD_T_SVG, KD_NODES) {
        function KD_el(r, NODE, created) {
            for (var prop in r) {
                if (NODE) {
                    NODE.setAttr(prop, r[prop]);
                }
                else {
                    if (KD_NODES[prop]) {
                        if (!(NODE = created) && (NODE = KD_NODES[prop](r, prop, createEl, KD_el, KD_T_SVG))) {
                            break;
                        }
                    }
                    else {
                        NODE = createEl(prop);
                    }
                    NODE.KD_OBJECT = r;
                    KD_T(NODE, r[prop]);
                }
            }
            return NODE;
        }
        function KD_type(a) {
            return Object.prototype.toString.call(a).match(/\w+/g)[1];
        }
        function KD_T(p, s, n) {
            switch (KD_type(s)) {
                case "Array":
                    return s.map(function (tag) {
                        return KD_T(p, tag);
                    });
                case "Function":
                    return KD_T(p, s(p, null, KD_G));
                case "Object":
                    n = KD_el(s);
                    break;
                case "Promise":
                    s.then(function (v) {
                        n.Replace(v);
                    });
                    s = "";
                case "Number":
                case "Undefined":
                case "Null":
                case "String":
                case "Boolean":
                case "Date":
                case "RegExp":
                case "BigInt":
                case "Symbol":
                case "Error":
                    n = document.createTextNode(String(s));
                    n.KD_OBJECT = s;
                    break;
                default:
                    n = s;
                    break;
            }
            if (p && n) {
                p.appendChild(n);
            }
            return n;
        }
        return KD_T;
    }
    var KD_NODES = {
        svg: function (r, n, createEl, KD_el, KD_SVG) {
            return KD_SVG ? KD_SVG(null, r) : KD_el(r, undefined, createEl("svg"));
        },
        switch: function (r, prop, createEl, KD_el) {
            return KD_el(r, undefined, createEl("a")).e({
                click: function (e) {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    var event = document.createEvent('Event');
                    event.state = {
                        ID: new Date().getTime()
                    };
                    history.pushState(event.state, document.title, this.getAttr('href'));
                    event.initEvent('popstate', true, true);
                    window.dispatchEvent(event);
                }
            });
        },
        routerBlock: function (r) {
            var tagname = r.tagname || "div", ifemptycomponent = r.ifemptycomponent || "", routerBlock = r.routerBlock, fake_node = KD_(null, ""), exist_node = fake_node, new_r = {};
            new_r[tagname] = [fake_node, routerBlock];
            new_r = KD_.assign(new_r, r);
            delete new_r.tagname;
            delete new_r.ifemptycomponent;
            delete new_r.routerBlock;
            var node = KD_(null, new_r);
            function c_e() {
                var exis_node = exist_node.PreviousElement() || exist_node.NextElement();
                if (exis_node && fake_node != exist_node) {
                    exist_node.Replace(fake_node);
                    exist_node = fake_node;
                }
                else if (!exis_node && fake_node == exist_node) {
                    exist_node.Replace(ifemptycomponent = KD_(null, ifemptycomponent));
                    exist_node = ifemptycomponent;
                }
            }
            window.addEventListener("popstate", c_e);
            c_e();
            return node;
        },
        router: function (r) {
            var to = KD_v(r.path), unic = KD_v(r.unic), component = KD_v(r.component), fake_node = KD_(null, ""), esc_reg = [/[\-{}\[\]+?.,\\\^$|#\s]/g, "\\$&"], to_path = (unic ? [esc_reg, [/:[^\s/]+/g, "([\\w-]+)"]] : [esc_reg, [/\((.*?)\)/g, "(?:$1)?"], [/(\(\?)?:\w+/g, function (match, optional) {
                        return optional ? match : "([^/]+)";
                    }], [/\*\w+/g, "(.*?)"]]).reduce(function (repl, reg) {
                return repl.replace(reg[0], reg[1]);
            }, to), reg = new RegExp(unic ? to_path : "^" + to_path + "$", "i"), NODES = {}, N = function (ID) {
                var loc_path = decodeURI(document.location.pathname), mathch_path = loc_path.match(reg) || [];
                to.replace(/\/:/g, "/").match(reg).forEach(function (v, i) {
                    window.location.params[v] = mathch_path[i];
                });
                return reg.test(loc_path) ? NODES[ID] || (NODES[ID] = KD_(null, component)) : fake_node;
            }, EXIS_NODE = N();
            window.addEventListener("popstate", function (e) {
                var new_node = N((e.state || {}).ID);
                if (EXIS_NODE != new_node) {
                    EXIS_NODE.Replace(new_node);
                    EXIS_NODE = new_node;
                }
            });
            return EXIS_NODE;
        }
    };
    KD_ = KD_node(document.createElement.bind(document), KD_node(function (name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }, undefined, KD_NODES), KD_NODES);
    KD_.render = KD_;
    KD_.style = KD_(document.head, {
        style: ''
    });
    KD_.assign = function () {
        try {
            Object.assign.apply(null, arguments);
        }
        catch (e) {
            for (var i = 1; i < arguments.length; i++) {
                var v = arguments[i];
                for (var p in v) {
                    arguments[0][p] = v[p];
                }
            }
        }
        return arguments[0];
    };
    KD_.createElement = function (nodeName, nodeGen) {
        KD_NODES[nodeName] = function (o, n) {
            return KD_(null, nodeGen(o, n));
        };
    };
    KD_.createAttribute = function (AttributeName, AttributeGen) {
        KD_method[AttributeName] = AttributeGen;
        Node.prototype[AttributeName] = AttributeGen;
    };
    KD_.assign(Node.prototype, KD_method);
})();
//# sourceMappingURL=index.js.map