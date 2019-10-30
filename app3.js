function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function(key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function(key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sliders = [];

var $ = function $(selector) {
    return document.querySelector(selector);
};

var $$ = function $$(selector) {
    return document.querySelectorAll(selector);
};

function toggleMenu(e) {
    var menuClasses = $('nav.menu').classList;

    if (e.key) {
        if (e.keyCode === 27) {
            menuClasses.remove('menu--open');
        }
    } else {
        if (menuClasses.contains('menu--open')) {
            menuClasses.remove('menu--open');
        } else {
            menuClasses.add('menu--open');
        }
    }
}

function toggleSubMenu(e) {
    e.preventDefault();
    var submenu = e.target.parentElement.querySelector('.submenu__dropdown');

    if (submenu.classList.contains('hidden')) {
        $$('.submenu__dropdown').forEach(function(node) {
            return node.classList.add('hidden');
        });
        submenu.classList.remove('hidden');
    } else {
        submenu.classList.add('hidden');
    }
}

function toggleModal(e) {
    var node = e.target.closest('.modal-parent').querySelector('.modal-wpr');
    var video = node.querySelector('video');

    if (node.classList.contains('hidden')) {
        node.classList.remove('hidden');

        if (video) {
            video.play();
        }
    } else {
        node.classList.add('hidden');

        if (video) {
            video.pause();
        }
    }

    video.addEventListener('webkitendfullscreen', function() {
        node.classList.add('hidden');
    }, false);
}

function addToCart(productBox) {
    var articleCode = productBox.querySelector('.product-description__code').innerText;
    console.log('addToCart', articleCode);

    if (articleCode) {
        var item_json = {
            custom1: articleCode
        };
        window.parent.postMessage(window.JSON.stringify({
            type: 'ITEM_POP',
            item: item_json
        }), '*');
    } else {
        console.error('Unable to find article code for product.');
    }
}

var sliderOptions = {
    items: 1,
    autoplay: true,
    preventScrollOnTouch: 'auto',
    swipeAngle: 30,
    onInit: function onInit(info) {
        for (var i = 0; i < info.slideItems.length; i++) {
            var slide = info.slideItems[i];

            if (slide.childNodes.length) {
                if (slide.childNodes[1].classList.contains('primary-feature')) {
                    slide.addEventListener('click', featureFilter.bind(null, 'primary', 'back to school'));
                }

                if (slide.childNodes[1].classList.contains('secondary-feature')) {
                    slide.addEventListener('click', featureFilter.bind(null, 'secondary', 'bbq weekend'));
                }

                slide.addEventListener('click', function(e) {
                    if (e.target.classList.contains('cart-button')) {
                        addToList(e);
                    } else {
                        var productBox = e.target.closest('.product-box');
                        if (!productBox.classList.contains('next-department') && !productBox.classList.contains('promotion')) addToCart(productBox);
                    }
                });
            }
        }

        info.controlsContainer.querySelectorAll('button').forEach(function(node) {
            return node.addEventListener('click', keepCarouselling.bind(null, info));
        });
    },
    controlsText: ["<img src='assets/icons/back.svg'/>", "<img src='assets/icons/next.svg'/>"]

};

function ttt() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function keepCarouselling(info) {
    sliders.forEach(function(slide) {
        if (info.container.id === slide.getInfo().container.id) {
            setTimeout(slide.play, 1);
        }
    });
}

function doubleSliderTransition(info) {
    info.container.querySelector('.tns-slide-active video').currentTime = 0;
}

var addedToList;

window.onload = function() {
    [].forEach.call($$('.slider'), function(el) {
        sliders.push(tns(_objectSpread({
            container: el,
            autoHeight: true
        }, sliderOptions)));
    });
    sliders.forEach(function(slide) {
        if (slide.getInfo().container.parentNode.parentNode.parentNode.parentNode.classList.contains('double')) {
            slide.events.on('transitionStart', doubleSliderTransition);
            window.setTimeout(function() {
                slide.getInfo().container.querySelector('#tns1-item2 video').pause();
                slide.pause();
            }, 15000);
        }
    });
    // event listeners

    $('.menu__trigger').addEventListener('click', toggleMenu);
    $('.menu .menu__dropdown').addEventListener('click', function(e) {
        if (e.target.nodeName == 'UL') {
            toggleMenu(e);
        }
    });
    $('#addToList').addEventListener('click', toggleListMenu);
    $('#list-modal').addEventListener('click', toggleListMenu);

    $$('.submenu__trigger').forEach(function(node) {
        return node.addEventListener('click', toggleSubMenu);
    });
    $$('.submenu__dropdown [data-category]').forEach(function(node) {
        return node.addEventListener('click', function(e) {
            filterProductBoxes(node.dataset.category);
            toggleMenu(e);
        });
    });
    $$('.filter-section form input').forEach(function(node) {
        return node.addEventListener('click', function(e) {
            filterProductBoxes2(e.target.value);
        });
    });
    $('.header__right').addEventListener('keyup', toggleMenu);
    $('.menu__click-away').addEventListener('click', toggleMenu);

    $$('.video-btn').forEach(function(node) {
        return node.addEventListener('click', toggleModal);
    });
    $$('.modal-wpr').forEach(function(node) {
        return node.addEventListener('click', toggleModal);
    });
    $$('.interactive-badge').forEach(function(node) {
        return node.addEventListener('click', toggleModal);
    });
    $$('.expandable').forEach(function(node) {
        return node.addEventListener('click', toggleDescription);
    });
    $$('video').forEach(function(node) {
        return node.addEventListener('click', function(e) {
            return e.stopPropagation();
        });
    });
    $$('.all-offers__section .product-box').forEach(function(node) {
        return node.addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-button')) {
                addToList(e);
            } else {
                var productBox = e.target.closest('.product-box');
                if (!productBox.classList.contains('next-department') && !productBox.classList.contains('promotion')) addToCart(productBox);
            }
        });
    });
    $('#search').addEventListener('keyup', function(e) {
        var query = e.target.value;

        if (e.key === 'Enter') {
            search(e);

            if (window.innerWidth > 1250) {
                e.target.blur();
            }

            e.target.value = query;
        }
    });
    $('.close-icon').addEventListener('mousedown', function() {
        if ($('.categories__section').classList.contains('hidden')) {
            resetInitialView();
        }

        $('#search').value = null;
    });
    $('#search').addEventListener('blur', function(e) {
        return e.target.value = null;
    });
    $$('.product-disclaimer').forEach(function(node) {
        return node.addEventListener('click', toggleDisclaimer);
    });
    addedToList = JSON.parse(window.localStorage.getItem('addedToList'));
    if (!addedToList) addedToList = [];
    else {
        checkAddedToList();
    } // if (window.innerWidth > 628) {
    //   triggerLandingAnimations()
    // }

};


