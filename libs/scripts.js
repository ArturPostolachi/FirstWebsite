/// <reference path="../typings/globals/jquery/index.d.ts" />

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "/Artists - Paintings.csv",
    dataType: "text",
    success: function(numbers) {
      dataVincent(numbers);
      dataLeonardo(numbers);
    }
  });
  // --------------------Vincent van Gogh-------------------
  function dataVincent(numbers) {
    var num = $.csv.toObjects(numbers);

    for (s = 0; s < num.length; ++s) {
      let lastDigit = num[s].Vincent;

      $.ajax({
        type: "GET",
        url:
          "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
          lastDigit,
        dataType: "json",
        success: function(artistObject) {
          vincentPictures(artistObject);
        }
      });
    }

    function vincentPictures(artistObject) {
      // We got our data...

      var imgURL = artistObject.primaryImageSmall;
      let div = $("<div>", {
        class: "vincent-image-container ",
        id: "img-" + s
      }).css(
        "background",
        "url('" + imgURL + "') center/cover no-repeat scroll"
      );
      $("#vincent-main").append(div);
    }
  }
  // --------------------Leonardo da Vinchi-------------------
  function dataLeonardo(numbers) {
    var num = $.csv.toObjects(numbers);

    for (i = 0; i < num.length; ++i) {
      let lastDigit = num[i].Leonardo;
      $.ajax({
        type: "GET",
        url:
          "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
          lastDigit,
        dataType: "json",
        success: function(artistObject) {
          leonardoPictures(artistObject);
        }
      });
    }

    function leonardoPictures(artistObject) {
    // We got our data here now by passing it
      var imgURL = artistObject.primaryImageSmall;
      let div = $("<div>", {
        class: "leonardo-image-container ",
        id: "img-" + i
      }).css(
        "background",
        "url('" + imgURL + "') center/cover no-repeat scroll"
      );

      $("#leonardo-main").append(div);
    }
  }

  // ---------------Adding Background-images to the index page by reading the file path from a folder -------------
  $.ajax({
    type: "GET",
    url: "./Home-background.csv",
    dataType: "text",
    success: function(data) {
      parseFileContents(data);
    }
  });

  function parseFileContents(data) {
    // We got our data here now by passing it

    var jsonData = $.csv.toObjects(data);

    for (i = 0; i < jsonData.length; ++i) {
      let imageURL2 = jsonData[i].url;
      let div = $("<div>", {
        class: "index-image-container",
        id: "img-" + i
      }).css(
        "background",
        "url('" + imageURL2 + "') center/cover no-repeat fixed"
      );
      div.append($("<p>", { class: "quote" }).append(jsonData[i].Quote));
      div.append($("<p>", { class: "artist" }).append(jsonData[i].Artist));

      $("#index-container").append(div);
    }
  }
  // ------------------Section dedicated to my works in photoshop where i import them from a folder with AJax---------------------
  $.ajax({
    type: "GET",
    url: "./About.csv",
    dataType: "text",
    success: function(data) {
      photoshopPictures(data);
    }
  });

  function photoshopPictures(data) {
    var jsonData1 = $.csv.toObjects(data);

    for (j = 0; j < jsonData1.length; ++j) {
      let imageURL3 = jsonData1[j].url;
      let div = $("<div>", {
        class: "about-image-container",
        id: "img-" + j
      }).css(
        "background",
        "url('" + imageURL3 + "') center/cover  no-repeat scroll"
      );
      $("#about-main").append(div);
    }
  }
  // -----------------This page adds more entries in the Artists section------------------------------
  $.ajax({
    type: "GET",
    url: "./Artists.csv",
    dataType: "text",
    success: function(data) {
      artistsPictures(data);
    }
  });

  function artistsPictures(data) {
    var jsonData2 = $.csv.toObjects(data);

    for (j = 0; j < jsonData2.length; ++j) {
      let imageURL4 = jsonData2[j].url;
      let pictureStash = jsonData2[j].link;
      let div = $("<a>", {
        class: "artists-image-container",
        id: "img-" + j,
        href: pictureStash
      }).css(
        "background",
        "url('" + imageURL4 + "') center/cover  no-repeat scroll"
      );

      $("#artist-main").append(div);
      $("#artist-main").append(
        $("<p>", { class: "artist-name" }).append(jsonData2[j].artist)
      );
    }
  }

  // When we click on the up/down chevron
  $(".fas").click(function() {
    // Horizontal Animation where we will colapse the navigation and swap the chevron
    $(".collapsable").slideToggle(500);
    $(".up-down").toggle();
  });

  // Ifound a really usefull example on how to get the scroll up button to work here -  https://gabrieleromanato.name/jquery-check-if-users-stop-scrolling
  var btn = $("#button");
  (function($) {
    $(function() {
      $(document).scroll(function() {
        // Do this when you scroll
        btn.removeClass("show");
        clearTimeout($.data(this, "scrollCheck"));
        $.data(
          this,
          "scrollCheck",
          setTimeout(function() {
            // Do this when you stop scrolling
            if ($(document).scrollTop() > 900) {
              // If we have scrolled pass the 900px from Top we add the custome class we made in CSS
              btn.addClass("show");
            } else {
              btn.removeClass("show");
            }
          }, 300) //It will invoke the check for scroll every 350ms
        );
      });
    });
  })(jQuery);

  btn.on("click", function(e) {
    // We prevent the <a> from doint its NATURAL function when its clicked but it will still work without it
    // If this was an actuall <a> with a href it would not go to that place but the NEW function we wrote for it
    e.preventDefault();
    // and give it a NEW function
    // When you set up the speed DONT add it in  quotes "X" as it wont treat it like a number
    $("html,body").animate({ scrollTop: 0 }, 1000);
    // I had to research what exactly happends when you click and what evenets are triggered https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
  });
  // --------------------------------
  // We make sure that the browser supports the webworker for Caching files
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      // .register("../sw_cached_pages.js")
      // Before we can use the cache we need to register it
      .register("../sw_cached_site.js")
      .then(reg => console.log("Service Worker: Registered"))
      .catch(err => console.log(`Service Worker: Error ${err}`));
  }
});
