var game_grid;

function init_real_game(level=null) {

    var current_level;
    try{
        current_level = profile_games["real"];
    } catch(e) {
        current_level = parseInt(level);
    }

    if(level) {
        current_level = parseInt(level);
    } else {
        if(profile_games["real"]["current"]) {
            current_level = parseInt(profile_games["real"]["current"]);
        } else {
            current_level = 1;
        }
    }

    if (current_level <= 1) { current_level = 1; }
    else if (current_level >= max_game) { current_level = 1; }

    profile_games["real"]["current"] = current_level;

    $('.animalgameinner').html('');
    $('.cover').attr('level', current_level);

    $('.hebrow').html(`<img 
        class="play_voice" 
        voice_src="./sound/zhoBale.mp3"
        src="./imgs/heb.jpg" />`);

    $('.level_pass').html('<img class="real_answer">');

    if(current_level == 1) {
        $('.level_pass').append(`<img class="next_level" game="real"/>`);
    } else if(current_level > 1 && current_level < max_game - 1) {
        $('.level_pass').append(`<img class="next_level" game="real"/><img class="prev_level" game="real"/>`);
    } else if(current_level == max_game - 1) {
        $('.level_pass').append(`<img class="prev_level" game="real"/>`);
    }
    if(profile_games["real"]["current"] ==  profile_games["real"]["max"]) {
        $(".level_pass .next_level").remove();
    } 
    real_build_game_grid(current_level);
    get_real_question(current_level);
}

function real_build_game_grid(level) {

    if(game_grid) {
        game_grid.destroy();
        $(".game_container").append("<div class='grid-stack animalgameinner'></div>");
    }

    if(level < 4) { $(".grid-stack").css("width", "60%"); } 
    else if(level >= 4 && level <= 7) { $(".grid-stack").css("width", "90%"); }
    else { $(".grid-stack").css("width", "100%"); }

    $(".grid-stack").gridstack({
        animate: true,
        cellHeight: $(".grid-stack").height() / 2 - 50,
        float: true,
        horizontalMargin: 5,
        verticalMargin: 5
    });
    game_grid = $('.grid-stack').data('gridstack');
}

function get_real_question(level) {
    var animal_real = real_get_random_animal();
    var url = `http://localhost:8888/uploads/photo/${ animal_real['id'] }-${ animal_real['name'] }.png`;
    if(!animals_asked["real"].includes(animal_real.id) && !not_found["real"].includes(animal_real.id)) {
        $.get(url)
            .done(function() { 
                animals_asked["real"].push(animal_real.id);
                setup_real_game(animal_real);
                get_real_answers(level, animal_real);
                return;
            }).fail(function() { 
                not_found["real"].push(animal_real.id);
                get_real_question(level);
            });
    } else {
        get_real_question(level);
    }
}

function setup_real_game(animal_real) {
    $(".level_pass .real_answer").attr("src", `./uploads/photo/${ animal_real['id'] }-${ animal_real['name'] }.png`);
    $(".level_pass .real_answer").attr("animal_id", animal_real["id"]);
    $(".level_pass .real_answer").attr("animal_name", animal_real["name"]);
}

function get_real_answers(level, animal_question) {
    //animals_cards = [ animal_question ];
    animals_cards_ids =  [];

    if(level == 1) { card_width = 6; } 
    else if(level == 2 || level == 5) { card_width = 4; } 
    else if(level == 3) { card_width = 3; } 
    else if(level == 4) { card_width = 3; } 
    else { card_width = 2; }

    animal_question = render_real_answer(animal_question);
    animals_cards_ids.push(animal_question.attr("animal_id"));
    real_push_animal_card(animal_question);

    for (var i = 0; i < level; i++) {
        var animal = real_get_random_animal();
        animal = render_real_answer(animal);
        animals_cards_ids.push(animal.attr("animal_id"));
        real_push_animal_card(animal);
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

function real_get_random_animal() { //func to be answers different
    var index = Math.floor(Math.random() * animals.length);
    while(animals_cards_ids.includes(animals[index].id)) {
        index = Math.floor(Math.random() * animals.length);
    }
    return animals[index];
}

function render_real_answer(animal) {
    return $(`
        <div 
            class="grid-stack-item real_card" 
            animal_id="${ animal["id"] }" 
            animal_name="${ animal["name"] }" 
            data-gs-auto-position="true"
            data-gs-x="0" 
            data-gs-y="0" 
            data-gs-width="2" 
            data-gs-height="4">
            <img src="./uploads/real/${ animal['id'] }-${ animal['name'] }.png">
        </div>
    `);
}

function real_push_animal_card(animal_widget) {
    game_grid.addWidget(animal_widget.clone(), 0, 0, card_width, 1, true);  
}

function check_real_results($selected_card, $real_answer) {
    if(sloved = $selected_card.attr("animal_id") == $real_answer.attr("animal_id")){
        excellent();
        sloved && real_congrats($(".cover").attr("level") == max_game - 1);
        return;
    }
    !sloved && $selected_card.addClass("wrong_selection");
    real_lose();
    trayAgain();
}

function real_congrats(cellebrate=false) {

    profile_games["real"]["max"] = Math.max(profile_games["real"]["max"], profile_games["real"]["current"] + 1);

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
            
            $('.cover').html(`<img class="next_level" game="real"><img class="repeat_level" game="real">`);
            if(cellebrate) {
                animals_asked["real"] = [];
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

function real_lose() {
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
            $('.cover').html(`<img class="next_level" game="real"><img class="repeat_level" game="real">`);
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

$(document).on("click", ".real_card", function(e) {
    check_real_results($(this), $(".real_answer"));
});

$(document).on("click", '.next_level[game="real"]', function() {
    init_real_game(parseInt($(".cover").attr("level")) + 1);
    $(".cover").hide();
});

$(document).on("click", '.repeat_level[game="real"]', function() {
    init_real_game(parseInt($(".cover").attr("level")));
    $(".cover").hide();
});

$(document).on("click", '.prev_level[game="real"]', function() {
    init_real_game(parseInt($(".cover").attr("level")) - 1);
    $(".cover").hide();
});