function throttle(cb, interval) {
    var now = Date.now();
    return function() {
        if (now + interval - Date.now() < 0) {
            cb();
            now = Date.now();
        }
    };
}


var videos = document.getElementsByClassName('slider-video');

function videoInViewport() {
    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];

        if (!video.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains('hidden')) {
            checkViewport(video);
        }
    }

    function checkViewport(video) {
        var rect = video.getBoundingClientRect();

        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function addToList(e) {
    var id = e.target.closest('.product-box').id;
    if (!id) return;

    if (!e.target.classList.contains('added')) {
        e.target.classList.add('added');
        addedToList.push(id);
    } else {
        e.target.classList.remove('added');
        addedToList = addedToList.filter(function(ids) {
            return ids != id;
        });
    }

    window.localStorage.setItem('addedToList', JSON.stringify(addedToList));
    checkAddedToList();
}

function checkAddedToList() {
    if (addedToList.length) {
        document.getElementById('addToList').innerHTML = addedToList.length;
    } else {
        document.getElementById('addToList').innerHTML = '0';
    }
}

function toggleListMenu(e) {
    var id = e.target.id;
    if (id != 'addToList' && id != 'list-modal' && id != 'list-close') return;
    var classes = document.getElementById('list-modal').classList;

    if (classes.contains('hidden')) {
        classes.remove('hidden');
        generateListItems();
    } else {
        classes.add('hidden');
        document.getElementById('list-container').innerHTML = null;
    }
}

var categories = $('.categories__section').children;

function triggerLandingAnimations() {
    var categoriesArr = Array.prototype.slice.call(categories);
    categoriesArr = categoriesArr.filter(function(node) {
        return !node.classList.contains('hidden') && !node.classList.contains('all-offers');
    });
    var i = 0;
    setInterval(function() {
        if (i > 0) categoriesArr[i - 1].querySelector('.product-box').classList.remove('active');
        else categoriesArr[categoriesArr.length - 1].querySelector('.product-box').classList.remove('active');
        categoriesArr[i].querySelector('.product-box').classList.add('active');

        if (i === categoriesArr.length - 1) {
            i = 0;
        } else {
            i++;
        }
    }, 2000);
}

function categoriesInViewport() {
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];

        if (!category.classList.contains('hidden') && !category.classList.contains('all-offers')) {
            var rect = category.getBoundingClientRect();

            if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                category.querySelector('.product-box').classList.add('active');
            } else {
                category.querySelector('.product-box').classList.remove('active');
            }
        }
    }
}

