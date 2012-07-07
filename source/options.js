var vega_$ = jQuery.noConflict(true);

const DEFAULT_FORMAT = '[Fixes #%(id)s] %(title)s';
const DEFAULT_SHORTCUT = 'ctrl+q';
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
  
  var shortcut = localStorage['shortcut']
  if (shortcut == undefined)
    shortcut = DEFAULT_SHORTCUT;
  
  var el_shortcut = vega_$('#input_shortcut');
  el_shortcut.val(shortcut);
  el_shortcut.removeClass('loading').addClass('loaded');
  el_shortcut.change(save_options);
  
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

  var last_format = localStorage['format'];
  var el_format = vega_$('#input_format');

  var last_shortcut = localStorage['shortcut'];
  var el_shortcut = vega_$('#input_shortcut');

  if (force || last_format != el_format.val() || last_shortcut != el_shortcut.val())
  {
    localStorage['format'] = el_format.val();
    localStorage['shortcut'] = el_shortcut.val();
    show_save_notification();
  }
  
  if (last_shortcut != localStorage.shortcut)
      chrome.extension.sendRequest({ action: 'setShortcut', shortcut: localStorage.shortcut });
}

function show_save_notification()
{
  var save_notification = vega_$('#save_notification');
  save_notification.stop(true, true).effect('highlight', {}, 2000).fadeOut();
}
