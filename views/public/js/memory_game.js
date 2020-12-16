var game_grid;

function init_memory_game(level=null) {

    var current_level;
    try{
        current_level = profile_games["memory"];
    } catch(e) {
        current_level = parseInt(level);
    }

    if(level) {
        current_level = parseInt(level);
    } else {
        if(profile_games["memory"]) {
            current_level = parseInt(profile_games["memory"]["current"]);
        } else {
            current_level = 1;
        }
    }

    if (current_level <= 1) { current_level = 1; }
    else if (current_level >= max_game) { current_level = 1; }

    profile_games["memory"]["current"] = current_level;

    $('.animalgameinner').html('');
    $('.cover').attr('level', current_level);

    /*
        //pic of hebrow voice
        $('.hebrow').html(`<img 
            class="play_voice" 
            voice_src=""
            src="./imgs/heb.jpg" />`);
    */

    //img of next and prev level 
    if(current_level == 2) {
        $('.level_pass').html(`<img class="next_level" game="memory" />`);
    } else if(current_level > 2 && current_level < 20) {
        $('.level_pass').html(`<img class="next_level" game="memory" /><img class="prev_level" game="memory" />`);
    } else if(current_level == 20) {
        $('.level_pass').html(`<img class="prev_level" game="memory" />`);
    }
    if(profile_games["memory"]["current"] ==  profile_games["memory"]["max"]) {
        $(".level_pass .next_level").remove();
    } 
    memory_build_game_grid(current_level);
    setup_memory_game(current_level);
}

function memory_build_game_grid(level) {

    if(game_grid) {
        game_grid.destroy();//remove the old game ,delete the prev grid game 
        $(".game_container").append("<div class='grid-stack animalgameinner'></div>");//buld the new game
    }


    if(level > 1 && level <= 3) {
        $(".grid-stack").css("width", "55%");
    } else if(level == 4) {
        $(".grid-stack").css("width", "70%");
    } else if(level > 4 && level <= 6) {
        $(".grid-stack").css("width", "90%");
    } else {
        $(".grid-stack").css("width", "100%");
    }
    
    var cell_height;
    if(level > 1 && level <= 6) {
        cell_height = $(".grid-stack").height() / 2 - 50;
    } else if(level > 6 && level <= 9) {
        cell_height = $(".grid-stack").height() / 3 - 15;
    } else if(level > 9 && level <= 12) {
        cell_height = $(".grid-stack").height() / 4 - 20;
    } else if(level > 12 && level <= 15) {
        cell_height = $(".grid-stack").height() / 5 - 5;
    } else if(level > 15 && level <= 20) {
        cell_height = $(".grid-stack").height() / 3 - 25;
    } else {
        cell_height = 100;
    }

    $(".grid-stack").gridstack({ //grid-stack is a div in html, gridstack is a function 
        animate: true,
        cellHeight: cell_height,
        float: true,
        horizontalMargin: 5,
        verticalMargin: 5
    });
    game_grid = $('.grid-stack').data('gridstack');
}

function setup_memory_game(level) {
    var animals_cards = [];
    for (var i = 0; i < level; i++) {
        var animal = memory_get_random_animal(level);
        animals_cards.push(memory_append_animal_cards(animal));
        animals_cards.push(memory_append_animal_cards(animal));
    }
    memory_push_animals_cards(animals_cards, level);
}

function memory_get_random_animal(level) {
    var index = Math.floor(Math.random() * animals.length);
    return animals[index];
}

function memory_append_animal_cards(animal) {
    var card_width, card_heigth;
    return $(`
        <div 
            class="grid-stack-item memory_card" 
            animal_id="${ animal["id"] }" 
            animal_name="${ animal["name"] }" 
            sloved="0"
            flipped="0" 
            data-gs-x="0" 
            data-gs-y="0" 
            data-gs-width="2" 
            data-gs-height="4">
            <img src="./uploads/photo/${ animal['id'] }-${ animal['name'] }.png">
        </div>
    `);
}

function memory_push_animals_cards(animals, level) {
    if(level == 2) {
        card_width = 6
        card_heigth = 1
    } else if(level == 3) {
        card_width = 4
        card_heigth = 1
    } else if(level == 4) {
        card_width = 3
        card_heigth = 1
    } else if(level == 5) {
        card_width = 2
        card_heigth = 1
    } else if(level > 15) {
        card_width = 1
        card_heigth = 1
    } else {
        card_width = 2
        card_heigth = 1
    }
    for(var index in randomize_array(animals)) {
        game_grid.addWidget(animals[index].clone(), 0, 0, card_width, card_heigth, true);//add at this in gride-stack
    }
}

function check_memory_results(sloved) {
    sloved && memory_congrats(cellebrate=true);

}

function memory_congrats(cellebrate=true) {

    profile_games["memory"]["max"] = Math.max(profile_games["memory"]["max"], profile_games["memory"]["current"] + 1);

    var id = $(".profile").attr("profile_id");
    var points = parseInt($(".profile_points").html()) + 1;
    var games_points = { "games": profile_games };
    $.ajax({
        url: "http://localhost:8888/profiles_points/" + id + "/" + points, // where my server is found
        dataType: 'json', //send my data
        data: games_points,
        method: "POST", //write to the server
        success: (data) => { 
            $(".profile_points").html(points);
            $('.profile_points').animate({backgroundColor: '#8bc34a'}, 1000, function() {
                $('.profile_points').animate({backgroundColor: '#ffffff9c'}, 1000)
            });
            $('.cover').html(`<img class="next_level" game="memory"><img class="repeat_level" game="memory">`);
            if(cellebrate) {
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
//random the array animals 
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

$(document).on("click", ".memory_card", function(e) {

    var flipped = parseInt($(this).attr("flipped"));

    if(!flipped) { $(this).attr("flipped", "1"); } //to flipped the card

    var flipped_cards = $(".memory_card[flipped='1'][sloved='0']");
    var flipped_count = flipped_cards.length;
    var animal = { id: $(this).attr("animal_id"), name: $(this).attr("animal_name") };

    if(flipped_count == 2) {
        setTimeout(e => {
            flipped_cards.attr("flipped", "0");//flipped the card if this not a same card
            if($(flipped_cards[0]).attr("animal_id") == $(flipped_cards[1]).attr("animal_id")) { //check if this the same cards
                //the card flipped to imge animal 
                flipped_cards.attr("sloved", "1");
                flipped_cards.attr("flipped", "1");
            }
            check_memory_results($(".memory_card[sloved='1']").length == $(".memory_card").length);//to know if the level end
        }, 250);
    } else if(flipped_count > 2) {
        flipped_cards.attr("flipped", "0");
        check_memory_results($(".memory_card[sloved='1']").length == $(".memory_card").length);
    }
});

//go to the next level


$(document).on("click", '.next_level[game="memory"]', function() {
    init_memory_game(parseInt($(".cover").attr("level")) + 1);
    $(".cover").hide();
});

//repeat the same level
$(document).on("click", '.repeat_level[game="memory"]', function() {
    init_memory_game(parseInt($(".cover").attr("level")));
    $(".cover").hide();
});

//go to the prev level
$(document).on("click", '.prev_level[game="memory"]', function() {
    init_memory_game(parseInt($(".cover").attr("level")) - 1);
    $(".cover").hide();
});