var scrollPos = 0;

function showHomeButton() {
    if ($('.all-offers__section').classList.contains('hidden')) {
        return;
    } else {
        var home = document.getElementById('home');

        if (document.body.getBoundingClientRect().top > scrollPos) {
            home.classList.add('active');
        } else {
            home.classList.remove('active');
        }

        scrollPos = document.body.getBoundingClientRect().top;
    }
}

//CHANGED

window.setTimeout(function() {
    triggerLandingAnimations();
}, 25000);
var io = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        }
    });
}, options);
var images = document.querySelectorAll('.lazy');
images.forEach(function(el) {
    io.observe(el);
});
var options = {
    root: null,
    rootMargin: '0px 0px 30px 0px',
    threshold: 0
};

//-----NEW FUNCTIONS-----

document.querySelector('.automo').addEventListener('click', function() {
    document.querySelector('.features__section').classList.add('hidden');
    document.querySelector('#auto').style.display = 'none';
    document.querySelector('#toolshardware').style.display = 'none';
    document.querySelector('#homeessentials').style.display = 'none';
    document.querySelector('#sportsrecreation').style.display = 'none';
    document.querySelector('#outdoorliving').style.display = 'none';
    document.querySelector('#frankid').style.display = 'none';
    document.querySelector('#canvasid').style.display = 'none';
    document.querySelector('#mastercraftid').style.display = 'none';
    document.querySelector('#motomaster').classList.remove('hidden');
    document.querySelector('#garmin').classList.remove('hidden');
    document.querySelector('#dashcamera').classList.remove('hidden');
    document.querySelector('#rearcamera').classList.remove('hidden');
    document.querySelector('#carmats').classList.remove('hidden');
    document.querySelector('#visor').classList.remove('hidden');
    document.querySelector('#foodwarmer').classList.remove('hidden');
    document.querySelector('#deals3').classList.remove('hidden');
});
document.querySelector('.garmin-btn').addEventListener('click', function() {
    document.querySelector('.screen').classList.remove('hidden');
});
document.querySelector('#autodropdown').addEventListener('click', function() {
    document.querySelector('.features__section').classList.add('hidden');
    document.querySelector('#auto').style.display = 'none';
    document.querySelector('#toolshardware').style.display = 'none';
    document.querySelector('#homeessentials').style.display = 'none';
    document.querySelector('#sportsrecreation').style.display = 'none';
    document.querySelector('#outdoorliving').style.display = 'none';
    document.querySelector('#frankid').style.display = 'none';
    document.querySelector('#canvasid').style.display = 'none';
    document.querySelector('#mastercraftid').style.display = 'none';
    document.querySelector('#motomaster').classList.remove('hidden');
    document.querySelector('#garmin').classList.remove('hidden');
    document.querySelector('#dashcamera').classList.remove('hidden');
    document.querySelector('#rearcamera').classList.remove('hidden');
    document.querySelector('#carmats').classList.remove('hidden');
    document.querySelector('#visor').classList.remove('hidden');
    document.querySelector('#foodwarmer').classList.remove('hidden');
    document.querySelector('#deals3').classList.remove('hidden'); // document.querySelector('.menu__dropdown').classList.add('hidden');
});
document.querySelectorAll('.modal-close2').forEach(function(e) {
    e.addEventListener('click', function() {
        document.querySelector('.screen').classList.add('hidden');
        console.log('screenshotclose');
    });
});
$('.menu__click-away').addEventListener('click', function() {
    document.querySelector('.menu__click-away').style.display = 'none';
});
document.querySelectorAll('.menu__click-away').forEach(function(e) {
    e.addEventListener('click', function() {
        this.classList.add('hidden');
        console.log('clickaway');
    });
});
document.querySelector('.cart-button').addEventListener('click', function() {
    document.querySelector('#garmin').classList.remove('hidden');
}); //addtolist

