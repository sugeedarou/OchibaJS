Element.prototype.getChildren = function() {
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

Element.prototype.remove = function() {
    this.parentNode.removeChild(this);
}

Array.prototype.shuffle = function() {
    this.sort(function() { return 0.5 - Math.random() });
}

LJSL = {}; // = Leaf JS Library

LJSL.prefixes = ['', '-webkit-', '-moz-', '-o-'];

LJSL.getPrefixedStyle = function(prop, val) {
    var style = '';
    for (var i=0; i<LJSL.prefixes.length; i++)
        style += ';'+LJSL.prefixes[i] + prop +':'+ val;
    return style;
}

LJSL.addPrefixedStyle = function(e, prop, val) {
    for (var i=0; i<LJSL.prefixes.length; i++)
        e.style[LJSL.prefixes[i] + prop] = val;   
}

LJSL.addPrefixedEvent = function(e, event, funct) {
    for (var i=0; i<LJSL.prefixes.length; i++)
        e.addEventListener(LJSL.prefixes[i] + prop, funct);   
}

LJSL.Animation = function(speed, timing, delay, name) {
    this.speed  = speed;
    this.timing = timing;
    this.delay  = delay;
    this.name   = name;
}

LJSL.getAnimationString = function(animation) {
    return animation.speed +'s '+ (animation.delay || 0) +'s '+ animation.timing +' '+ animation.name;
}

LJSL.timingFunctions = {
    // easing functions by gre: https://gist.github.com/gre/1650294
    linear: function (t) { return t },
    easeInQuad: function (t) { return t*t },
    easeOutQuad: function (t) { return t*(2-t) },
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    easeInCubic: function (t) { return t*t*t },
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    easeInQuart: function (t) { return t*t*t*t },
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    easeInQuint: function (t) { return t*t*t*t*t },
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
    
LJSL.getDelayForTiming = function(timing, progres, time) {
    return time-LJSL.timingFunctions[timing](1-progres) * time;
}

LJSL.intRange = function(start, end) {
    var arr = [];
    for (var i=start; i<=end; i++) {
        arr.push(i);
    }
    return arr;
}

function LeafJS(e) {
    
    this.elem = e;
    
    this.init = function(fixedSize) {
        this.leafs = e.getChildren();
        if (typeof fixedSize != 'undefined') {
            for (var i=0; i<this.leafs.length; i++) {
                htmlString.display = 'inline-block';
            }
        }
    }
    
    this.initLetters = function(fixedSize) {
        var style = '';
        fixedSize = (fixedSize) ? 'display: inline-block' : '';
        var letters = e.innerHTML.split('');
        var htmlString = '';
        for (var i=0; i<letters.length; i++) {
            var letter = letters[i];
            var isLeaf = ' class="leaf"';
            if (letter == ' ') {
                letter = '&nbsp;';
                isLeaf = '';
            }
            htmlString += '<span '+isLeaf+' style="'+fixedSize+'">'+ letter +'</span>';
        }
        this.elem.innerHTML = htmlString;
        this.leafs = e.getElementsByClassName('leaf');
    }
    
    this.resetLeafs = function() {
        for (var i=0; i<this.leafs.length; i++) {
            LJSL.addPrefixedStyle(this.leafs[i], 'animation', 'none');   
        }
    }
    
    this.getAnimatedLeafString = function(i, animation, delay) {
        delay *= 0.001;
        return LJSL.getPrefixedStyle('animation', LJSL.getAnimationString(new LJSL.Animation(
                animation.speed, animation.timing,
                (animation.delay + delay) || delay,
                animation.name
            )))
            +LJSL.getPrefixedStyle('animation-fill-mode', 'forwards');
    }
    
    this.animateLeafs = function(options) {
        var animationDelay = (typeof options.delay != 'undefined') ? options.delay : 0;
        switch(options.animationType) {
            case 'all':
                for (var i=0; i<this.leafs.length; i++) {
                    this.leafs[i].style.cssText = this.getAnimatedLeafString(i, options.animation, animationDelay);   
                }
                break;
            case 'linear':
                for (var i=0; i<this.leafs.length; i++) {
                    var delay = LJSL.getDelayForTiming(options.timing, i/this.leafs.length, options.speed);
                    this.leafs[i].style.cssText = this.getAnimatedLeafString(i, options.animation, animationDelay + delay);   
                }
                break;
            case 'linear-reverse':
                var speed = options.speed / this.leafs.length;
                for (var i=this.leafs.length ; i>=0; i--) {
                    this.leafs[i].style.cssText = this.getAnimatedLeafString(i, options.animation, animationDelay + LJSL.getDelayForTiming(options.timing, (this.leafs.length - i)/this.leafs.length, options.speed));   
                }
                break;
            case 'mid-out':
                var speed = Math.floor(options.speed / (this.leafs.length * 0.5));
                var mid = this.leafs.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft  = mid -1;
                    var toRight = mid;
                }else {
                    var toLeft  = mid-0.5;
                    var toRight = mid-0.5;
                }
                for (var i=toRight; i<this.leafs.length; i++) {
                    this.getAnimatedLeafString(i, options.animation, LJSL.getDelayForTiming(options.timing, (i-toRight)/toRight, options.speed));   
                }
                for (var i=toLeft ; i>=0; i--) {
                    this.getAnimatedLeafString(i, options.animation, LJSL.getDelayForTiming(options.timing, (toLeft-i)/toLeft, options.speed));   
                }
                break;
            case 'out-mid':
                var speed = Math.floor(options.speed / (this.leafs.length * 0.5));
                var mid = this.leafs.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft  = mid -1;
                    var toRight = mid;
                }else {
                    var toLeft  = mid-0.5;
                    var toRight = mid-0.5;
                }
                for (var i=0; i<= toRight; i++) {
                    this.leafs[i].style.cssText = this.getAnimatedLeafString(i, options.animation, animationDelay + LJSL.getDelayForTiming(options.timing, i/toRight, speed));   
                }
                for (var i=this.leafs.length - 1 ; i>=toLeft; i--) {
                    this.leafs[i].style.cssText = this.getAnimatedLeafString(i, options.animation, animationDelay + LJSL.getDelayForTiming(options.timing, (this.leafs.length -1-i)/toLeft, speed));   
                }
                break;
            case 'random':
                var order = LJSL.intRange(0, this.leafs.length-1);
                order.shuffle();
                for (var i=0; i<this.leafs.length; i++) {
                    var delay = LJSL.getDelayForTiming(options.timing, i/this.leafs.length, options.speed);
                    this.leafs[order[i]].style.cssText = this.getAnimatedLeafString(order[i], options.animation, animationDelay + delay);
                }
                break;
        }
        if (typeof options.callback != 'undefined') {
            window.setTimeout(options.callback, options.speed, e);   
        }
    }
    
    this.getAnimationAsHTMLString = function() {
        return this.elem.innerHTML;
    }
}
