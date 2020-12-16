class Animals {

    constructor() {
        this.animals
        this.id;

        this.arabic = null;
        this.hebrew = null;
        this.animal = null;
    }

    //Get animals data from the server and show the picture from the provided path
    createAnimals(Animals) {
        var $sounds = $('.table_container .sounds');
        fetch("http://localhost:8888/table/animals",{
            method:'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => (res.json())).then((data) => {
            $sounds.empty();
            this.animals = data['result'];
            $.each(this.animals, (index, animal) => {
                var url = `./uploads/sound/${ animal['id'] }-${ animal['name'] }.mp3`;
                $.get(url)
                    .done(function() { 
                        $sounds.append(`
                            <div class="sound" data-id="${ animal.id }" data-name="${ animal.name }">
                                <img src="./uploads/photo/${ animal['id'] }-${ animal['name'] }.png">
                            </div>
                        `);
                    }).fail(function() { 
                        console.log("Not EXIST")
                        console.log(animal['name'])
                    });
            });
            $sounds.show();
        });
    }
    
    preview_model(id, name) {
        //לחצה על קפטור שמיעת השם והקול
        if(this.audio) {
            this.arabic.pause();
            this.hebrew.pause();
            this.animal.pause();
        }
        
        //לחיצה על כפתור לפני 
        if(id == "prev") {
            var $element = $('.sound[data-id="' + $(".preview_model").attr("id") + '"]').prev();
            $element = $element.length ? $element: $('.sound:last-child')
            id = $element.data("id"); 
            $('.sound[data-id="' + id + '"]').click();
            return;
        }
        //לחיצה על כפתור אחרי
        if(id == "next") {
            var $element = $('.sound[data-id="' + $(".preview_model").attr("id") + '"]').next();
            $element = $element.length ? $element: $('.sound:first-child').next() 
            id = $element.data("id"); 
            $('.sound[data-id="' + id + '"]').click();
            return;
        }

        //הערל של ה אי די אם יש ??
        if(parseFloat(id) || id == "0") { this.id = id; }

        //הקול והשם המתאים לקל תמונה
        this.createAnimalPage(id, name);

        let file_arabic = new Audio(`./uploads/ar_sound/${ id }-${ name }.mp3`);
        let file_hebrew = new Audio(`./uploads/he_sound/${ id }-${ name }.mp3`);
        let file_animal = new Audio(`./uploads/sound/${ id }-${ name }.mp3`);

        this.arabic = file_arabic;
        this.hebrew = file_hebrew;
        this.animal = file_animal;

        setTimeout(() => {
            this.arabic.play();
            setTimeout(() => {
                this.hebrew.play();
            }, 2000);
        }, 800);

        this.animal.play();
    }

    //הכפתורים של קול ושם 
    createAnimalPage(id, name) {
        $('.preview_model').attr("id", id).empty();
        $('.preview_model')
            .append(`<img class="main" src="./uploads/photo/${ id }-${ name }.png">`)
            .append('<img class="hide" aria-hidden="true" src="./imgs/x.png">')
            .append('<img class="play" lang="AR" aria-hidden="true" src="./imgs/arab.jpg">')
            .append('<img class="play" lang="HE" aria-hidden="true" src="./imgs/heb.png">')
            .append('<img class="play" lang="ANIMAL" aria-hidden="true" src="./imgs/koll.png">')

        if (id == 0) { $('.prev').remove() }
        if (id == 50) { $('.next').remove() }

        $('.preview_model').show();
    }
   
    //הופעת הרכבת מוגדר זמן ומקום 
    trainPass() {
        let audio = new Audio('./sound/trainvoice.mp3');
        $(".trainimg").animate({ left: "-50%" }, 4000, () => {
            $(".trainimg").css({ left: "150%" });
        });
        audio.play(); 
    }
    
    //שתיקה לקול
    pause_sound() {
        this.arabic.pause();
        this.hebrew.pause();
        this.animal.pause();
    }

    //הפעלת והשקטת הקול
    play_sound(sound) {
        this.pause_sound();
        if(sound == "AR") { return this.arabic.play() }
        if(sound == "HE") { return this.hebrew.play() }
        if(sound == "ANIMAL") { return this.animal.play() }
    }
}

function init_sounds() {

    const sounds = new Animals();  
  
    $(document).on("click", ".main", function () {
        var half = $(document).width() / 2;
        sounds.preview_model(half > event.pageX ? "prev": "next");
    });

    $('.main').click(() => {
        $(this).show();
    });

    $(document).on("click", ".preview_model .play", function(e) {
        sounds.play_sound($(this).attr("lang"));
    });

    $(document).on("click", ".sounds .sound", function (e) {
        sounds.preview_model($(this).data("id"), $(this).data("name"));
    });

    sounds.createAnimals();
}