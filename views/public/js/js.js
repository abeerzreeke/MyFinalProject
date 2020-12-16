let clickSound = new Audio('./sound/button.mp3')
let CounterFlip = 1;
var lastPoints = 0;
var profile_image = 0;
var profile_id = 0;
var scroll = $(window).scrollTop();
var yAnimail;
var audio1;
var audio10;
var arabic;
var hebrew;
var animal;
var animals;
var max_game = 11;
var animals_cards = [];
var animals_cards_ids = [];
var screenSize = { "width": $(window).width(), "heigth": $(window).height() };
var mobileMode = screenSize.width < 450;
var delay=1000, setTimeoutConst;
var kids = new Audio('./sound/kids.mp3');
var animals_asked = {
    "memory": [],
    "sound": [],
    "son": [],
    "home": [],
    "real": [],
    "simon": []
}
var not_found = {
    "memory": [],
    "sound": [],
    "son": [],
    "home": [],
    "real": [],
    "simon": []
}


$(document).ready(function() {

    //- First load setup:
    //- Check if client is in a mobile or desktop
    //- Get the last points for client
    //- Play welcome sounds

    get_animals();
    get_profiles();

    $("body").addClass(mobileMode ? 'mobile': '');
    clickSound = new Audio('./sound/button.mp3');
    
    /* FUNCTIONS */

    $(".profile").on("click", function(e) {
        if($(e.target).hasClass("fa-trash")) { return }
        $(".profile_images").modal("show");
    });

    //Toggle the visibility of the password field
    $('.toggle_password').on('click', function() {
        if($("#password").attr('type') == "password") {
            $("#password").attr('type', "text");
        } else {
            $("#password").attr('type', "password");
        }
    });

    //Save the client image according to what been selected
    $(document).on('click', '.album .cont', function() {
        profile_id = $(this).attr('profile_id');
        profile_games = $(this).data('games');
        if(profile_games == null || profile_games == "null") {}
        localStorage.setItem('profile_id', profile_id);
        localStorage.setItem('profile_games', JSON.stringify(profile_games));
        $(".profile img").attr('src', $(this).find('img').attr('src'));
        $(".profile").attr('profile_id', profile_id);
        $('.profile_points').html($(this).find('.points').html());
        $('.profile_images').modal('hide');
    });

    $("#reset_current_profile").on('click', function(e) {
        e.preventDefault();
        var profile_id = $(".profile").attr("profile_id");
        var games_points = { "games": { "memory": { "current": 2, "max": 2 }, "sound": { "current": 1, "max": 1 }, "home": { "current": 1, "max": 1 }, "real": { "current": 1, "max": 1 }, "son": { "current": 1, "max": 1 }, "simon": { "current": 1, "max": 1 } } };
        $.ajax({
            url: "http://localhost:8888/profiles_points/" + profile_id + "/0",
            method: "POST",
            dataType: 'json',
            data: games_points,
            success: (data) => { 
                alert("Profile was been cleaned/reseted");
                $(".profile_points").html("0");
            },
            error: (error) => { console.log(error) }
        });
    });
    
    //Divide the screen to two sides to detect user direction when he browse the animals game gallery
    // $(document).on("click", ".preview_model .main", function () {
    //     animals.animalPage($(document).width() / 2 > event.pageX ? "prev": "next");
    // });

    $(".animal_ID").on('change', function() {
        $(".form_field").find("input[name='animal_id']").val($(this).val());
    });

    $(".animal_Name").on('change', function() {
        $(".form_field").find("input[name='animal_name']").val($(this).val());
    });

    //Detect the user key clicked to browse images before/after
    $(document).on('keyup', function(e) {
        if($(".animalpage").is(':visible')) { 
            if (e.keyCode == '37') { animals.animalPage("prev"); } 
            else if (e.keyCode == '39') { animals.animalPage("next"); } 
        }
    });

    //Clear login form fields
    //Global close form function
    $('.closediv').on('click', function() {
        $(this).parent().modal('hide');
        $("#password").val("");
        $("#username").val("");
    });

    //Global close form function
    $(document).on("click", ".preview_model .hide", function () {
        $(".preview_model").hide();
        this.arabic.pause();
        this.hebrew.pause();
        this.animal.pause();
       
    });

    //Rebuild main page
    $('.main').click(() => {
        $('.back').removeClass('tables').removeClass('games');
        $('body').addClass('zoo-bg');
        $('.permissions, .signIn, .alltables, .allgames, .functions, .game_container, .table_container, .animalLittlenessPage, .animalpage, .animalHomePage').hide();
        $('.functions').show();
        clickSound.play();
    });

    $(document).on("click", ".animal", function (e) {
        yAnimail= $(this).offset().top
        animals.animalPage($(this).data("animal"));
        $('.animalpage').show();
    });

    // $(document).on("click", ".resound", function () {
    //     play.playCorrectSound();
    // });

    $(document).on("click", ".resound1", function () {
        play.playCorrectSound1();
    });

    $(document).on("click", ".play_voice", function() {
        var voice = new Howl({
            src: [ $(this).attr("voice_src") ]
        });
        voice.pause();
        setTimeout(e => { voice.play(); });
    });

    $(document).on("mouseover", ".play_voice_method:not(.profile)", function() { 
        var voice_src = $(this).attr("voice_src");
        setTimeoutConst = setTimeout(function() {
            var sound = new Howl({
                src: [ voice_src ]
            });
            sound.pause();
            setTimeout(e => { sound.play(); });
        }, delay);
    });

    $(document).on("mouseout", ".play_voice_method:not(.profile)", function() {
        clearTimeout(setTimeoutConst);
    });
    
    $(document).on("click", ".hebBtu1", function () {
        play.quesHebrowSound1(this);
    });

    /* ALL TABLES */

    $(document).on("click", ".back.tables", function(e) {
        $('.table_container').hide();
        $('.table_container .content').hide();
        $('.animal_tables').show();
        $('.back').removeClass('tables');
    });

    $('.animal_tables .table').on("click", function(e) {
        var table = $(this).attr("table");
        $('.animal_tables').hide();
        $('.table_container').show();

        $('.back').removeClass('games');
        $('.back').addClass('tables');

        if(table == "sons") { return init_sons(); }
        if(table == "homes") { return init_homes(); }
        if(table == "sounds") { return init_sounds(); }
    });

    /* ALL GAMES */

    $(document).on("click", ".back.games", function(e) {
        $('.game_container').hide();
        $('.game_container .content').hide();
        $('.animal_games').show();
        $("body").removeClass("ingame");
        $('.back').removeClass('games');
    });

    $('.animal_games .game').on("click", function() {

        var game = $(this).attr("game");
        $('.animal_games').hide();
        $('.game_container').show();

        $('.back').removeClass('games');
        $('.back').addClass('games');

        var current_level = 0;

        if(profile_games && profile_games[game] && profile_games[game]["current"]) {
            current_level = profile_games[game]["current"];
        }

        animals_asked[game] = [];
        $("body").addClass("ingame");

        if(game == "memory") { return init_memory_game(current_level); }
        if(game == "sound") { return init_sound_game(current_level); }
        if(game == "home") { return init_home_game(current_level); }
        if(game == "real") { return init_real_game(current_level); }
        if(game == "son") { return init_son_game(current_level); }
        if(game == "simon") { return init_simon_game(current_level); }
    });

});

