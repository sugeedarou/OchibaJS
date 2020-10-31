Element.prototype.getChildren = function () {
    var childNodes = this.childNodes,
        children = [],
        i = childNodes.length;

    while (i--) {
        if (childNodes[i].nodeType == 1) {
            children.unshift(childNodes[i]);
        }
    }

    return children;
}

Element.prototype.remove = function () {
    this.parentNode.removeChild(this);
}

Array.prototype.shuffle = function () {
    this.sort(function () { return 0.5 - Math.random() });
}

OCTimingFunctions = {
    // subset of easing functions by gre: https://gist.github.com/gre/1650294
    linear: function (t) { return t },
    ease: function (t) { return t * t },
    easeOut: function (t) { return t * (2 - t) },
    easeInOut: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
}

class OC {
    constructor(elem, options) {
        if (elem == null) {
            throw 'the given element does not exist'
        }
        this.elem = elem;


        this.prefixes = ['']

        if (typeof options !== 'undefined') {
            if ('enablePrefixes' in options && options.enablePrefixes) {
                this.prefixes = ['', '-webkit-', '-moz-', '-o-']
            }
        }

        if (this.elem.children.length != 0) {
            this.init()
        } else {
            this.initLetters(true)

        }
    }

    init() {
        this.leaves = []
        for (const child of this.elem.children) {
            child.classList.add('leaf')
            this.leaves.push(child)
        }
    }

    initLetters(fixedSize) {
        fixedSize = (fixedSize) ? 'display: inline-block' : '';
        var letters = this.elem.innerHTML.split('');
        var htmlString = '';
        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            var isLeaf = ' class="leaf"';
            if (letter == ' ') {
                letter = '&nbsp;';
                isLeaf = '';
            }
            htmlString += '<span ' + isLeaf + ' style="' + fixedSize + '">' + letter + '</span>';
        }
        this.elem.innerHTML = htmlString;
        this.leaves = this.elem.getElementsByClassName('leaf');
    }


    resetLeafAnimations() {
        for (var i = 0; i < this.leaves.length; i++) {
            this.addPrefixedStyle(this.leaves[i], 'animation', 'none');
        }
    }

    getAnimatedLeafString(animation, delay) {
        return this.getPrefixedStyle('animation', this.getAnimationString({
            speed: animation.speed,
            delay: (animation.delay + delay) || delay,
            timing: animation.timing,
            keyframes: animation.keyframes
        })) + this.getPrefixedStyle('animation-fill-mode', 'forwards');
    }

    animateLeaves(options) {
        options.delay = (typeof options.delay != 'undefined') ? options.delay : 0;
        switch (options.type) {
            case 'linear':
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = options.delay + this.getDelayForTiming(options.timing, i / this.leaves.length, options.speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay)
                }
                break;
            case 'linear-reverse':
                var speed = options.speed / this.leaves.length;
                for (var i = this.leaves.length - 1; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (this.leaves.length - i) / this.leaves.length, options.speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                break;
            case 'mid-out':
                var speed = Math.floor(options.speed / (this.leaves.length * 0.5));
                var mid = this.leaves.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft = mid - 1;
                    var toRight = mid;
                } else {
                    var toLeft = mid - 0.5;
                    var toRight = mid - 0.5;
                }
                for (var i = toRight; i < this.leaves.length; i++) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (i - toRight) / toRight, options.speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                for (var i = toLeft; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (toLeft - i) / toLeft, options.speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                break;
            case 'out-mid':
                var speed = Math.floor(options.speed / (this.leaves.length * 0.5));
                var mid = this.leaves.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft = mid - 1;
                    var toRight = mid;
                } else {
                    var toLeft = mid - 0.5;
                    var toRight = mid - 0.5;
                }
                for (var i = 0; i <= toRight; i++) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, i / toRight, speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                for (var i = this.leaves.length - 1; i >= toLeft; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (this.leaves.length - 1 - i) / toLeft, speed)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                break;
            case 'random':
                var order = this.intRange(0, this.leaves.length - 1);
                order.shuffle();
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = this.getDelayForTiming(options.timing, i / this.leaves.length, options.speed);
                    this.leaves[order[i]].style.cssText += this.getAnimatedLeafString(options.leafAnimation, options.delay + delay);
                }
                break;
        }
        if (typeof options.callback != 'undefined') {
            const timeToComplete = parseInt((options.delay + options.speed
                + options.leafAnimation.delay + options.leafAnimation.speed) * 1000)
            window.setTimeout(options.callback, timeToComplete, this.elem);
        }
    }

    getAnimationAsHTMLString() {
        return this.elem.innerHTML;
    }

    getPrefixedStyle(prop, val) {
        var style = '';
        for (var i = 0; i < this.prefixes.length; i++)
            style += ';' + this.prefixes[i] + prop + ':' + val;
        return style;
    }

    addPrefixedStyle(elem, prop, val) {
        for (var i = 0; i < this.prefixes.length; i++)
            elem.style[this.prefixes[i] + prop] = val;
    }

    getAnimationString(animation) {
        return animation.speed + 's ' + (animation.delay || 0) + 's ' + animation.timing + ' ' + animation.keyframes;
    }


    getDelayForTiming = function (timing, progres, time) {
        return time - OCTimingFunctions[timing](1 - progres) * time;
    }

    intRange = function (start, end) {
        var arr = [];
        for (var i = start; i <= end; i++) {
            arr.push(i);
        }
        return arr;
    }
}

class OCSequence {
    constructor(seqEntries) {
        for (const seqEntry of seqEntries) {
            for (const entry of seqEntry) {
                entry.elem = new OC(entry.elem)
            }
        }
        this.seqEntries = seqEntries
    }
    animate() {
        let total_delay = 0
        for (const seqEntry of this.seqEntries) {
            let maxDelay = 0
            let maxSpeed = 0
            let maxLeafAnimationDelay = 0
            let maxLeafAnimationSpeed = 0
            for (const entry of seqEntry) {
                entry.elem.animateLeaves({
                    delay: total_delay + entry.animationProps.delay,
                    type: entry.animationProps.type,
                    timing: entry.animationProps.timing,
                    leafAnimation: entry.animationProps.leafAnimation,
                    speed: entry.animationProps.speed,
                })
                if (entry.animationProps.delay > maxDelay)
                    maxDelay = entry.animationProps.delay
                if (entry.animationProps.speed > maxSpeed)
                    maxSpeed = entry.animationProps.speed
                if (entry.animationProps.leafAnimation.delay > maxLeafAnimationDelay)
                    maxLeafAnimationDelay = entry.animationProps.leafAnimation.delay
                if (entry.animationProps.leafAnimation.speed > maxLeafAnimationSpeed)
                    maxLeafAnimationSpeed = entry.animationProps.leafAnimation.speed
            }
            total_delay += maxDelay + maxSpeed + maxLeafAnimationDelay + maxLeafAnimationSpeed
        }
    }
}