class HierarchyJS {

    protected name:string = "hello";

    constructor() {
        var n: Element;
        var customer:string = "asd";
        while (n = document.querySelector('[condition]')) {
            this.getCondition(n);
            n.removeAttribute('condition');
        }
    }


    getCondition(item: Element) {
        const reg = /for\s(\w+)\sin\s(\w+)/;
        const prop: string = item.getAttribute('condition');
        const match = prop.match(reg);
        if (match) {

        }
    }

}

window['HierarchyJS'] = new HierarchyJS();

