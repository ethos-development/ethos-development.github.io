$(function(){
    var body = $('body')[0];
    
    $('#' + body.id + ' #footer_' + body.id + ' a[href*=#]').attr('rel', 'panel_controls');
    
    document.animate = function(){
        return ( (document.location.hash.length > 0) ? 
            $('[href=' + document.location.hash + ']:first').click() : false
        );
    } // END animate
    
    $('[rel=return]').remove();
    
    $('.expandable').each(function(){
         var name = $(this).attr('class').split(' ').filter(function(item){
             return item != 'expandable';
         }).pop();
         
        $(this).before([
            '<a href="#', this.id, '" ',
                'rel="expander" ',
                'name="' + ( (name == undefined) ? null : name ) + '" ',
                'title="click to expand">',
                'Learn more&hellip;',
            '</a>'
        ].join(''));
    }).bind('expand_toggle', function(){
        $(this).slideToggle();
    }); // END .expandable
    
    $('[rel=expander][href*=#]').bind('expand_toggle', function(){
        $(this.hash).add(this).slideToggle();
    }).bind('expand_reset', function(){
        $(this.hash).hide(); $(this).show();
    }).click(function(){
        $('[name=' + this.name + ']:hidden').trigger('expand_toggle')
        $(this).trigger('expand_toggle');

        return false;
    }); // END [rel=expander][href*=#]
    
    $('.panels').each(function(){
        var container = $(this);
        this.panels = container.children('.panel');

        var maxHeight = 0;
        
        this.panels.each(function(){
            this.container = container;
            maxHeight = Math.max($(this).height(), maxHeight);
        });
        
        this.panels.height(
            maxHeight
        ).bind('panel_activate', function(){
            $(this).siblings().andSelf().hide();
            $(this).fadeIn();
        });
        
        this.panels.not(':first').hide();
    });
    
    $('.panel_controls').each(function(){
        var container = this;
        
        this.controls = $(container).find('a[href^=#]');
        
        this.controls.each(function(){
            this.container = container;
            this.siblings  = container.controls;
        }).click(function(){
            this.siblings.removeClass('active');
            $(this).addClass('active');
        });
    })
    
    $('.panel_controls a[href^=#], a[rel=panel_controls][href*=#]').click(function(){
        $(this.hash).trigger(
            'panel_activate'
        ).find('[rel=expander]').trigger(
            'expand_reset'
        );
        return false;
    }); // END panel_controls

    $('input[title], textarea[title]').each(function(){
        $(this).val(
            this.title
        ).toggleClass(
            'greyed'
        ).focus(function(){
            if ( $(this).val() == this.title ) 
            {
                $(this).val('').toggleClass('greyed');
            }
        }).blur(function(){
            if ( !$(this).val() ) 
            {
                $(this).val(
                    this.title
                ).toggleClass('greyed');
            }
        });
    }); // END [title] input,textarea
    
    $('.modal').bind('modal_cancel', function(){
        $(this).siblings('.modal_bg').andSelf().fadeOut();
    }).bind('modal_activate', function(Event, position){
        var modal = $(this)
        
        modal.css(position).siblings('.modal_bg').fadeIn(function(){
            modal.fadeIn();
        });
    }); // END .modal
    
    $('.modal_bg').css({
        'opacity': 0.80
    }).click(function(){
        $(this).siblings('.modal').trigger('modal_cancel');
    }); // END .modal_bg
    
    $('a[rel=cancel][href*=#modal]').click(function(){
        return !$(this.hash).trigger('modal_cancel');
    }); // END a[rel=cancel][href*=#modal]
    
    $('a[rel=modal][href*=#]').click(function(){
        var modal = $(this.hash);
        var modal_bg = $('.modal_bg');
        
        var offset = {
            modal_bg : modal_bg.offset(),
            element  : $(this).offset()
        } // END position
        
        var size = {
            modal : {
                width  : modal.width(),
                height : modal.height()
            },
            modal_bg : {
                width  : modal_bg.width(),
                height : modal_bg.height()
            },
            element : {
                width  : $(this).width(),
                height : $(this).height()
            }
        } // END size
        
        var position = { top: offset.element.top }

        if ( offset.element.top > size.modal.height / 2 )
        {
            position.top = offset.element.top - offset.modal_bg.top - size.modal.height + size.element.height;
        }

        return !modal.trigger('modal_activate', position);
    }); // END a[rel=modal]
    
    $('a[rel=external]').click(function(){
        window.open(this.href);
        return false;
    }); // END a[rel=external]
    
    $('a[title]').hover(function(event){
        var element = $(this);
        
        element.bottom = element.offset()['top'] + element.height();
        
        element.after(
            '<div style="display:none;" class="title_hover">' + $(this).attr('title') + '</div>'
        ).attr('title', null);
        
        element.hover = element.next('.title_hover').css({
            'top': ( (event.pageY > element.bottom) ? event.pageY : element.bottom ) + 10,
            'left': event.pageX
        }).fadeIn();
        
        $().mousemove(function(event){
            element.hover.css({
               'left': event.pageX
            });
        });
    }, function(){
        $().unbind('mousemove');
        
        $(this).attr('title', 
            $(this).next('.title_hover').text()
        ).next('.title_hover').fadeOut(function(){
            return $(this).remove();
        });
    }); // END a[title]

    document.animate();
});