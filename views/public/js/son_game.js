var game_grid;

function init_son_game(level=null) {

    var current_level;
    try{
        current_level = profile_games["son"];
    } catch(e) {
        current_level = parseInt(level);
    }

    if(level) {
        current_level = parseInt(level);
    } else {
        if(profile_games["son"]) {
            current_level = parseInt(profile_games["son"]["current"]);
        } else {
            current_level = 1;
        }
    }

    if (current_level <= 1) { current_level = 1; }
    else if (current_level >= max_game) { current_level = 1; }

    profile_games["son"]["current"] = current_level;

    $('.animalgameinner').html('');
    $('.cover').attr('level', current_level);

    $('.hebrow').html(`<img 
        class="play_voice" 
        voice_src="./sound/zhoBale.mp3"
        src="./imgs/heb.jpg" />`);

    $('.level_pass').html('<img class="son_answer">');

    if(current_level == 1) {
        $('.level_pass').append(`<img class="next_level" game="son"/>`);
    } else if(current_level > 1 && current_level < max_game-1) {
        $('.level_pass').append(`<img class="next_level" game="son"/><img class="prev_level" game="son"/>`);
    } else if(current_level == max_game) {
        $('.level_pass').append(`<img class="prev_level" game="son"/>`);
    }
    if(profile_games["son"]["current"] ==  profile_games["son"]["max"]) {
        $(".level_pass .next_level").remove();
    } 
    son_build_game_grid(current_level);
    console.log("HERE ***********************************************")
    get_son_question(current_level);
}

function son_build_game_grid(level) {

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

function get_son_question(level) {
    var animal_son = son_get_random_animal();
    var url = `http://localhost:8888/uploads/son/${ animal_son['id'] }-${ animal_son['name'] }.png`;
    if(!animals_asked["son"].includes(animal_son.id) && !not_found["son"].includes(animal_son.id)) {
        $.get(url)
            .done(function() { 
                animals_asked["son"].push(animal_son.id);
                setup_son_game(animal_son);
                get_son_answers(level, animal_son);
                return;
            }).fail(function() { 
                not_found["son"].push(animal_son.id);
                get_son_question(level);
            });
    } else {
        get_son_question(level);
    }
}

function setup_son_game(animal_son) {
    $(".level_pass .son_answer").attr("src", `./uploads/son/${ animal_son['id'] }-${ animal_son['name'] }.png`);
    $(".level_pass .son_answer").attr("animal_id", animal_son["id"]);
    $(".level_pass .son_answer").attr("animal_name", animal_son["name"]);
}

function get_son_answers(level, animal_question) {


   // animals_cards = [ animal_question ];
    animals_cards_ids =  [];

    if(level == 1) { card_width = 6; } 
    else if(level == 2 || level == 5) { card_width = 4; } 
    else if(level == 3) { card_width = 3; } 
    else if(level == 4) { card_width = 3; } 
    else { card_width = 2; }

    animal_question = render_son_answer(animal_question);
    animals_cards_ids.push(animal_question.attr("animal_id"));
    son_push_animal_card(animal_question);


    for (var i = 0; i < level; i++) {
        var animal = son_get_random_animal();
        animal = render_son_answer(animal);
        animals_cards_ids.push(animal.attr("animal_id"));
        son_push_animal_card(animal);
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


function son_get_random_animal() {
    var index = Math.floor(Math.random() * animals.length);
    while(animals_cards_ids.includes(animals[index].id)) {
        index = Math.floor(Math.random() * animals.length);
    }
    return animals[index];
}

function render_son_answer(animal) {
    return $(`
        <div 
            class="grid-stack-item son_card" 
            animal_id="${ animal["id"] }" 
            animal_name="${ animal["name"] }" 
            data-gs-auto-position="true"
            data-gs-x="0" 
            data-gs-y="0" 
            data-gs-width="2" 
            data-gs-height="4">
            <img src="./uploads/photo/${ animal['id'] }-${ animal['name'] }.png">
        </div>
    `);
}

function son_push_animal_card(animal_widget) {
    game_grid.addWidget(animal_widget.clone(), 0, 0, card_width, 1, true);
}


function check_son_results($selected_card, $son_answer) {
    if(sloved = $selected_card.attr("animal_id") == $son_answer.attr("animal_id")){
        excellent();
        sloved && son_congrats($(".cover").attr("level") == max_game - 1);
        return;
    }
    !sloved && $selected_card.addClass("wrong_selection");
    son_lose();
    trayAgain();
}

function son_congrats(cellebrate=false) {

    profile_games["son"]["max"] = Math.max(profile_games["son"]["max"], profile_games["son"]["current"] + 1);

    var id = $(".profile").attr("profile_id");
    var points = parseInt($(".profile_points").html()) + 1;
    var games_points = { "games": profile_games };
    checkPoints(points);
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
            $('.cover').html(`<img class="next_level" game="son"><img class="repeat_level" game="son">`);
            if(cellebrate) {
                victory();
                animals_asked["son"] = [];
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

function son_lose() {
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
            $('.cover').html(`<img class="next_level" game="son"><img class="repeat_level" game="son">`);
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

$(document).on("click", ".son_card", function(e) {
    check_son_results($(this), $(".son_answer"));
});

$(document).on("click", '.next_level[game="son"]', function() {
    init_son_game(parseInt($(".cover").attr("level")) + 1);
    $(".cover").hide();
});

$(document).on("click", '.repeat_level[game="son"]', function() {
    init_son_game(parseInt($(".cover").attr("level")));
    $(".cover").hide();
});

$(document).on("click", '.prev_level[game="son"]', function() {
    init_son_game(parseInt($(".cover").attr("level")) - 1);
    $(".cover").hide();
});