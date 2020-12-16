var game_grid;
var current_answers = [];

function init_sound_game(level=null) {

    var current_level;
    try{
        current_level = profile_games["sound"];
    } catch(e) {
        current_level = parseInt(level);
    }

    if(level) {
        current_level = parseInt(level);
    } else {
        if(profile_games["sound"]) {
            current_level = parseInt(profile_games["sound"]["current"]);
        } else {
            current_level = 1;
        }
    }

    if (current_level <= 1) { current_level = 1; }
    else if (current_level >= max_game) { current_level = 1; }

    profile_games["sound"]["current"] = current_level;

    $('.animalgameinner').html('');
    $('.cover').attr('level', current_level);

    $('.hebrow').html(`<img 
        class="play_voice" 
        voice_src="./sound/QuesForSound.mpeg"
        src="./imgs/heb.jpg" />`);

    $('.level_pass').html('<img class="sound_answer" />');

    //to show the img of next/prev level
    if(current_level == 1) {
        $('.level_pass').append(`<img class="next_level" game="sound" />`);
    } else if(current_level > 1 && current_level < max_game - 1) {
        $('.level_pass').append(`<img class="next_level" game="sound" /><img class="prev_level" game="sound" />`);
    } else if(current_level == max_game) {
        $('.level_pass').append(`<img class="prev_level" game="sound" />`);
    }
    if(profile_games["sound"]["current"] ==  profile_games["sound"]["max"]) {
        $(".level_pass .next_level").remove();
    } 
    sound_build_game_grid(current_level);
    get_sound_question(current_level);
}

function sound_build_game_grid(level) {

    if(game_grid) {
        game_grid.destroy(); //remove the old game(level) becu the grid in level to level is another show
        $(".game_container").append("<div class='grid-stack animalgameinner'></div>"); //and buld the new game(level)
    }

    //change in css by level num
    if(level < 4) { $(".grid-stack").css("width", "60%"); } 
    else if(level >= 4 && level <= 7) { $(".grid-stack").css("width", "90%"); }
    else { $(".grid-stack").css("width", "100%"); }

    $(".grid-stack").gridstack({ //gride-stack is a div in html, i want to operate on them function gridstack about her(gride stack is a library downloand this in the proect and use her)
        //prametrem of gridstack take a div and part this how i want
        animate: true, 
        cellHeight: $(".grid-stack").height() / 2 - 50,
        float: true,
        horizontalMargin: 5,
        verticalMargin: 5
    });
    game_grid = $('.grid-stack').data('gridstack');
}

function get_sound_question(level) {
    var animal_sound = sound_get_random_animal();
    var url = `http://localhost:8888/uploads/photo/${ animal_sound['id'] }-${ animal_sound['name'] }.png`;
    if(!animals_asked["sound"].includes(animal_sound.id) && !not_found["sound"].includes(animal_sound.id)) {
        $.get(url)
            .done(function() { 
                animals_asked["sound"].push(animal_sound.id);
                setup_sound_game(animal_sound);
                get_sound_answers(level, animal_sound);
                return;
            }).fail(function() { 
                not_found["sound"].push(animal_sound.id);
                get_sound_question(level);
            });
    } else {
        get_sound_question(level);
    }
}

function setup_sound_game(animal_sound) {
    $(".level_pass .sound_answer").attr("animal_id", animal_sound["id"]);
    $(".level_pass .sound_answer").attr("animal_name", animal_sound["name"]);
}

function get_sound_answers(level, animal_question) {
    //animals_cards = [ animal_question ];
    animals_cards_ids =  [];

    if(level == 1) { card_width = 6; } 
    else if(level == 2 || level == 5) { card_width = 4; } 
    else if(level == 3) { card_width = 3; } 
    else if(level == 4) { card_width = 3; } 
    else { card_width = 2; }

    animal_question = render_sound_answer(animal_question);
    animals_cards_ids.push(animal_question.attr("animal_id"));
    sound_push_animals_card(animal_question);

    for (var i = 0; i < level; i++) {
        var animal = sound_get_random_animal();
        animal = render_sound_answer(animal);
        animals_cards_ids.push(animal.attr("animal_id"));
        sound_push_animals_card(animal);
    }
    var answer = $(".grid-stack-item:eq(0)");
    var random = $(".grid-stack-item:eq(" + parseInt(Math.random() * $(".grid-stack-item").length) + ")");
    var answer_attr = { "x": answer.attr("data-gs-x"), "y": answer.attr("data-gs-y") };
    var random_attr = { "x": random.attr("data-gs-x"), "y": random.attr("data-gs-y") };
    answer.attr("data-gs-x", random_attr["x"]);
    answer.attr("data-gs-y", random_attr["y"]);
    random.attr("data-gs-x", answer_attr["x"]);
    random.attr("data-gs-y", answer_attr["y"]);
}

