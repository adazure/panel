/* Prototype */
Element.prototype.on = function (e, fnc) {
    this.addEventListener(e, fnc, false);
};
Element.prototype.off = function (e, fnc) {
    this.removeEventListener(e, fnc, false);
};
var ElementProto = {
    isVisible: function (e, value) { e.style.display = value ? 'block' : 'none'; },
    label: function (e, value) { e.innerHTML = value; },
    data: function (e, value) { e.innerHTML = value; },
    size: false
};
Object.keys(ElementProto).forEach(function (key) {
    Object.defineProperty(Element.prototype, key, {
        get: function () {
            return this["_" + key];
        },
        set: function (value) {
            this["_" + key] = value;
            var ey = ElementProto[key];
            if (typeof ey === 'function') {
                ey(this, value);
            }
        }
    });
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
        var el = Helper.init("div");
        el.className = "comp dropdown";
        el.innerHTML =
            '<div class="dd-title"><label></label></div><div class="dd-list"><div class="dd-search"><input type="text" /></div><ul></ul></div>';
        var items = element.getElementsByTagName("items")[0].children;
        var title = el.querySelector(".dd-title");
        var list = el.querySelector(".dd-list");
        var listData = list.querySelector("ul");
        for (var i = 0; i < items.length; i++) {
            var li = Helper.init("li");
            li.innerHTML = items[i].getAttribute("label");
            li.label = li.innerHTML;
            li.data = items[i].getAttribute("data");
            listData.appendChild(li);
            /** Item Event */
            li.on("click", function (ev) {
                title.querySelector("label").label = ev.target.label;
                list.isVisible = false;
            });
        }
        title.on("click", function (e) {
            list.isVisible = !list.isVisible;
        });
        title.querySelector("label").innerHTML = items[0].getAttribute("label");
        root.appendChild(el);
    };
    /** Create Header Element */
    HierarchyElements.header = function (element, root) {
        var el = Helper.init("h1");
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
            var section = Helper.init("div");
            section.classList.add("flex");
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
            var wrap = Helper.init("div");
            this.getElementSize(item, wrap);
            this.applyElement(item, wrap);
            root.appendChild(wrap);
        }
    };
    //----------------------------------------------------------
    Sections.getElementSize = function (item, wrap) {
        var val = item.getAttribute("size");
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
    Helper.forInit = function (els) {
    };
    return Helper;
}());
/************************************************************************** */
var Hierarchy = /** @class */ (function () {
    function Hierarchy() {
        fetch("index.xml")
            .then(function (response) {
            return response.text().then(function (str) {
                var responseDoc = new DOMParser().parseFromString(str, "application/xml");
                var item = responseDoc.getElementsByTagName("page");
                return item[0];
            });
        })
            .then(function (xml) {
            var value = Sections.getSections(xml.children, document.querySelector("#root"));
        })["catch"](function (err) {
            console.log("Something went wrong!", err);
        });
    }
    return Hierarchy;
}());
/************************************************************************** */
var H = new Hierarchy();
