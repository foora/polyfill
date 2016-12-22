(function () {
    if (document.getElementsByTagName('HTML')[0].classList) return; // 原生API支持的话，不进行hack
    // 在DOM元素的原型链上进行hack
    var ep = HTMLElement.prototype ? HTMLElement.prototype : (Element.prototype ? Element.prototype : null);
    if (!ep) return; // 一般不会取不到DOM元素父类的原型，但是还是做检查，防止程序死掉。
    // 创建classList类
    var ClassList = function (elem) {
            var List = (function () {
                var trimStr = elem.className.replace(/^\s+|\s+$/g, '');
                return trimStr ? trimStr.split(/\s+/) : [];
            }());
            for (var i = 0; i < List.length; i++) {
                this.push(List[i]);
            }
            // 更新className
            this._updateClass = function () {
                    elem.className = this.join(" ");
                }
                // 检验class是否符合要求
            this._checkClass = function (name) {
                if (!name && typeof (name) !== "string") return false; // 空或者非字符串
                if (/\s+/.test(name)) return false; // 存在空白字符
                return true
            }
        }
        // 设置classList的初始值
    ClassList.prototype = [];

    // classList类contains方法
    ClassList.prototype.contains = function (name) {
        return this.indexOf(name) !== -1;
    }

    // classList类item方法
    ClassList.prototype.item = function (index) {
        return this[index] || null;
    }

    // classList类add方法
    ClassList.prototype.add = function () {
        var classes = arguments,
            update = false,
            len = classes.length,
            i = 0;
        for (; i < len; i++) {
            var item = classes[i];
            if (this._checkClass(item) && this.indexOf(item) === -1) {
                this.push(item);
                update = true;
            }
        }
        if (update) this._updateClass();
    }

    // classList类remove方法
    ClassList.prototype.remove = function () {
        var classes = arguments,
            update = false;
        len = classes.length,
            i = 0;
        for (; i < len; i++) {
            var item = classes[i];
            var index = this.indexOf(item);
            if (this._checkClass(item) && index !== -1) {
                this.splice(index, 1);
                update = true;
            }
        }
        if (update) this._updateClass();
    }

    // classList类toggle方法
    ClassList.prototype.toggle = function (name) {
        if (!this._checkClass(name)) return;
        var index = this.indexOf(name);
        if (index === -1) {
            this.push(name);
        } else {
            this.splice(index, 1);
        }
        this._updateClass();
    }

    var classListGetter = function () {
        return new ClassList(this);
    }
    if (Object.defineProperty) {
        var propDesc = {
            get: classListGetter,
            enumerable: true,
            configurable: true
        }
        try {
            Object.defineProperty(ep, "classList", propDesc)
        } catch (e) {
            if (e.number === -0x7FF5EC54) {
                propDesc.enumerable = false;
                Object.defineProperty(ep, "classList", propDesc)
            }
        }
    } else if (Object.prototype.__defineGetter__) {
        ep.__defineGetter__("classList", classListGetter);
    }

}());