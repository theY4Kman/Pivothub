var vega_$ = jQuery.noConflict(true);

const VEGA_STATUSES = [
  'unscheduled',
  'unstarted',
  'started',
  'finished',
  'delivered',
  'rejected',
  'accepted'
];

// Returns the current status of the story based on its CSS styles
function vega_storyStatus(elem)
{
  var classes = vega_$(elem).find('.storyItem').attr('class');
  for (var i in VEGA_STATUSES)
    if (VEGA_STATUSES.hasOwnProperty(i) && classes.indexOf(VEGA_STATUSES[i]) != -1)
      return VEGA_STATUSES[i];
  
  return '';
}

chrome.extension.sendRequest({ action: "pageStart" });

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == 'setShortcut')
    {
        Mousetrap.reset();
        Mousetrap.bind(request.shortcut, function (e) {
            chrome.extension.sendRequest({ action: 'startSearch' });
        });
        
        return;
    }
    
    var words = request.query.toLowerCase().split(" ");

    var results = new Array();
    vega_$(".item").each(function()
    {
      if (this.id.indexOf("_story") != -1)
      {
        var el = vega_$(this);
        var titlefull = el.find('.story_name').text();
        if (pivothub_matches(titlefull, words))
        {
          var id = this.id;
          var s = id.lastIndexOf("story");
          var storyId = id.substr(s + 5);
          var status = vega_storyStatus(el);
          
          // We want to get rid of the owner's initials in the name, as well
          // as grab their full name and initials.
          var storyname = titlefull;
          var el_storyname = el.find('.story_name').clone();
          var el_owner = el_storyname.find('.storyOwnerInitials');
          
          var owner = '';
          var owner_initials = '';
          if (el_owner.length > 0)
          {
            owner = el_owner.attr('title');
            owner_initials = el_owner.text();
            storyname = el_storyname.contents().slice(0, -3).text();
          }
          
          // The labels are listed simply enough
          var labels = el.find('span.storyLabels > a').map(function(k,v) {
            return vega_$(v).text();
          });
          
          // Grab the story type from the icon
          var type = el.find('img.storyTypeIcon').attr('src');
          type = type.substr(type.lastIndexOf('/') + 1);
          type = type.substr(0, type.indexOf('.'));
          
          results.push({
            id: storyId,
            
            titlefull: titlefull,
            title: storyname,
            
            owner: owner,
            initials: owner_initials,
            
            labels: vega_$.makeArray(labels),
            type: type,
            status: status
          });
        }
      }
    });
    sendResponse(results);
  });

var pivothub_matches = function(title, words) 
{
    var title_lower = title.toLowerCase();
    var found = true;
    vega_$(words).each(function() {
        if (title_lower.indexOf(this) == -1)
        {
            found = false;
            return false;
        }
    });
    
    return found;
};

chrome.extension.sendRequest({ action: 'keyboardShortcut' }, function (response) {
    Mousetrap.bind(response.shortcut, function (e) {
        chrome.extension.sendRequest({ action: 'startSearch' });
    });
});
