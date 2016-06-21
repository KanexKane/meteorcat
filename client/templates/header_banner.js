Template.HeaderBanner.onRendered(function() {  
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:block;" data-ad-client="ca-pub-2681012140605765" data-ad-slot="9591021875" data-ad-format="auto"></ins>';
    $('#googleAdsHeader').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
});