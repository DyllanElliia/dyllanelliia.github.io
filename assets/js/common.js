// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()
    // Portrait tooltip: enable HTML, custom class, and match portrait width
    $('.figure-img[data-toggle="tooltip"]').each(function() {
        var $img = $(this);
        $img.tooltip('dispose').tooltip({
            html: true,
            template: '<div class="tooltip portrait-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
        // Set tooltip width to match the portrait container
        $img.on('shown.bs.tooltip', function() {
            var imgWidth = $img.outerWidth();
            var tipId = $img.attr('aria-describedby');
            if (tipId && imgWidth) {
                var $tip = $('#' + tipId);
                $tip.css('width', imgWidth + 'px');
                $tip.find('.tooltip-inner').css({'max-width': 'none', 'width': '100%'});
                $img.tooltip('update');
            }
        });
    });

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
})
