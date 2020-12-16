class Homes  {

    constructor() {
        this.homes;
        this.animalpageid;
        this.animals;
        this.arabic = null;
        this.hebrew = null;
    }

    createHomes() {
        var $homes = $('.table_container .homes');
        fetch("http://localhost:8888/table/animals",{
            method:'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => (res.json())).then((data) => {
            $homes.empty();
            this.animals = data['result'];
            $.each(this.animals, (index, animal) => {
                var url = `./uploads/home/${ animal['id'] }-${ animal['name'] }.png`;
                $.get(url)
                    .done(function() { 
                        $homes.append(`
                            <div class="home" data-id="${ animal.id }" data-name="${ animal.name }">
                                <img src="./uploads/home/${ animal['id'] }-${ animal['name'] }.png">
                            </div>
                        `);
                    }).fail(function() { 
                        console.log("Not EXIST")
                        console.log(animal['name'])
                    });
            });
            $homes.show();
        });
    }

    preview_model(id, name) {
        //לחצה על קפטור שמיעת השם והקול
        if(this.arabic) {
            this.arabic.pause();
            this.hebrew.pause();
        }
        
        //לחיצה על כפתור לפני 
        if(id == "prev") {
            var $element = $('.home[data-id="' + $(".preview_model").attr("id") + '"]').prev();
            $element = $element.length ? $element: $('.home:last-child')
            id = $element.data("id"); 
            $('.home[data-id="' + id + '"]').click();
            return;
        }
        //לחיצה על כפתור אחרי
        if(id == "next") {
            var $element = $('.home[data-id="' + $(".preview_model").attr("id") + '"]').next();
            $element = $element.length ? $element: $('.home:first-child').next() 
            id = $element.data("id"); 
            $('.home[data-id="' + id + '"]').click();
            return;
        }

        //הערךך של ה אי די אם יש ??
        if(parseFloat(id)||id=="0") {
            this.animalpageid = id;
        }

        //הקול והשם המתאים לקל תמונה
        this.createAnimalPage(id, name);

        let file_arabic = new Audio(`./uploads/ar_home_name/${ id }-${ name }.mp3`);
        let file_hebrew = new Audio(`./uploads/he_home_name/${ id }-${ name }.mp3`);

        this.arabic = file_arabic;
        this.hebrew = file_hebrew;

        setTimeout(() => {
            this.arabic.play();
            setTimeout(() => {
                this.hebrew.play();
            }, 3000);
        }, 1000);

    }
    
    createAnimalPage(id, name){
        $('.preview_model').attr("id", id).empty();
        $('.preview_model')
            .append(`<img class="main" src="./uploads/home/${ id }-${ name }.png">`)
            .append('<img class="hide" aria-hidden="true" src="./imgs/x.png">')
            .append('<img class="play" lang="AR" aria-hidden="true" src="./imgs/arab.jpg">')
            .append('<img class="play" lang="HE" aria-hidden="true" src="./imgs/heb.png">')

        if (id == 0) { $('.prev').remove() }
        if (id == 9) { $('.next').remove() }

        $('.preview_model').show();
    }
    
    //שתיקה לקול
    pause_sound() {
        this.arabic.pause();
        this.hebrew.pause();
    }

    //הפעלת והשקטת הקול
    play_sound(sound) {
        this.pause_sound();
        if(sound == "AR") { return this.arabic.play() }
        if(sound == "HE") { return this.hebrew.play() }
    }
}

function init_homes() {

    const homes = new Homes();  
  
    $(document).on("click", ".main", function () {
        var half = $(document).width() / 2;
        homes.preview_model(half > event.pageX ? "prev": "next");
    });

    $('.main').click(() => {
        $(this).show();
    });

    $(document).on("click", ".preview_model .play", function(e) {
        homes.play_sound($(this).attr("lang"));
    });

    $(document).on("click", ".homes .home", function(e) {
        homes.preview_model($(this).data("id"), $(this).data("name"));
    });

    homes.createHomes();
}
