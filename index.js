var examples = [
    {
        isLetters: true,
        leaf: null,
        attributes: {
        speed: 1000,
        timing: 'linear',
            animation: {
                speed: 0.2,
                timing: 'ease',
                name: 'animation1'
            },
            animationType: 'linear'
        }
    },
    {
        isLetters: false,
        leaf: null,
        attributes: {
            speed: 1000,
            timing: 'easeInOutQuad',
            animation: {
                speed: 1,
                timing: 'ease',
                name: 'animation2'
            },
            animationType: 'linear'
        }
    },
    {
        isLetters: false,
        leaf: null,
        attributes: {
            speed: 1000,
            timing: 'linear',
            animation: {
                speed: 1,
                timing: 'ease',
                name: 'animation3'
            },
            animationType: 'linear'
        }
    },
    {
        isLetters: true,
        leaf: null,
        attributes: {
            speed: 1000,
            timing: 'linear',
            animation: {
                speed: 1,
                timing: 'ease',
                name: 'animation4'
            },
            animationType: 'linear'
        }
    },
    {
        isLetters: true,
        leaf: null,
        attributes: {
            speed: 1000,
            timing: 'linear',
            animation: {
                speed: 1,
                timing: 'ease',
                name: 'animation5'
            },
            animationType: 'random'
        }
    }
];

function init() {
    
    /*var leaf = new LeafJS(document.getElementById('title'));
    leaf.initLetters();
    leaf.animateLeafs({
        speed: 1000,
        timing: 'linear',
        animation: {
            speed: 1,
            timing: 'ease',
            name: 'animation0'
        },
        animationType: 'random'
    });
    console.log(leaf.getAnimationAsHTMLString());*/
    
    var exampleElem = document.getElementById('examples').getElementsByClassName('play');
    for (var i=0; i<exampleElem.length; i++) {
        var elem = exampleElem[i];
        elem.onclick = function(e) {
            var elem = e.target;
            var parent = elem.parentNode;
            var exampleId = parent.id[parent.id.length-1];
            var example = examples[exampleId];
            if (example.leaf == null) {
                example.leaf = new LeafJS(parent.getElementsByClassName('animated')[0]);
                if (example.isLetters) {
                    example.leaf.initLetters(true);
                }else {
                    example.leaf.init();
                }
            }
            example.leaf.resetLeafs();
            window.setTimeout(function() {
                example.leaf.animateLeafs(example.attributes);
            }, 10);
        }
    }
}

document.addEventListener('DOMContentLoaded', init, false);
