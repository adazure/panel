/* Prototype */
Element.prototype.on = function (e, fnc) {
    this.addEventListener(e, fnc, false);
};
Element.prototype.off = function (e, fnc) {
    this.removeEventListener(e, fnc, false);
};
Object.defineProperties(Element.prototype, {
    isVisible: {
        get: function () {
            return this._isVisible || false;
        },
        set: function (value) {
            this._isVisible = value;
            this.style.display = value ? 'block' : 'none';
        }
    },
    label: {
        get: function () {
            return this._label || "";
        },
        set: function (value) {
            this._label = value;
            this.innerHTML = value;
        }
    },
    data: {
        get: function () {
            return this._data || false;
        },
        set: function (value) {
            this._data = value;
        }
    }
});
/************************************************** */
var HierarchyElements = /** @class */ (function () {
    function HierarchyElements() {
    }
    HierarchyElements.WhatIsThis = function (element, root) {
        if (element.tagName in this) {
            this[element.tagName](element, root);
        }
    };
    /** Create Dropdown Element */
    HierarchyElements.dropdown = function (element, root) {
        var el = Helper.init('div');
        el.className = 'comp dropdown';
        el.innerHTML = '<div class="dd-title"><label></label></div><div class="dd-list"><div class="dd-search"><input type="text" /></div><ul></ul></div>';
        var items = element.getElementsByTagName('items')[0].children;
        var title = el.querySelector('.dd-title');
        var list = el.querySelector('.dd-list');
        var listData = list.querySelector('ul');
        for (var i = 0; i < items.length; i++) {
            (function (n, li) {
                li.innerHTML = n.getAttribute('title');
                listData.appendChild(li);
                /** Item Event */
                li.on('click', function (ev) {
                    console.log(ev);
                    title.querySelector('label').label = ev.target.label;
                });
            })(items[i], Helper.init('li'));
        }
        title.on('click', function (e) {
            list.isVisible = !list.isVisible;
        });
        title.innerHTML = items[0].getAttribute('title');
        root.appendChild(el);
    };
    /** Create Header Element */
    HierarchyElements.header = function (element, root) {
        var el = Helper.init('h1');
        el.innerHTML = element.textContent;
        root.appendChild(el);
    };
    return HierarchyElements;
}());
var Sections = /** @class */ (function () {
    function Sections() {
    }
    /**
     *
     * @param sections Get all sections in root
     */
    Sections.getSections = function (sections, root) {
        /** Return If no data */
        if (!sections || sections.length == 0)
            return;
        /** Run for data */
        for (var i = 0; i < sections.length; i++) {
            var element = sections[i];
            var section = Helper.init('div');
            section.classList.add('flex');
            this.getElementsInSections(element, section);
            root.appendChild(section);
        }
    };
    //----------------------------------------------------------
    /**
     *
     * @param section Get all elements in section
     */
    Sections.getElementsInSections = function (section, root) {
        /** Return if no data */
        if (!section)
            return;
        if (section.children.length == 0)
            return;
        /** Run for data */
        for (var i = 0; i < section.children.length; i++) {
            var item = section.children[i];
            var wrap = Helper.init('div');
            this.getElementSize(item, wrap);
            this.applyElement(item, wrap);
            root.appendChild(wrap);
        }
    };
    //----------------------------------------------------------
    Sections.getElementSize = function (item, wrap) {
        var val = item.getAttribute('size');
        var def = val ? parseInt(val) : 0;
        if (def > 0) {
            wrap.style.flex = def.toString();
        }
    };
    Sections.applyElement = function (item, root) {
        HierarchyElements.WhatIsThis(item, root);
    };
    return Sections;
}());
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.init = function (tagName, properties) {
        if (properties === void 0) { properties = {}; }
        var el = document.createElement(tagName);
        return el;
    };
    return Helper;
}());
/************************************************************************** */
var Hierarchy = /** @class */ (function () {
    function Hierarchy() {
        fetch('index.xml')
            .then(function (response) {
            return response
                .text()
                .then(function (str) {
                var responseDoc = new DOMParser().parseFromString(str, 'application/xml');
                var item = responseDoc.getElementsByTagName('page');
                return item[0];
            });
        })
            .then(function (xml) {
            var value = Sections.getSections(xml.children, document.querySelector('#root'));
        })["catch"](function (err) {
            console.log("Something went wrong!", err);
        });
    }
    return Hierarchy;
}());
/************************************************************************** */
var H = new Hierarchy();
