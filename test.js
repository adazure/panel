const HierarchyJS = (function HierarchyJS() {
    var ____DATA = {};

    /** Constructor */
    const that = HierarchyJS;


    function isArray(value) {
        return value && typeof value === 'object' && value.constructor === Array;
    }

    function isObject(value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    that.data = function (name, value) {
        var result = "";
        if (!____DATA[name]) {
            Object.defineProperty(____DATA, name, {
                get: function () {
                    return result;
                },
                set: function (val) {
                    result = val;
                }
            });
        }

        ____DATA[name] = typeof value !== undefined ? checkProperty(value, ____DATA[name]) : result;


        window.result = ____DATA;
    }


    /********************************************************** */

    function addRequired(root, oldData) {
        if (oldData) {
            addProperty(root, '__target__', oldData.__target__);
        }

        return root;
    }

    function checkProperty(value, oldData) {
        if (isArray(value)) {
            return arrayProperty(addRequired([], oldData), value);
        }
        else if (isObject(value)) {
            return objProperty(addRequired({}, oldData), value);
        }
        else {
            return value;
        }
    }

    function arrayProperty(root, value) {
        for (var i = 0; i < value.length; i++) {
            var result = checkProperty(value[i]);
            root.push(result);
            addProperty(root, i, result);
        }
        return root;
    }

    function objProperty(root, value) {
        Object.keys(value).forEach(function (key) {
            var result = checkProperty(value[key]);
            root[key] = result;
            addProperty(root, key, result);
        });
        return root;
    }

    function addProperty(root, key, value) {
        Object.defineProperty(root, key, {
            get: function () { return value; },
            set: function (val) { value = checkProperty(val, value); }
        });
    }

    function addTargetProperty(root, item) {
        let _target = item;
        Object.defineProperty(root, '__target__', {
            get: function () {
                return _target;
            },
            set: function (val) {
                _target = val;
            }
        });
    }


    /********************** CONDITIONS ******************** */
    function findValueInData(data, name) {
        if (!data) return data;
        let query = name.split('.');
        let cache = data;
        for (var i = 1; i < query.length; i++) {
            cache = cache[query[i]];
        }
        return cache;
    }
    function conditionHTMLParse(item, name, data) {
        let reg = new RegExp(name + "\\..*?[^\"]+", 'g');
        let match = item.innerHTML.match(reg);
        let values = {};
        if (match) {
            for (var i = 0; i < match.length; i++) {
                let value = values[match[i]] || (values[match[i]] = findValueInData(data, match[i]));
                item.innerHTML = item.innerHTML.replace(match[i], value);
            }
        }

    }
    function conditions(item) {
        let reg = /(\w+)\sin\s(\w+)/;
        let prop = item.getAttribute('condition');
        let match = prop.match(reg);
        //let clone = item.cloneNode(true);
        if (match) {
            that.data(match[2], []);
            let name = match[1];
            let data = ____DATA[match[2]];
            if (data) {
                console.log(data);
                conditionHTMLParse(item, name, data);
                addTargetProperty(data, item);
            }
        }

    }

    conditions(document.querySelector('[condition]'));






















    // function arrayProperty(root, value) {
    //     for (var i = 0; i < value.length; i++) {
    //         if (isArray(value[i])) {
    //             root.push(arrayProperty([], value[i]));
    //         }
    //         else if (isObject(value[i])) {
    //             root.push(objectProperty({}, value[i]));
    //         } else {
    //             property(root, i, value[i]);
    //         }
    //     }

    //     return root;
    // }

    // function objectProperty(root, value) {

    //     Object.keys(value).forEach(function (key) {
    //         if (isArray(value[key])) {
    //             property(root, key, arrayProperty([], value[key]));
    //         }
    //         else if (isObject(value[key])) {
    //             property(root, key, objectProperty({}, value[key]));
    //         }
    //         else {
    //             property(root, key, value[key]);
    //         }
    //     });
    //     return root;
    // }

    // function property(root, name, value) {
    //     root[name] = value;
    //     Object.defineProperty(root, name, {
    //         get: function () {
    //             return value;
    //         },
    //         set: function (val) {
    //             value = val;
    //             console.log('değiştirildi');
    //         }
    //     })
    //     return root;
    // }


    /** Return Constructor */
    return that;
})();
