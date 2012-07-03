var vega_$ = jQuery.noConflict(true);

const DEFAULT_FORMAT = '[Fixes #%(id)s] %(title)s';
const SETTING_SELECTOR = 'input';

function load_options()
{
  var format = localStorage['format'];
  if (format == undefined)
    format = DEFAULT_FORMAT;

  var el_format = vega_$('#input_format');
  el_format.val(format);
  el_format.removeClass('loading').addClass('loaded');

  el_format.change(save_options);
  vega_$(SETTING_SELECTOR).keyup(save_options).change(save_options).keydown(save_options)
      .keydown(function(e) {
        // 83 == S
        if (e.keyCode == 83 && e.ctrlKey)
          e.preventDefault();
        else if (e.charCode == 0)
          return;

        save_options(e, true);
      });
}

function save_options(evt, force)
{
  if (force == undefined)
    force = false;

  var last_value = localStorage['format'];
  var el_format = vega_$('#input_format');

  if (force || last_value != el_format.val())
  {
    localStorage['format'] = el_format.val();
    show_save_notification();
  }
}

function show_save_notification()
{
  var save_notification = vega_$('#save_notification');
  save_notification.stop(true, true).effect('highlight', {}, 2000).fadeOut();
}