//choose animals to be a differnt answer  
function sound_get_random_animal() {
    var index = Math.floor(Math.random() * animals.length);
    while(animals_cards_ids.includes(animals[index].id)) {
        index = Math.floor(Math.random() * animals.length);
    }
    return animals[index];
}

//img of the animal in grid-stack
function render_sound_answer(animal) {
    return $(`
        <div 
            class="grid-stack-item sound_card" 
            animal_id="${ animal["id"] }" 
            animal_name="${ animal["name"] }" 
            data-gs-x="0" 
            data-gs-y="0" 
            data-gs-width="2" 
            data-gs-height="4"
            data-gs-id="${ animal["id"] }">
            <img src="./uploads/photo/${ animal['id'] }-${ animal['name'] }.png">
        </div>
    `);
}

function sound_push_animals_card(animal_widget) {
    game_grid.addWidget(animal_widget.clone(), 0, 0, card_width, 1, true);
}

function check_sound_results($selected_card, $sound_answer) {
    if(sloved = $selected_card.attr("animal_id") == $sound_answer.attr("animal_id")){
        sloved && sound_congrats($(".cover").attr("level") == max_game - 1);
        excellent();
        return;
    }
    !sloved && $selected_card.addClass("wrong_selection");
    sound_lose();
    trayAgain();

}

function play_correct_sound(animal) {
    audio1 = new Audio(`./uploads/sound/${ animal['id'] }-${ animal['name'] }.mp3`);
    setTimeout(() => {
        audio1.play();
    }, 3000);
}

function sound_congrats(cellebrate=false) {

    profile_games["sound"]["max"] = Math.max(profile_games["sound"]["max"], profile_games["sound"]["current"] + 1);

    var id = $(".profile").attr("profile_id");
    var points = parseInt($(".profile_points").html()) + 1;
    var games_points = { "games": profile_games };
    $.ajax({
        url: "http://localhost:8888/profiles_points/" + id + "/" + points,
        dataType: 'json',
        data: games_points,
        method: "POST",
        success: (data) => { 
            $(".profile_points").html(points);
            $('.profile_points').animate({backgroundColor: '#8bc34a'}, 1000, function() {
                $('.profile_points').animate({backgroundColor: '#ffffff9c'}, 1000)
            });
            $('.cover').html(`<img class="next_level" game="sound"><img class="repeat_level" game="sound">`);
            if(cellebrate) {
                animals_asked["sound"] = [];
                victory();
                setTimeout(() => {
                    confetti.stop();
                    $('.cover .next_level').click();
                }, 3000);
            } else {
                $('.cover .next_level').click();
            }
        },
        error: (error) => { console.log(error) }
    });
}

function sound_lose() {
    var id = $(".profile").attr("profile_id");
    var points = parseInt($(".profile_points").html()) - 1;
    $.ajax({
        url: "http://localhost:8888/profiles_points/" + id + "/" + points,
        dataType: 'json',
        method: "POST",
        success: (data) => { 
            $(".profile_points").html(points);
            $('.profile_points').animate({backgroundColor: 'red'}, 1000, function() {
                $('.profile_points').animate({backgroundColor: '#ffffff9c'}, 1000)
            });
            $('.cover').html(`<img class="next_level" game="sound"><img class="repeat_level" game="sound">`);
        },
        error: (error) => { console.log(error) }
    });
}

function randomize_array(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

$(document).on("click", ".sound_card", function(e) {
    check_sound_results($(this), $(".sound_answer"));
});

$(document).on("click", '.next_level[game="sound"]', function() {
    init_sound_game(parseInt($(".cover").attr("level")) + 1);
    $(".cover").hide();
});

$(document).on("click", '.repeat_level[game="sound"]', function() {
    init_sound_game(parseInt($(".cover").attr("level")));
    $(".cover").hide();
});

$(document).on("click", '.prev_level[game="sound"]', function() {
    init_sound_game(parseInt($(".cover").attr("level")) - 1);
    $(".cover").hide();
});

$(document).on("click", ".level_pass .sound_answer", function() {
    play_correct_sound({
        id: $(this).attr("animal_id"),
        name: $(this).attr("animal_name")
    });
});