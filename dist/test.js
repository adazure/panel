var HierarchyJS = /** @class */ (function () {
    function HierarchyJS() {
        this.name = "hello";
        var n;
        var customer = "asd";
        while (n = document.querySelector('[condition]')) {
            this.getCondition(n);
            n.removeAttribute('condition');
        }
    }
    HierarchyJS.prototype.getCondition = function (item) {
        var reg = /for\s(\w+)\sin\s(\w+)/;
        var prop = item.getAttribute('condition');
        var match = prop.match(reg);
        if (match) {
        }
    };
    return HierarchyJS;
}());
window['HierarchyJS'] = new HierarchyJS();
