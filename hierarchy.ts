/** Interfaces */
interface Element {
    on(eventName: string, fnc: (e: Event) => void);
    off(eventName: string, fnc: (e: Event) => void);
    isVisible: boolean;
    label: string;
    value: string;
    data: any;
}



/* Prototype */

Element.prototype.on = function (e: string, fnc: (e: Event) => void) {
    this.addEventListener(e, fnc, false);
}
Element.prototype.off = function (e: string, fnc: (e: Event) => void) {
    this.removeEventListener(e, fnc, false);
}

Object.defineProperties(Element.prototype, {
    isVisible: {
        get: function () {
            return this._isVisible || false;
        },
        set: function (value: boolean) {
            this._isVisible = value;
            this.style.display = value ? 'block' : 'none';
        }
    },
    label: {
        get: function () {
            return this._label || "";
        },
        set: function (value: string) {
            this._label = value;
            this.innerHTML = value;
        }
    },
    data: {
        get: function () {
            return this._data || false;
        },
        set: function (value: any) {
            this._data = value;
        }
    }
});

/************************************************** */




class HierarchyElements {

    static WhatIsThis(element: Element, root: Element) {
        if (element.tagName in this) {
            this[element.tagName](element, root);
        }
    }



    /** Create Dropdown Element */
    static dropdown(element: Element, root: Element) {
        const el = Helper.init('div');
        el.className = 'comp dropdown';
        el.innerHTML = '<div class="dd-title"><label></label></div><div class="dd-list"><div class="dd-search"><input type="text" /></div><ul></ul></div>';
        const items = element.getElementsByTagName('items')[0].children;
        const title = el.querySelector('.dd-title');
        const list = el.querySelector('.dd-list');
        const listData = list.querySelector('ul');
        for (let i = 0; i < items.length; i++) {
            ((n, li) => {

                li.innerHTML = n.getAttribute('title');
                listData.appendChild(li);
                /** Item Event */
                li.on('click', (ev: any) => {
                    console.log(ev);
                    title.querySelector('label').label = ev.target.label;
                });
            })(items[i], Helper.init('li'));

        }

        title.on('click', (e) => {
            list.isVisible = !list.isVisible;
        });
        title.innerHTML = items[0].getAttribute('title');
        root.appendChild(el);
    }




    /** Create Header Element */
    static header(element: Element, root: Element) {
        const el = Helper.init('h1');
        el.innerHTML = element.textContent;
        root.appendChild(el);
    }

}


class Sections {

    /**
     * 
     * @param sections Get all sections in root
     */
    static getSections(sections: HTMLCollection, root: Element) {
        /** Return If no data */
        if (!sections || sections.length == 0) return;

        /** Run for data */
        for (let i = 0; i < sections.length; i++) {
            const element = sections[i];
            const section = Helper.init('div');
            section.classList.add('flex');
            this.getElementsInSections(element, section);
            root.appendChild(section);
        }
    }


    //----------------------------------------------------------

    /**
     * 
     * @param section Get all elements in section
     */
    static getElementsInSections(section: Element, root: Element) {
        /** Return if no data */
        if (!section) return;
        if (section.children.length == 0) return;

        /** Run for data */
        for (let i = 0; i < section.children.length; i++) {
            const item = section.children[i];
            const wrap = Helper.init('div');
            this.getElementSize(item, wrap);
            this.applyElement(item, wrap);
            root.appendChild(wrap);
        }
    }


    //----------------------------------------------------------


    static getElementSize(item: Element, wrap: HTMLElement) {
        let val = item.getAttribute('size');
        let def = val ? parseInt(val) : 0;
        if (def > 0) {
            wrap.style.flex = def.toString();
        }
    }

    static applyElement(item: Element, root: Element) {
        HierarchyElements.WhatIsThis(item, root);
    }
}


class Helper {

    static init(tagName: string, properties: object = {}): HTMLElement {
        const el = document.createElement(tagName);
        return el;
    }
}

/************************************************************************** */

class Hierarchy {
    constructor() {
        fetch('index.xml')
            .then(function (response) {
                return response
                    .text()
                    .then((str) => {
                        let responseDoc = new DOMParser().parseFromString(str, 'application/xml');
                        let item = responseDoc.getElementsByTagName('page');
                        return item[0];
                    });
            })
            .then(function (xml) {
                const value = Sections.getSections(xml.children, document.querySelector('#root'));
            })
            .catch(function (err) {
                console.log("Something went wrong!", err);
            });
    }
}

/************************************************************************** */

const H = new Hierarchy();