function get_animals() {
    fetch("http://localhost:8888/table/animals", { 
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' }, 
    }).then((res) => (res.json())).then((data) => {
        animals = data["result"];
    });
}

//Page move with animation
function hide_cover() {
    setTimeout(() => {
        $('.loading').fadeOut(250, e => {
            $('.loading').remove();
            if(localStorage.getItem('profile')) {
                profile_image = localStorage.getItem('profile');
                $(".profile img").attr('src', profile_image);
                $('.functions, .app_header').show();
            } else {
                get_profiles();
            }
        });
    }, 125);
}

//Update current points score
function update_points() {
    localStorage.setItem('points', ++lastPoints);
    $('.profile_points').html(lastPoints);
}

//Show congratulation message and restart button
function son_congrats() {
    if($('.animalgameinner').attr('game') == "home") {
    	reset_home_game();
    } else if($('.animalgameinner').attr('game') == "son") {
    	reset_son_game();
    }

    $("body").append('<img class="congratz" src="imgs/good/last.gif" />');
    setTimeout(e => {
        $('.congratz').remove();
    }, 3000);
}

//The appearance of the sad face if When losing
function son_sad() {
    if($('.animalgameinner').attr('game') == "home") {
        reset_home_game();
    } else if($('.animalgameinner').attr('game') == "son") {
    	reset_son_game();
    } else if($('.animalgameinner').attr('game') == "real") {
    	reset_real_game();
    }

    $("body").append('<img class="congratz sad" src="imgs/sad/0.png" />');
    setTimeout(e => {
        $('.congratz').remove();
    }, 500);
}

function get_profiles() {
    $.ajax({
        url: "http://localhost:8888/profiles", //go to /profiles in backend
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var profiles = data["result"];
            var last_profile = localStorage.getItem("profile_id");
            $(".profile_images .album").html(profiles.map(profile => {
                return `
                    <div class="cont" profile_id="${ profile.id }" data-games='${ JSON.stringify(profile.games) }'>
                        <img class="picture" src="uploads/profiles/${ profile.id }-${  profile.name }.png" /> 
                        <span class="points">${ profile.points }</span> 
                    </div>`;
            }).join(''));
            if(last_profile) {
                $(".profile_images .album .cont[profile_id='" + last_profile + "']").click();
            } else {
                $(".profile_images").modal('show');
            }
        }
    });
}

function excellent(){
    var randomSound =['./sound/true.mp3', './sound/0.mp3','./sound/1.mp3','./sound/meoleKdema.mpeg'];
    var rand = new Audio(randomSound[Math.floor(Math.random() * randomSound.length)]);
    rand.play();
}

function trayAgain(){
    var randomSound =['./sound/tryagin.mp3', './sound/retry.mp3', './sound/false.mp3'];
    var rand = new Audio(randomSound[Math.floor(Math.random() * randomSound.length)]);
    rand.play();
}

function victory() {
    confetti.start();
    this.kids.play();
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function checkPoints(points){
    if (points % 10 == 0){
       
    }
}

(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);