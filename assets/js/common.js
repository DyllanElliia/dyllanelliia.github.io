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
    // Portrait tooltip: enable HTML, custom class, and match card width
    // Create backdrop blur overlay
    var $backdrop = $('<div class="portrait-tooltip-backdrop"></div>').appendTo('body');

    $('.figure-img[data-toggle="tooltip"]').each(function() {
        var $img = $(this);
        $img.tooltip('dispose').tooltip({
            html: true,
            boundary: 'window',
            template: '<div class="tooltip portrait-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
        // Set tooltip width before it becomes visible to avoid first-show width flash
        $img.on('inserted.bs.tooltip', function() {
            var $card = $img.closest('.card');
            var cardWidth = $card.length ? $card.outerWidth() : $img.outerWidth();
            var tipId = $img.attr('aria-describedby');
            if (tipId && cardWidth) {
                var $tip = $('#' + tipId);
                $tip.css('width', cardWidth + 'px');
                $tip.find('.tooltip-inner').css({'max-width': 'none', 'width': '100%'});
                $img.tooltip('update');
            }
        });
        // Show backdrop blur when tooltip is fully shown
        $img.on('shown.bs.tooltip', function() {
            $backdrop.addClass('active');
        });
        // Hide backdrop blur when tooltip hides
        $img.on('hidden.bs.tooltip', function() {
            $backdrop.removeClass('active');
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
