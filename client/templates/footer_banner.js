Template.FooterBanner.onRendered(function() {  
  $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function() {
    var ads, adsbygoogle;
    ads = '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-2681012140605765" data-ad-slot="9091494270"></ins>';
    $('#googleAds').html(ads);
    return (adsbygoogle = window.adsbygoogle || []).push({});
  });
});