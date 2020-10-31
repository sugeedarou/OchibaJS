document.addEventListener('DOMContentLoaded', init, false)

function init() {

    let seq = new OCSequence([
        [
            {
                elem: document.getElementById('headline'),
                animationProps: {
                    delay: 0.1,
                    type: 'linear',
                    timing: 'linear',
                    leafAnimation: {
                        speed: 1,
                        delay: 0,
                        timing: 'ease',
                        keyframes: 'headline'
                    },
                    speed: 1,
                }
            },
            {
                elem: document.getElementById('leave-imgs'),
                animationProps: {
                    delay: 0,
                    type: 'random',
                    timing: 'linear',
                    leafAnimation: {
                        speed: 3,
                        delay: 0,
                        timing: 'ease',
                        keyframes: 'leave_imgs'
                    },
                    speed: 1,
                }
            }
        ],
        [{
            elem: document.getElementById('sub_headline'),
            animationProps: {
                delay: 0.1,
                type: 'linear',
                timing: 'linear',
                leafAnimation: {
                    speed: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'sub_headline'
                },
                speed: 1
            }
        }],
        [{
            elem: document.getElementById('example1'),
            animationProps: {
                delay: 0.1,
                type: 'mid-out',
                timing: 'linear',
                leafAnimation: {
                    speed: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'example1'
                },
                speed: 1,
            }
        }],
        [{
            elem: document.getElementById('example2'),
            animationProps: {
                delay: 0.1,
                type: 'linear',
                timing: 'linear',
                leafAnimation: {
                    speed: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'example1'
                },
                speed: 1,
            }
        }],
        [{
            elem: document.getElementById('example3'),
            animationProps: {
                delay: 0.1,
                type: 'linear-reverse',
                timing: 'linear',
                leafAnimation: {
                    speed: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'example1'
                },
                speed: 1,
            }
        }]
    ])
    seq.animate()

    /*let oc = new OC(document.getElementById('headline'))
    oc.animateLeaves({
        delay: 0.1,
        type: 'linear',
        timing: 'linear',
        leafAnimation: {
            speed: 1,
            delay: 0,
            timing: 'ease',
            keyframes: 'headline'
        },
        speed: 1,
        callback: animateSubHeadline
    })*/
}