var cartbtn = document.querySelectorAll('.cart-button'),
    count = 0;

cartbtn.onclick = function() {
    count += 1;
    var addtolistbtn = document.getElementById("addToList");
    addtolistbtn.innerHTML = count;
    console.log('+');
};
var cartbtnmoto = document.querySelector('#motocartbtn'),
    count = 0;

cartbtnmoto.onclick = function() {
    cartbtnmoto.classList.add('added');
    count += 1;
    var addtolistbtn = document.getElementById("addToList");
    addtolistbtn.innerHTML = count;
    console.log('+');
};
document.querySelector('.view-all-button').addEventListener('click', function() {
    document.querySelector('.features__section').classList.add('hidden');
    document.querySelector('#auto').style.display = 'none';
    document.querySelector('#toolshardware').style.display = 'none';
    document.querySelector('#homeessentials').style.display = 'none';
    document.querySelector('#sportsrecreation').style.display = 'none';
    document.querySelector('#outdoorliving').style.display = 'none';
    document.querySelector('#frankid').style.display = 'none';
    document.querySelector('#canvasid').style.display = 'none';
    document.querySelector('#mastercraftid').style.display = 'none';
    document.querySelector('#motomaster').classList.add('hidden');
    document.querySelector('#garmin').classList.add('hidden');
    document.querySelector('#deals2').classList.remove('hidden');
    document.querySelector('#redalertdeals-2').classList.remove('hidden');
    document.querySelector('#redalertdeals-3').classList.remove('hidden');
    document.querySelector('#deals1').classList.remove('hidden');
});

document.querySelector('.home-btn').addEventListener('click', function() {
    document.querySelector('.features__section').classList.remove('hidden');
    document.querySelector('#auto').style.display = 'block';
    document.querySelector('#toolshardware').style.display = 'block';
    document.querySelector('#homeessentials').style.display = 'block';
    document.querySelector('#sportsrecreation').style.display = 'block';
    document.querySelector('#outdoorliving').style.display = 'block';
    document.querySelector('#frankid').style.display = 'block';
    document.querySelector('#canvasid').style.display = 'block';
    document.querySelector('#mastercraftid').style.display = 'block';
    document.querySelector('#motomaster').classList.add('hidden');
    document.querySelector('#garmin').classList.add('hidden');
    document.querySelector('#dashcamera').classList.add('hidden');
    document.querySelector('#rearcamera').classList.add('hidden');
    document.querySelector('#garmin').classList.add('hidden');
    document.querySelector('#carmats').classList.add('hidden');
    document.querySelector('#visor').classList.add('hidden');
    document.querySelector('#foodwarmer').classList.add('hidden');
    document.querySelector('#deals3').classList.add('hidden');
    document.querySelector('#deals2').classList.add('hidden');
    document.querySelector('#redalertdeals-2').classList.add('hidden');
    document.querySelector('#redalertdeals-3').classList.add('hidden');
    document.querySelector('#deals1').classList.add('hidden');
});
document.querySelector('.biggestsavings').addEventListener('click', function() {
    document.querySelector('.searchbysavings').classList.remove('hidden');
    console.log('savings');
    document.querySelector('.menu__dropdown').classList.add('hidden');
});
document.querySelectorAll('.modal-close1').forEach(function(e) {
    e.addEventListener('click', function() {
        document.querySelector('.searchbysavings').classList.add('hidden');
        console.log('close');
    });
});

function search(e) {
    var input = document.getElementById("search");

    if (input = "abc") {
        searchProductBoxes(query);
        e.target.previousSibling.previousSibling.value = null;
    } else {
        resetInitialView();
    }
}

document.querySelectorAll('.modal-close1').forEach(function(e) {
    e.addEventListener('click', function() {
        document.querySelector('.searchbysavings').classList.add('hidden');
        console.log('close');
    });
});
document.querySelectorAll('.modal-close2').forEach(function(e) {
    e.addEventListener('click', function() {
        document.querySelector('.popuplist').classList.add('hidden');
        console.log('close');
    });
});
document.querySelectorAll('#addToList').forEach(function(e) {
    e.addEventListener('click', function() {
        document.querySelector('.popuplist').classList.remove('hidden');
        console.log('close');
    });
});

document.querySelector('.menu__trigger').addEventListener('click', toggleMenu);
document.querySelector('.submenu__trigger').addEventListener('click', toggleSubMenu);